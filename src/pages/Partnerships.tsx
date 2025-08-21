
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import BusinessSearch from "@/components/business/BusinessSearch";
import BusinessCategories from "@/components/business/BusinessCategories";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Partnerships = () => {
  const { toast } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  const businessId = searchParams.get('business');
  
  // Set initial search state if coming from homepage search
  const [initialSearch, setInitialSearch] = useState(searchQuery || '');
  
  useEffect(() => {
    // Handle search parameter from URL if present
    if (searchQuery) {
      toast({
        title: "Search initialized",
        description: `Searching for: ${searchQuery}`,
      });
    }
    
    // Handle business ID parameter from URL if present
    if (businessId) {
      toast({
        title: "Business selected",
        description: `Viewing business details for ID: ${businessId}`,
      });
    }
  }, [searchQuery, businessId, toast]);

  const handleCategorySelect = (category: string) => {
    console.log('Selected category:', category);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Partnership Opportunities</h1>
        <p className="text-gray-600 max-w-3xl">
          Connect with businesses for strategic partnerships and collaborations.
          Find the right match for your initiatives and grow together.
        </p>
        
        <Tabs defaultValue="search" className="mt-8">
          <TabsList>
            <TabsTrigger value="search">Search Businesses</TabsTrigger>
            <TabsTrigger value="categories">Browse by Category</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-6">
            <BusinessSearch platformType="partnership" initialSearch={initialSearch} businessId={businessId} />
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            <BusinessCategories type="partnerships" onCategorySelect={handleCategorySelect} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Partnerships;
