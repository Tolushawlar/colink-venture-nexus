
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/types";
import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Solutions",
    href: "#solutions",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "About Us",
    href: "#about",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

const platformNavItems: NavItem[] = [
  {
    title: "Partnerships",
    href: "/partnerships",
    description: "Connect with businesses for strategic partnerships",
  },
  {
    title: "Sponsorships",
    href: "/sponsorships",
    description: "Find sponsors for your initiatives and events",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };
  
  const handleNavigateToAuth = () => {
    navigate("/auth");
    setIsOpen(false);
  };

  const getUserInitials = () => {
    if (!user) return "?";
    const email = user.email || "";
    return email.charAt(0).toUpperCase();
  };

  const isAdmin = user?.email === "admin@colink.com" || user?.user_metadata?.role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="container-wide flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b2f72189-44d3-499b-820d-4f1b98ea3cb7.png" 
              alt="CoLink Venture" 
              className="h-8" 
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {mainNavItems.map((item, index) => (
              item.href.startsWith("#") ? (
                <a
                  key={index}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-colink-teal transition-colors"
                >
                  {item.title}
                </a>
              ) : (
                <Link
                  key={index}
                  to={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-colink-teal transition-colors"
                >
                  {item.title}
                </Link>
              )
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-colink-teal">
                  Platforms <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                {platformNavItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link to={item.href} className="p-2 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User size={16} />
                  <span>{user.email}</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin-dashboard" className="flex items-center gap-2">
                      <Settings size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-red-500" onClick={handleSignOut}>
                  <LogOut size={16} />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" className="border-colink-navy text-colink-navy hover:bg-colink-navy/10" onClick={() => navigate("/auth")}>Log In</Button>
              <Button className="bg-colink-navy hover:bg-colink-navy/90 text-white" onClick={() => navigate("/auth?tab=signup")}>Sign Up</Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="container md:hidden py-4">
          <nav className="flex flex-col gap-4">
            {mainNavItems.map((item, index) => (
              item.href.startsWith("#") ? (
                <a
                  key={index}
                  href={item.href}
                  className="text-base font-medium hover:text-colink-teal transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </a>
              ) : (
                <Link
                  key={index}
                  to={item.href}
                  className="text-base font-medium hover:text-colink-teal transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              )
            ))}
            <div className="py-2">
              <p className="text-sm font-medium text-gray-500 mb-2">Platforms</p>
              {platformNavItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="block py-2 text-base font-medium hover:text-colink-teal"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        navigate("/admin-dashboard");
                        setIsOpen(false);
                      }}
                    >
                      <Settings size={16} />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="border-colink-navy text-colink-navy hover:bg-colink-navy/10 w-full"
                    onClick={handleNavigateToAuth}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="bg-colink-navy hover:bg-colink-navy/90 text-white w-full"
                    onClick={handleNavigateToAuth}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
