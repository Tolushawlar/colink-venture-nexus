
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Heart, Building, Palette, Landmark, Dumbbell, Utensils, Computer, Leaf, Briefcase, Home, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PartnershipCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const PartnershipCard = ({ title, description, icon, iconBgColor }: PartnershipCardProps) => (
  <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
    <CardHeader className="pb-4">
      <div className={`w-14 h-14 rounded-full ${iconBgColor} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <CardTitle className="text-xl text-colink-navy">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">{description}</p>
    </CardContent>
    <CardFooter>
      {/* <Button variant="outline" className="w-full" asChild>
        <Link to="/auth">Learn More</Link>
      </Button> */}
    </CardFooter>
  </Card>
);

const PartnershipsLanding = () => {
  const { user } = useAuth();
  
  const partnershipsData = [
    {
      title: "School and Education",
      description: "Partner with programs to enhance student learning, connect with service providers for additional educational opportunities.",
      icon: <GraduationCap size={28} className="text-white" />,
      iconBgColor: "bg-blue-500",
    },
    {
      title: "Social Service",
      description: "Connect with programs to address local needs, create long-term equity programs, and build meaningful relationships.",
      icon: <Heart size={28} className="text-white" />,
      iconBgColor: "bg-pink-500",
    },
    {
      title: "Healthcare",
      description: "Align with outreach programs sharing your mission, providing targeted healthcare services to address community needs.",
      icon: <Heart size={28} className="text-white" />,
      iconBgColor: "bg-red-500",
    },
    {
      title: "Art & Culture",
      description: "Collaborate with artists, cultural institutions, and sponsor joint exhibitions and performances to support art and culture.",
      icon: <Palette size={28} className="text-white" />,
      iconBgColor: "bg-purple-500",
    },
    {
      title: "Government",
      description: "Liaise with diverse external support programs, ensuring equity and justice, and support community leaders and changemakers.",
      icon: <Landmark size={28} className="text-white" />,
      iconBgColor: "bg-gray-700",
    },
    {
      title: "Recreation",
      description: "Collaborate with community programs to identify recreational programs supporting multiple demographics and driving positive change.",
      icon: <Dumbbell size={28} className="text-white" />,
      iconBgColor: "bg-green-400",
    },
    {
      title: "Food and Hospitality",
      description: "Connect with industry professionals to promote joint events, bringing together food, hospitality, and other industries.",
      icon: <Utensils size={28} className="text-white" />,
      iconBgColor: "bg-yellow-500",
    },
    {
      title: "Technology",
      description: "Connect with tech startups, entrepreneurs, and innovators to stay updated on advancements and explore partnerships.",
      icon: <Computer size={28} className="text-white" />,
      iconBgColor: "bg-blue-600",
    },
    {
      title: "Environment",
      description: "Collaborate with environmental organizations to address pressing issues, promote conservation, and create a sustainable future.",
      icon: <Leaf size={28} className="text-white" />,
      iconBgColor: "bg-green-500",
    },
    {
      title: "Business and Entrepreneurship",
      description: "Network with business owners, entrepreneurs, and industry leaders to share knowledge, resources, and support growth.",
      icon: <Briefcase size={28} className="text-white" />,
      iconBgColor: "bg-indigo-500",
    },
    {
      title: "Community Development",
      description: "Engage with community development programs to create positive change, improve quality of life, and foster a strong community.",
      icon: <Home size={28} className="text-white" />,
      iconBgColor: "bg-orange-500",
    },
    {
      title: "Nonprofit and Philanthropy",
      description: "Connect with non-profit organizations and philanthropic initiatives to support missions, contribute to causes, and make a difference.",
      icon: <Users size={28} className="text-white" />,
      iconBgColor: "bg-teal-500",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-colink-navy mb-6">
                Explore <span className="text-colink-teal">Partnerships</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Through our platform, individuals and organizations can form mutually beneficial partnerships, leveraging each other's strengths and resources to drive meaningful change.
              </p>
              {!user && (
                <Button className="btn-primary text-base py-6 px-8" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Partnerships Overview */}
        <section className="bg-white py-16">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-colink-navy mb-4">PARTNERSHIPS</h2>
              <p className="text-xl text-colink-teal mb-6">Dedicating everything to Partnerships</p>
              <p className="text-gray-600">
                CoLink's user-friendly interface makes it easier to find limitless connections to form mutually beneficial partnerships.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {partnershipsData.map((partnership, index) => (
                <PartnershipCard 
                  key={index}
                  title={partnership.title}
                  description={partnership.description}
                  icon={partnership.icon}
                  iconBgColor={partnership.iconBgColor}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-colink-blue to-colink-purple py-16">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Form Partnerships?
              </h2>
              <p className="text-xl mb-8">
                Join CoLink Venture today and start connecting with potential partners.
              </p>
              {!user ? (
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button className="bg-white text-colink-blue hover:bg-gray-100 py-6 px-8 text-base" asChild>
                    <Link to="/auth?action=signup">Sign Up Now</Link>
                  </Button>
                  <Button className="bg-transparent border border-white text-white hover:bg-white/10 py-6 px-8 text-base" asChild>
                    <Link to="/auth">Login</Link>
                  </Button>
                </div>
              ) : (
                <Button className="bg-white text-colink-blue hover:bg-gray-100 py-6 px-8 text-base" asChild>
                  <Link to="/partnerships">Go To Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PartnershipsLanding;
