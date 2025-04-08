
import React from "react";
import Navbar from "@/components/landing/Navbar";
import BusinessSearch from "@/components/business/BusinessSearch";

const Sponsorships = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Sponsorship Opportunities</h1>
        <p className="text-gray-600 mb-6">
          Find sponsors for your initiatives, events, and projects.
        </p>
        
        <div className="mt-8">
          <BusinessSearch platformType="sponsorship" />
        </div>
      </div>
    </div>
  );
};

export default Sponsorships;
