
import React from "react";
import Navbar from "@/components/landing/Navbar";
import BusinessSearch from "@/components/business/BusinessSearch";

const Partnerships = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Partnership Opportunities</h1>
        <p className="text-gray-600 mb-6">
          Connect with businesses for strategic partnerships and collaborations.
        </p>
        
        <div className="mt-8">
          <BusinessSearch platformType="partnership" />
        </div>
      </div>
    </div>
  );
};

export default Partnerships;
