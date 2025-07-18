
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Business } from "@/types";
import { apiCall } from "@/config/api";
import { Link } from "react-router-dom";

const BusinessSlider = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const businessesResponse = await apiCall('/businesses/');
        const usersResponse = await apiCall('/users/getAllUsers');
        
        if (businessesResponse.ok && usersResponse.ok) {
          const businessesData = await businessesResponse.json();
          const usersData = await usersResponse.json();
          
          // Create a map of user emails to account types
          const userAccountTypes = new Map();
          usersData.users.forEach((user: any) => {
            userAccountTypes.set(user.email, user.accountType);
          });
          
          // Process businesses
          const processedBusinesses = businessesData.businesses
            .map((business: any) => ({
              ...business,
              id: business.id,
              name: business.name,
              description: business.description,
              logo: business.logo || "https://via.placeholder.com/150",
              industry: business.industry,
              partnershipOffers: JSON.parse(business.partnership_offers || business.partnershipOffers || '[]'),
              sponsorshipOffers: JSON.parse(business.sponsorship_offers || business.sponsorshipOffers || '[]'),
              accountType: userAccountTypes.get(business.email) || "partnership"
            }))
            .filter((business: any) => business.name && business.logo);
          
          // Get featured businesses (limit to 6)
          setBusinesses(processedBusinesses.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
      setScrollPosition(sliderRef.current.scrollLeft - 300);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
      setScrollPosition(sliderRef.current.scrollLeft + 300);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        setScrollPosition(sliderRef.current.scrollLeft);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="section bg-gray-50">
      <div className="container-wide">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-colink-dark">
              Featured Businesses
            </h2>
            <p className="text-gray-600 mt-2">
              Discover businesses ready for partnerships and sponsorships
            </p>
          </div>
          {businesses.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                disabled={scrollPosition <= 0}
                className="rounded-full h-10 w-10"
              >
                <ArrowLeft size={18} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                className="rounded-full h-10 w-10"
              >
                <ArrowRight size={18} />
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading featured businesses...</p>
          </div>
        ) : businesses.length > 0 ? (
          <div 
            className="flex overflow-x-auto py-4 -mx-4 px-4 hide-scrollbar"
            ref={sliderRef}
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-6">
              {businesses.map((business) => (
                <Card key={business.id} className="min-w-[320px] shadow-sm">
                  <CardContent className="p-0">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 rounded-full mb-3">
                        {business.industry}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {business.partnershipOffers && business.partnershipOffers.length > 0 && (
                          <Button variant="outline" size="sm" className="text-xs">
                            Partnerships
                          </Button>
                        )}
                        {business.sponsorshipOffers && business.sponsorshipOffers.length > 0 && (
                          <Button variant="outline" size="sm" className="text-xs">
                            Sponsorships
                          </Button>
                        )}
                        <div className="ml-auto">
                          <Button asChild size="sm" variant="link" className="text-xs p-0">
                            <Link to={`/business/${business.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <p className="text-gray-500 mb-4">No featured businesses available</p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact us to be featured</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessSlider;
