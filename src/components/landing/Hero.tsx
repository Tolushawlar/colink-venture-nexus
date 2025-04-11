
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="hero-section bg-transparent relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-gray-50"></div>
        <div className="absolute top-[30%] right-[10%] w-64 h-64 bg-colink-blue/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[5%] w-80 h-80 bg-colink-blue/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-colink-navy mb-6">
              Simplify & Accelerate Community Partnerships and Sponsorships
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              CoLink Venture is an Innovative Platform Designed to Simplify and Accelerate Partnerships and Sponsorships in an Efficient Way to Access Mutually Beneficial Services and Resources.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              {!user ? (
                <>
                  <Button size="lg" className="btn-primary" asChild>
                    <Link to="/auth?action=signup">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-colink-blue text-colink-blue" asChild>
                    <Link to="/partnerships-info">Learn More</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="btn-primary" asChild>
                    <Link to="/partnerships">Go to Dashboard</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-colink-blue text-colink-blue" asChild>
                    <Link to="/posts">View Posts</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              {/* Main image */}
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                alt="CoLink business partnerships" 
                className="rounded-lg shadow-2xl w-full z-10 relative" 
              />
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-colink-purple/20 rounded-lg z-0"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-colink-blue/20 rounded-lg z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
