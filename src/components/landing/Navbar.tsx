
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/types";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    href: "#pricing",
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

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="container-wide flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b2f72189-44d3-499b-820d-4f1b98ea3cb7.png" 
              alt="CoLink Venture" 
              className="h-8" 
            />
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {mainNavItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-colink-teal transition-colors"
              >
                {item.title}
              </a>
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
                    <a href={item.href} className="p-2 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" className="border-colink-navy text-colink-navy hover:bg-colink-navy/10">Log In</Button>
          <Button className="bg-colink-navy hover:bg-colink-navy/90 text-white">Sign Up</Button>
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="container md:hidden py-4">
          <nav className="flex flex-col gap-4">
            {mainNavItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-base font-medium hover:text-colink-teal transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </a>
            ))}
            <div className="py-2">
              <p className="text-sm font-medium text-gray-500 mb-2">Platforms</p>
              {platformNavItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block py-2 text-base font-medium hover:text-colink-teal"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" className="border-colink-navy text-colink-navy hover:bg-colink-navy/10 w-full">Log In</Button>
              <Button className="bg-colink-navy hover:bg-colink-navy/90 text-white w-full">Sign Up</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
