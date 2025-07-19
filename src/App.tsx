
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Partnerships from "./pages/Partnerships";
import Sponsorships from "./pages/Sponsorships";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Appointments from "./pages/Appointments";
import Chats from "./pages/Chats";
import Posts from "./pages/Posts";
import BusinessDetails from "./pages/BusinessDetails";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PartnershipsLanding from "./pages/PartnershipsLanding";
import SponsorshipsLanding from "./pages/SponsorshipsLanding";
import GoogleAuthCallback from "./components/GoogleAuthCallback";
import ComingSoon from "./pages/ComingSoon";
import React from "react";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ComingSoon />} />
    <Route path="/beta" element={<Index />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/contact-us" element={<ContactUs />} />
    <Route path="/partnerships-info" element={<PartnershipsLanding />} />
    <Route path="/sponsorships-info" element={<SponsorshipsLanding />} />
    <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/auth" element={<Auth />} />
    <Route 
      path="/onboarding" 
      element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/partnerships" 
      element={
        <ProtectedRoute>
          <Partnerships />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/sponsorships" 
      element={
        <ProtectedRoute>
          <Sponsorships />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/appointments" 
      element={
        <ProtectedRoute>
          <Appointments />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/chats" 
      element={
        <ProtectedRoute>
          <Chats />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/posts" 
      element={
        <ProtectedRoute>
          <Posts />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/business/:id" 
      element={
        <ProtectedRoute>
          <BusinessDetails />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin-dashboard" 
      element={
        <ProtectedRoute adminOnly={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
