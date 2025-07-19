/* eslint-disable @typescript-eslint/no-explicit-any */

// Since we don't have access to the full Auth.tsx file in the current code state,
// we'll need to create a new component that adds a Back to Home link

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import emailjs from '@emailjs/browser';
import { apiCall } from "@/config/api";

const Auth = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fromBeta = searchParams.get('from') === 'beta';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetStep, setResetStep] = useState(1); // 1: email entry, 2: code verification, 3: new password

  // If already logged in, redirect to appropriate page
  if (user) {
    // If coming from beta, go back to beta
    if (fromBeta) {
      console.log('User already logged in, redirecting to beta');
      return <Navigate to="/beta" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiCall('/users/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: data.message || "Failed to sign in"
        });
      } else {
        // Store auth data in session storage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));        // Store auth data in session storage
        sessionStorage.setItem('accountType', JSON.stringify(data.user.accountType));        // Store auth data in session storage
        sessionStorage.setItem('SIGNED_IN', 'true');
        const onboarded = sessionStorage.getItem('onboarded');
        console.log(onboarded);
        
        console.log('Sign in successful, fromBeta:', fromBeta);
        
        // Always redirect to beta after successful login
        navigate("/beta");
        return;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (resetStep === 1) {
        // Generate a 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store the code temporarily (in a real app, this would be stored server-side)
        sessionStorage.setItem('resetCode', verificationCode);
        sessionStorage.setItem('resetEmail', resetEmail);
        
        // Send verification code via email
        const templateParams = {
          email: resetEmail,
          name: resetEmail.split('@')[0],
          from_name: "CoLink Venture",
          company_name: "CoLink Venture",
          reset_code: verificationCode,
          message: `You have requested a password change\n\nWe received a request to reset the password for your account. Your verification code is:\n\n${verificationCode}\n\nThis code will expire in one hour.\n\nIf you didn't request this password reset, please ignore this email or let us know immediately. Your account remains secure.\n\nBest regards,\nCoLink Venture Team`
        };

        await emailjs.send('service_lg2k11c', 'template_kryjiil', templateParams, '1mdOzw4v6z97Xfr0i');
        
        toast({
          title: "Code Sent",
          description: "A verification code has been sent to your email."
        });
        
        setResetStep(2);
      } else if (resetStep === 2) {
        // Verify the code
        const storedCode = sessionStorage.getItem('resetCode');
        if (resetCode === storedCode) {
          setResetStep(3);
        } else {
          toast({
            variant: "destructive",
            title: "Invalid Code",
            description: "The verification code is incorrect."
          });
        }
      } else if (resetStep === 3) {
        // Reset password
        const response = await apiCall('/users/reset-password', {
          method: 'POST',
          body: JSON.stringify({
            email: resetEmail,
            newPassword: newPassword
          })
        });

        if (response.ok) {
          toast({
            title: "Password Reset",
            description: "Your password has been reset successfully."
          });
          
          // Clean up
          sessionStorage.removeItem('resetCode');
          sessionStorage.removeItem('resetEmail');
          
          // Return to sign in
          setShowForgotPassword(false);
          setResetStep(1);
          setResetEmail("");
          setResetCode("");
          setNewPassword("");
        } else {
          const data = await response.json();
          toast({
            variant: "destructive",
            title: "Password Reset Failed",
            description: data.message || "Failed to reset password"
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message || "Something went wrong."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signupData = {
        email: email,
        password: password,
        displayName: "",
        bio: "",
        avatarUrl: "",
        website: "",
        industry: "",
        interests: "",
        accountType: "partnership",
      };

      const response = await apiCall("/users/register", {
        method: 'POST',
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: data.message || "Failed to create account"
        });
      } else {
        // Store auth data in session storage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('onboarded', "!onboarded");

        // Send welcome email
        const templateParams = {
          email: signupData.email,
          name: email.split('@')[0],
          from_name: "CoLink Venture",
          message: "Welcome to CoLink Venture!"
        };

        emailjs.send('service_nmp9326', 'template_t5a8qwp', templateParams, 'JEOwNb-hlyrgzUx-F')
          .then((result) => {
            console.log('Email sent successfully:', result.text);
          }, (error) => {
            console.log('Failed to send email:', error.text);
          });

        toast({
          title: "Account created",
          description: data.Accountcreated || "Your account has been created successfully."
        });

        // Switch to sign in tab after successful signup
        setActiveTab("signin");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* Back to Home Link */}
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            CoLink Venture
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Connect, Partner, and Grow with CoLink Venture
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signin-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signin-password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button 
                      type="button" 
                      variant="link" 
                      className="p-0 h-auto text-sm text-blue-600" 
                      onClick={() => {
                        setShowForgotPassword(true);
                        setResetEmail(email);
                      }}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create an account to access all features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters.
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  {resetStep === 1 && "Enter your email to receive a verification code"}
                  {resetStep === 2 && "Enter the verification code sent to your email"}
                  {resetStep === 3 && "Enter your new password"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {resetStep === 1 && (
                    <div className="space-y-2">
                      <label htmlFor="reset-email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="name@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  
                  {resetStep === 2 && (
                    <div className="space-y-2">
                      <label htmlFor="reset-code" className="text-sm font-medium">
                        Verification Code
                      </label>
                      <Input
                        id="reset-code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  
                  {resetStep === 3 && (
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Password must be at least 6 characters.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetStep(1);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Processing..." : resetStep === 1 ? "Send Code" : resetStep === 2 ? "Verify Code" : "Reset Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
