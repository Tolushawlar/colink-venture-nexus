
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import BusinessSearch from "@/components/business/BusinessSearch";

const Partnerships = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Partnership Opportunities</h1>
        <p className="text-gray-600 max-w-3xl">
          Connect with businesses for strategic partnerships and collaborations.
          Find the right match for your initiatives and grow together.
        </p>
        
        <div className="mt-8">
          <BusinessSearch platformType="partnership" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Partnerships;
