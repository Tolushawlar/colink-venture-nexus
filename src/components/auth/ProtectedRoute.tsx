
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-colink-teal"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if route requires admin privileges
  if (adminOnly) {
    const isAdmin = user.email === "admin@colink.com" || user.user_metadata?.role === "admin";
    
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }
  
  // Render children if authenticated and passes role check
  return <>{children}</>;
};

export default ProtectedRoute;
