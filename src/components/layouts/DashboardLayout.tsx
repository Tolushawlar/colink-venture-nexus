
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  BarChart,
  Settings,
  LogOut,
  Building,
  UserCircle,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isAdmin = user?.email === "admin@colink.com" || user?.user_metadata?.role === "admin";
  const accountType = user?.user_metadata?.accountType || "partnership";
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  
  const menuItems = [
    {
      title: "Home",
      icon: Home,
      href: "/"
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: accountType === "sponsorship" ? "/sponsorships" : "/partnerships"
    },
    {
      title: "Profile",
      icon: UserCircle,
      href: "/profile"
    },
    {
      title: "Business Directory",
      icon: Building,
      href: accountType === "sponsorship" ? "/sponsorships" : "/partnerships"
    }
  ];
  
  // Add admin dashboard link if user is admin
  if (isAdmin) {
    menuItems.push({
      title: "Admin Dashboard",
      icon: BarChart,
      href: "/admin-dashboard"
    });
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatarUrl} />
                <AvatarFallback>{user ? getInitials(user.email) : "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.email}</span>
                <span className="text-xs text-muted-foreground capitalize">{accountType} Account</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <SidebarTrigger className="lg:hidden" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
