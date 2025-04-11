
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
      <nav className="container-wide flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-colink-navy">
            CoLink<span className="text-colink-teal">Venture</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-colink-teal">Home</Link>
          <Link to="/partnerships-info" className="text-sm font-medium hover:text-colink-teal">Partnerships</Link>
          <Link to="/sponsorships-info" className="text-sm font-medium hover:text-colink-teal">Sponsorships</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-colink-teal">Contact</Link>
        </div>
        
        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to={user.user_metadata?.accountType === "sponsorship" ? "/sponsorships" : "/partnerships"}>
                  Dashboard
                </Link>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatarUrl} />
                <AvatarFallback>
                  {user.user_metadata?.displayName?.substring(0, 2) || user.email?.substring(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?action=signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <SheetHeader className="text-left">
              <SheetTitle className="text-2xl font-bold text-colink-navy">
                CoLink<span className="text-colink-teal">Venture</span>
              </SheetTitle>
              <SheetDescription>
                Connect, Partner, and Grow
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-1">
              {user && (
                <div className="flex items-center mb-6 p-2 bg-gray-50 rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata?.avatarUrl} />
                    <AvatarFallback>
                      {user.user_metadata?.displayName?.substring(0, 2) || user.email?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {user.user_metadata?.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              <SheetClose asChild>
                <Link 
                  to="/"
                  className="flex w-full items-center py-2 text-lg font-medium"
                >
                  Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link 
                  to="/partnerships-info"
                  className="flex w-full items-center py-2 text-lg font-medium"
                >
                  Partnerships
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link 
                  to="/sponsorships-info"
                  className="flex w-full items-center py-2 text-lg font-medium"
                >
                  Sponsorships
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link 
                  to="/contact"
                  className="flex w-full items-center py-2 text-lg font-medium"
                >
                  Contact
                </Link>
              </SheetClose>
              
              {user && (
                <SheetClose asChild>
                  <Link 
                    to={user.user_metadata?.accountType === "sponsorship" ? "/sponsorships" : "/partnerships"}
                    className="flex w-full items-center py-2 text-lg font-medium text-colink-teal"
                  >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                </SheetClose>
              )}
            </div>
            <SheetFooter className="mt-auto pt-4">
              {user ? (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <SheetClose asChild>
                    <Button className="w-full" asChild>
                      <Link to="/auth?action=signup">Sign Up</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                  </SheetClose>
                </div>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
