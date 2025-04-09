
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
import { Search, Calendar } from "lucide-react";
import { Business } from "@/types";
import { useToast } from "@/components/ui/use-toast";

// Mock data - in a real app this would come from Supabase
const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Tech Solutions Inc",
    description: "Enterprise software solutions provider specializing in AI and automation.",
    logo: "https://via.placeholder.com/150",
    industry: "Technology",
    partnershipOffers: ["Software Integration", "API Development", "Tech Consulting"],
    sponsorshipOffers: ["Tech Conference", "Hackathon Events"]
  },
  {
    id: "2",
    name: "Creative Studios",
    description: "Creative design agency offering branding, web design, and digital marketing.",
    logo: "https://via.placeholder.com/150",
    industry: "Design",
    partnershipOffers: ["Brand Collaboration", "Content Creation"],
    sponsorshipOffers: ["Art Exhibition", "Design Workshop"]
  },
  {
    id: "3",
    name: "Marketing Experts",
    description: "Full-service marketing agency with expertise in digital and traditional channels.",
    logo: "https://via.placeholder.com/150",
    industry: "Marketing",
    partnershipOffers: ["Co-marketing Campaigns", "Influencer Partnerships"],
    sponsorshipOffers: ["Marketing Conference", "Industry Events"]
  },
  {
    id: "4",
    name: "Event Masters",
    description: "Professional event planning and management services for corporate clients.",
    logo: "https://via.placeholder.com/150",
    industry: "Events",
    partnershipOffers: ["Venue Partnership", "Logistics Collaboration"],
    sponsorshipOffers: ["Corporate Events", "Conference Sponsorship"]
  },
];

interface BusinessSearchProps {
  platformType: "partnership" | "sponsorship";
  initialSearch?: string;
  businessId?: string | null;
}

const BusinessSearch: React.FC<BusinessSearchProps> = ({ platformType, initialSearch = "", businessId = null }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Effect to handle businessId if provided
  useEffect(() => {
    if (businessId) {
      const business = mockBusinesses.find(b => b.id === businessId);
      if (business) {
        setSelectedBusiness(business);
        setIsDialogOpen(true);
      }
    }
  }, [businessId]);
  
  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchTerm = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.industry.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Check if the business has offers for the current platform type
    const hasOffers = platformType === 'partnership' 
      ? !!business.partnershipOffers?.length
      : !!business.sponsorshipOffers?.length;
      
    return matchTerm && hasOffers;
  });
  
  const handleConnectClick = (business: Business) => {
    // Navigate to business details page
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
      </div>
      
      {searchTerm && filteredBusinesses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No businesses found matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBusinesses.map((business) => (
            <Card key={business.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{business.name}</CardTitle>
                    <CardDescription>{business.industry}</CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <img 
                      src={business.logo} 
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
