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
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import emailjs from '@emailjs/browser';

const Auth = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  // If already logged in, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
        // const not = ""
        // if (onboarded) {
        //   navigate('/');
        // } else {
        //   navigate('/Onboarding');
        // }
        navigate("/")
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

      const response = await fetch("/api/users/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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
      </div>
    </div>
  );
};

export default Auth;
