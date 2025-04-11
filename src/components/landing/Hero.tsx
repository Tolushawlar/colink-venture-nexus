
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 pt-10 pb-20">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-colink-navy">
              Simplify & Accelerate Community{" "}
              <span className="text-colink-teal">Partnerships and Sponsorships</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              CoLink Venture is an Innovative Platform Designed to Simplify and Accelerate Partnerships and Sponsorships in an Efficient Way to Access Mutually Beneficial Services and Resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="btn-primary text-base py-6 px-8 flex items-center gap-2" asChild>
                <Link to={user ? "/partnerships" : "/partnerships-info"}>
                  Explore Partnerships <ArrowRight size={18} />
                </Link>
              </Button>
              <Button className="btn-secondary text-base py-6 px-8 flex items-center gap-2" asChild>
                <Link to={user ? "/sponsorships" : "/sponsorships-info"}>
                  Discover Sponsorships <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 pt-2">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-colink-teal/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-colink-navy/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-xl shadow-xl overflow-hidden bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Business collaboration"
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
