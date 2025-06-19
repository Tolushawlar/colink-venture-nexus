/* eslint-disable react-refresh/only-export-components */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface UserData {
  user_metadata: any;
  id: string;
  email: string;
  displayName: string;
  role: string;
  accountType?: 'partnership' | 'sponsorship';
}

type AuthContextType = {
  token: string | null;
  user: UserData | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (metadata: Record<string, any>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to manage auth state in both React state and sessionStorage
  const setAuthData = (newToken: string | null, newUser: UserData | null, signedIn: boolean) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      sessionStorage.setItem('token', newToken);
    } else {
      sessionStorage.removeItem('token');
    }
    if (newUser) {
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem('user');
    }
    if (signedIn) {
      sessionStorage.setItem('SIGNED_IN', 'true');
    } else {
      sessionStorage.removeItem('SIGNED_IN');
    }
  };

  useEffect(() => {
    // Check sessionStorage on component mount
    const storedSignedIn = sessionStorage.getItem('SIGNED_IN') === 'true';
    const storedToken = sessionStorage.getItem('token');
    const storedUserString = sessionStorage.getItem('user');
    
    // Always allow access to public pages
    if (location.pathname === '/' || 
        location.pathname === '/auth' || 
        location.pathname.includes('-info') || 
        location.pathname === '/about-us' || 
        location.pathname === '/contact-us' || 
        location.pathname === '/pricing') {
      setIsLoading(false);
    }

    if (storedSignedIn && storedToken && storedUserString) {
      try {
        const storedUser: UserData = JSON.parse(storedUserString);
        setToken(storedToken);
        setUser(storedUser);

        // Mark initial load as complete
        sessionStorage.setItem('initialLoadComplete', 'true');

        // Skip auto-navigation for certain protected pages or if skipAutoNavigation flag is set
        const isProtectedPage = 
          location.pathname === '/profile' || 
          location.pathname.startsWith('/business/') || 
          location.pathname === '/appointments' || 
          location.pathname === '/chats' || 
          location.pathname === '/posts';
        
        const skipAutoNavigation = sessionStorage.getItem('skipAutoNavigation') === 'true';
        
        if (!isProtectedPage && !skipAutoNavigation && location.pathname !== '/') {
          const accountType = sessionStorage.getItem('accountType');
          // const accountType = sessionStorage.getItem('accountType')?.slice(1, -1);
          const onboarded = sessionStorage.getItem('onboarded');

          console.log('Initial load - Account type:', accountType);

          if (onboarded && location.pathname !== '/onboarding') {
            console.log('Onboarding required, navigating to onboarding');
            navigate('/onboarding');
          } else if (accountType && !onboarded) {
            // Remove quotes if they exist in the accountType
            const cleanAccountType = accountType.replace(/^"(.*)"$/, '$1');
            console.log(`Navigating to /${cleanAccountType}s dashboard`);
            navigate(`/${cleanAccountType}s`);
          }

          toast({
            title: "Welcome back!",
            description: "Your session has been restored.",
          });
        }
      } catch (error) {
        console.error("Failed to parse stored user data from sessionStorage:", error);
        // Clear corrupted data if parsing fails
        setAuthData(null, null, false);
        toast({
          title: "Session corrupted",
          description: "Please sign in again.",
          variant: "destructive",
        });
        navigate('/'); // Redirect to login/home
      }
    } else {
      // If no valid session in sessionStorage, ensure state is cleared
      setAuthData(null, null, false);
      
      // If not on a public page and not signed in, redirect to homepage
      if (location.pathname !== '/' && 
          location.pathname !== '/auth' && 
          !location.pathname.includes('-info') && 
          location.pathname !== '/about-us' && 
          location.pathname !== '/contact-us' && 
          location.pathname !== '/pricing') {
        navigate('/');
      }
    }
    setIsLoading(false); // Initial loading is complete
  }, [navigate, location.pathname]); // Add location.pathname to dependencies

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setAuthData(data.token, data.user, true); // Set signedIn to true
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      const accountType = sessionStorage.getItem('accountType');
      // Clean the accountType by removing quotes if they exist
      const cleanAccountType = accountType ? accountType.replace(/^"(.*)"$/, '$1') : null;
      console.log('Sign in - Account type:', cleanAccountType);
      const onboarded = sessionStorage.getItem('onboarded');

      // if (!onboarded) {
      //   console.log(`Navigating to /${accountType}s dashboard after sign in`);
      //   navigate(`/${accountType}s`);
      // } else {
      //   console.log('No valid account type found after sign in, navigating to onboarding');
      //   navigate('/onboarding');
      // }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      setAuthData(null, null, false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, ...metadata }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setAuthData(data.token, data.user, true); // Set signedIn to true
      toast({
        title: "Account created",
        description: "You've successfully signed up! Welcome.",
      });

      const accountType = sessionStorage.getItem('accountType');
      if (!accountType) {
        navigate('/onboarding');
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      setAuthData(null, null, false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (metadata: Record<string, any>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(metadata),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      const updatedUser = { ...user, ...data.user };
      setAuthData(token, updatedUser, true); // Keep signedIn true

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Profile update failed",
        description: error.message || "An error occurred updating your profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Optional: if your backend has a logout endpoint
      // await fetch('/api/users/logout', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` },
      // });

      setAuthData(null, null, false); // Clear all session data
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    token,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
