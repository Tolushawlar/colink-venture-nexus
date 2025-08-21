import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, ArrowRight } from 'lucide-react';
import { authenticatedApiCall } from '@/config/api';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface BusinessCategoriesProps {
  type: 'partnerships' | 'sponsorships';
  onCategorySelect: (category: string) => void;
}

interface Business {
  id: string;
  name: string;
  industry: string;
  description: string;
  logo?: string;
}

const BusinessCategories: React.FC<BusinessCategoriesProps> = ({ type, onCategorySelect }) => {
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
      const response = await authenticatedApiCall(`/businesses/categories/${type}`);
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load business categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessesByCategory = async (category: string) => {
    try {
      setBusinessesLoading(true);
      const response = await authenticatedApiCall(`/businesses/${type}/category/${encodeURIComponent(category)}`);
      
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
        setSelectedCategory(category);
      } else {
        throw new Error('Failed to fetch businesses');
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load businesses for this category',
        variant: 'destructive',
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
              <Button variant="ghost" size="sm" onClick={handleBackToCategories}>
                ← Back
              </Button>
              <span>{selectedCategory} - {type === 'partnerships' ? 'Partnership' : 'Sponsorship'} Opportunities</span>
            </div>
          ) : (
            `${type === 'partnerships' ? 'Partnership' : 'Sponsorship'} Categories`
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
                    <Badge variant="secondary">{category}</Badge>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    View {type === 'partnerships' ? 'partnership' : 'sponsorship'} opportunities
                  </span>
                </Button>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No {type} categories available yet.</p>
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
                <Card key={business.id} className="hover:shadow-md transition-shadow">
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
                        <h3 className="font-semibold text-lg">{business.name}</h3>
                        <Badge variant="outline" className="mb-2">
                          {business.industry}
                        </Badge>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {business.description}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/business/${business.id}?type=${type.slice(0, -1)}`)}
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
                <p className="text-gray-500">No businesses found in this category.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessCategories;