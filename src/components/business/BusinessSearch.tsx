/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Business } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const BusinessSearch: React.FC<BusinessSearchProps> = ({ platformType, initialSearch = "", businessId = null }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessesAndUsers = async () => {
      try {
        // Fetch both businesses and users in parallel
        const [businessesResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:3000/api/businesses/'),
          fetch('http://localhost:3000/api/users/getAllUsers')
        ]);
        
        const businessesData = await businessesResponse.json();
        const usersData = await usersResponse.json();
        
        // Create a map of user emails to account types for quick lookup
        const userAccountTypes = new Map();
        usersData.users.forEach((user: any) => {
          userAccountTypes.set(user.email, user.accountType);
        });
        
        // Process and filter businesses
        const filteredBusinesses = businessesData.businesses
          .map((business: any) => ({
            ...business,
            partnershipOffers: JSON.parse(business.partnershipOffers || '[]'),
            sponsorshipOffers: JSON.parse(business.sponsorshipOffers || '[]'),
            gallery: business.gallery ? JSON.parse(business.gallery) : [],
            // Add the owner's account type
            ownerAccountType: userAccountTypes.get(business.email) || userAccountTypes.get(business.owner?.email)
          }))
          .filter((business: any) => {
            // Match the platform type with the owner's account type
            const matchesAccountType = business.ownerAccountType === platformType;
            
            // Check if the business has relevant offers
            const hasOffers = platformType === 'partnership' 
              ? business.partnershipOffers && business.partnershipOffers.length > 0
              : business.sponsorshipOffers && business.sponsorshipOffers.length > 0;
              
            return matchesAccountType && hasOffers;
          });
        
        setBusinesses(filteredBusinesses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBusinessesAndUsers();
  }, [platformType]);
  
  useEffect(() => {
    if (businessId) {
      const business = businesses.find(b => b.id === businessId);
      if (business) {
        setSelectedBusiness(business);
        setIsDialogOpen(true);
      }
    }
  }, [businessId, businesses]);
  
  // Use the already fetched businesses for search suggestions
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setFilteredSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    
    // Filter the already fetched businesses based on search term
    const matchedBusinesses = businesses.filter(business => 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (business.description && business.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (business.industry && business.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredSuggestions(matchedBusinesses);
    setIsLoading(false);
    
  }, [searchTerm, businesses]);
  
  // Businesses are already filtered by platformType, just filter by search term
  const filteredBusinesses = businesses.filter(business => {
    if (!searchTerm) return true;
    
    return business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (business.description && business.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (business.industry && business.industry.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const pageCount = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + itemsPerPage);
  
  const handleConnectClick = (business: Business) => {
    navigate(`/business/${business.id}?type=${platformType}`);
  };
  
  const handleScheduleAppointment = () => {
    toast({
      title: "Appointment Requested",
      description: `Your appointment request with ${selectedBusiness?.name} has been sent.`,
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder={`Search for ${platformType} opportunities...`}
          className="pl-9" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {searchTerm && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
            ) : (
              filteredSuggestions.map((business) => (
                <div 
                  key={business.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => navigate(`/business/${business.id}?type=${platformType}`)}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center">
                    {business.logo ? (
                      <img src={business.logo} alt="" className="w-6 h-6 object-contain" />
                    ) : (
                      <div className="text-xs font-medium text-gray-500">{business.name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{business.name}</div>
                    <div className="text-xs text-gray-500">{business.industry}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {searchTerm && filteredBusinesses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No businesses found matching your search</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedBusinesses.map((business) => (
              <Card key={business.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{business.name}</CardTitle>
                      <CardDescription>{business.industry}</CardDescription>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <img 
                        src={business.logo || "https://via.placeholder.com/150"} 
                        alt={business.name} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{business.description}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">
                      {platformType === 'partnership' ? 'Partnership Opportunities:' : 'Sponsorship Opportunities:'}
                    </h4>
                    <ul className="list-disc list-inside text-sm">
                      {(platformType === 'partnership' ? business.partnershipOffers : business.sponsorshipOffers)?.map((offer, idx) => (
                        <li key={idx} className="text-muted-foreground">{offer}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleConnectClick(business)}>
                    CONNECT
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {pageCount > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({length: pageCount}).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    disabled={currentPage === pageCount}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with {selectedBusiness?.name}</DialogTitle>
            <DialogDescription>
              Schedule an appointment to discuss {platformType} opportunities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="font-medium mb-2">Available Opportunities:</h4>
            <ul className="list-disc list-inside mb-4">
              {(platformType === 'partnership' ? selectedBusiness?.partnershipOffers : selectedBusiness?.sponsorshipOffers)?.map((offer, idx) => (
                <li key={idx}>{offer}</li>
              ))}
            </ul>
            
            <div className="space-y-4 mt-6">
              <div>
                <h4 className="font-medium mb-2">Proposed Meeting Date</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <Input type="date" />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Message (Optional)</h4>
                <textarea 
                  className="w-full border rounded-md p-2 h-24"
                  placeholder="Add a brief message about what you'd like to discuss..."
                ></textarea>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleAppointment}>
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessSearch;
