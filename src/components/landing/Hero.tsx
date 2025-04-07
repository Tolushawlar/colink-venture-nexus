
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 pt-10 pb-20">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-colink-navy">
              Connect, Collaborate, and{" "}
              <span className="text-colink-teal">Grow Together</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              CoLink Venture brings businesses together through powerful partnerships and sponsorships. Find the right connections to take your business to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="btn-primary text-base py-6 px-8 flex items-center gap-2">
                Explore Partnerships <ArrowRight size={18} />
              </Button>
              <Button className="btn-secondary text-base py-6 px-8 flex items-center gap-2">
                Discover Sponsorships <ArrowRight size={18} />
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
