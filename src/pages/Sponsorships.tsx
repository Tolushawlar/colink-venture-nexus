
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import BusinessSearch from "@/components/business/BusinessSearch";

const Sponsorships = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Sponsorship Opportunities</h1>
        <p className="text-gray-600 max-w-3xl">
          Find sponsors for your initiatives, events, and projects.
          Connect with businesses interested in supporting your vision.
        </p>
        
        <div className="mt-8">
          <BusinessSearch platformType="sponsorship" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sponsorships;
