import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, ArrowRight } from "lucide-react";
import { authenticatedApiCall, apiCall } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface BusinessCategoriesProps {
  type: "partnerships" | "sponsorships";
  onCategorySelect: (category: string) => void;
}

interface Business {
  id: string;
  name: string;
  industry: string;
  description: string;
  logo?: string;
}

const BusinessCategories: React.FC<BusinessCategoriesProps> = ({
  type,
  onCategorySelect,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await authenticatedApiCall(
        `/businesses/categories/${type}`
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load business categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessesByCategory = async (category: string) => {
    try {
      setBusinessesLoading(true);
      
      // Fetch both businesses and users in parallel
      const [businessesResponse, usersResponse] = await Promise.all([
        authenticatedApiCall(`/businesses/${type}/category/${encodeURIComponent(category)}`),
        authenticatedApiCall('/users/getAllUsers')
      ]);
      
      if (businessesResponse.ok && usersResponse.ok) {
        const businessesData = await businessesResponse.json();
        const usersData = await usersResponse.json();
        
        // Create a map of user IDs to account types
        const userAccountTypes = new Map();
        usersData.users.forEach((user: any) => {
          userAccountTypes.set(user.id, user.account_type || user.accountType);
        });
        
        // Get current user data
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        const currentUserId = currentUser.id;
        
        // Filter businesses based on account type matching and category
        const platformType = type === 'partnerships' ? 'partnership' : 'sponsorship';
        const filteredBusinesses = (businessesData.businesses || [])
          .filter((business: any) => {
            // Exclude current user's own business
            if (business.owner_id === currentUserId || business.ownerId === currentUserId) {
              return false;
            }
            
            // Filter by category first
            if (business.industry !== category) {
              return false;
            }
            
            // Get the account type of the business owner
            const businessOwnerAccountType = userAccountTypes.get(business.owner_id || business.ownerId);
            
            // Filter based on platform type and account type matching
            if (platformType === 'partnership') {
              return businessOwnerAccountType === 'partnership';
            } else if (platformType === 'sponsorship') {
              return businessOwnerAccountType === 'sponsorship';
            }
            
            return false;
          });
        
        setBusinesses(filteredBusinesses);
        setSelectedCategory(category);
      } else {
        throw new Error("Failed to fetch businesses");
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast({
        title: "Error",
        description: "Failed to load businesses for this category",
        variant: "destructive",
      });
    } finally {
      setBusinessesLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    fetchBusinessesByCategory(category);
    onCategorySelect(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setBusinesses([]);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-colink-teal"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCategories}
              >
                ← Back
              </Button>
              <span>
                {selectedCategory?.charAt(0).toUpperCase() +
                  selectedCategory?.slice(1)}{" "}
                - {type === "partnerships" ? "Partnership" : "Sponsorship"}{" "}
                Opportunities
              </span>{" "}
            </div>
          ) : (
            `${
              type === "partnerships" ? "Partnership" : "Sponsorship"
            } Categories`
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-colink-teal/10 hover:border-colink-teal"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center justify-between w-full">
                    <Badge variant="secondary">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>{" "}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    View opportunities
                    {/* View {type === 'partnerships' ? 'partnership' : 'sponsorship'} opportunities */}
                  </span>
                </Button>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  No {type} categories available yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {businessesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-colink-teal"></div>
              </div>
            ) : businesses.length > 0 ? (
              businesses.map((business) => (
                <Card
                  key={business.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {business.logo && (
                        <img
                          src={business.logo}
                          alt={business.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {business.name}
                        </h3>
                        <Badge variant="outline" className="mb-2">
                          {business.industry.charAt(0).toUpperCase() +
                            business.industry.slice(1)}{" "}
                        </Badge>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {business.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/business/${business.id}?type=${type.slice(0, -1)}`
                          )
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  No businesses found in this category. Please log in with a {type === 'partnerships' ? 'sponsorship' : 'partnership'} account to view businesses.                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessCategories;
