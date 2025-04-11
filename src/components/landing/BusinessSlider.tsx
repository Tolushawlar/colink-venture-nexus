
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Business } from "@/types";

const businesses: Business[] = [
  {
    id: "1",
    name: "TechSolutions Inc.",
    description: "Providing innovative tech solutions for modern businesses.",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvbXBhbnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    industry: "Technology",
    partnershipOffers: ["Software Integration", "Tech Consulting"],
  },
  {
    id: "2",
    name: "EcoFriendly Solutions",
    description: "Sustainable products and services for eco-conscious businesses.",
    logo: "https://images.unsplash.com/photo-1542744094-24638eff58bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvbXBhbnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    industry: "Sustainability",
    sponsorshipOffers: ["Green Events", "Environmental Campaigns"],
  },
  {
    id: "3",
    name: "Creative Marketing",
    description: "Full-service marketing agency specializing in digital campaigns.",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbXBhbnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    industry: "Marketing",
    partnershipOffers: ["Brand Collaborations", "Joint Marketing"],
    sponsorshipOffers: ["Event Marketing"],
  },
  {
    id: "4",
    name: "Finance Experts LLC",
    description: "Professional financial services for businesses of all sizes.",
    logo: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvbXBhbnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    industry: "Finance",
    partnershipOffers: ["Financial Consulting"],
  },
  {
    id: "5",
    name: "HealthPlus",
    description: "Health and wellness solutions for corporate programs.",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGNvbXBhbnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    industry: "Health",
    sponsorshipOffers: ["Wellness Events", "Health Initiatives"],
  },
  {
    id: "6",
    name: "Global Logistics",
    description: "Worldwide shipping and logistics services for businesses.",
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNvbXBhbnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
    industry: "Logistics",
    partnershipOffers: ["Logistics Solutions", "Supply Chain Integration"],
  },
];

const BusinessSlider = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

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
        </div>

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
                    <p className="text-gray-600 text-sm mb-4">{business.description}</p>
                    <div className="flex gap-2">
                      {business.partnershipOffers && (
                        <Button variant="outline" size="sm" className="text-xs">
                          Partnerships
                        </Button>
                      )}
                      {business.sponsorshipOffers && (
                        <Button variant="outline" size="sm" className="text-xs">
                          Sponsorships
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSlider;
