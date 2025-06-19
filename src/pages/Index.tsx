
import React, { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import BusinessSlider from "@/components/landing/BusinessSlider";
import Footer from "@/components/landing/Footer";
import BenefitSection from "@/components/landing/BenefitSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for onboarded value in session storage and redirect if needed
  useEffect(() => {
    const onboarded = sessionStorage.getItem('onboarded');
    const isSignedIn = sessionStorage.getItem('SIGNED_IN') === 'true';
    
    // Only redirect to onboarding if user is signed in
    if (onboarded && isSignedIn) {
      navigate('/onboarding');
    }
  }, [navigate]);
  
  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!searchQuery.trim()) {
        setFilteredSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/businesses/');
        const data = await response.json();
        
        const filtered = data.businesses.filter(business => 
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.industry?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setFilteredSuggestions(filtered);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timer = setTimeout(fetchBusinesses, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/partnerships?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        <BenefitSection />
        
        {/* Service Search Section */}
        <section className="bg-white py-16">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-colink-dark mb-6">
                Find the Perfect Business Match
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Search for businesses by industry, service, or partnership type to find your ideal collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <div className="flex-1 relative">
                  <Popover open={open && filteredSuggestions.length > 0} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for services, industries, or businesses..." 
                          className="pl-10 py-6 rounded-lg"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                              setOpen(false);
                            }
                          }}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[calc(100%-2rem)] max-w-xl" align="start">
                      <Command>
                        <CommandList>
                          <CommandEmpty>{isLoading ? 'Loading...' : 'No results found.'}</CommandEmpty>
                          <CommandGroup heading="Suggestions">
                            {filteredSuggestions.map((business) => (
                              <CommandItem
                                key={business.id}
                                onSelect={() => {
                                  setSearchQuery(business.name);
                                  setOpen(false);
                                  navigate(`/business/${business.id}?type=partnership`);
                                }}
                                className="cursor-pointer"
                              >
                                <Search className="mr-2 h-4 w-4" />
                                <span>{business.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {business.industry}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button className="btn-primary py-6" onClick={handleSearch}>Search</Button>
              </div>
            </div>
          </div>
        </section>
        
        <Features />
        <BusinessSlider />
        
        {/* Platform Selection */}
        <section className="section bg-white">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-colink-dark">
                Choose Your Path to Success
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
                Whether you're looking to form partnerships or secure sponsorships, CoLink Venture has the tools you need.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-colink-blue/10 to-colink-blue/5 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold text-colink-blue mb-4">
                  Partnerships Platform
                </h3>
                <p className="text-gray-700 mb-6">
                  Connect with compatible businesses to create strategic partnerships that drive growth for both parties.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-colink-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Find businesses with complementary services
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-colink-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Create and manage partnership agreements
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-colink-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Track and measure partnership success
                  </li>
                </ul>
                <Button className="btn-primary w-full" asChild>
                  <Link to="/partnerships-info">Explore Partnerships</Link>
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-colink-purple/10 to-colink-purple/5 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold text-colink-purple mb-4">
                  Sponsorships Platform
                </h3>
                <p className="text-gray-700 mb-6">
                  Find sponsors for your events and initiatives or discover sponsorship opportunities for your business.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-colink-purple mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Create and promote sponsorship packages
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-colink-purple mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Connect with potential sponsors
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-colink-purple mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Manage and track sponsorship ROI
                  </li>
                </ul>
                <Button className="btn-secondary w-full" asChild>
                  <Link to="/sponsorships-info">Discover Sponsorships</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-colink-blue to-colink-purple py-16">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Grow Your Business?
              </h2>
              <p className="text-xl mb-8">
                Join thousands of businesses already collaborating on CoLink Venture. Start your 14-day free trial today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-colink-blue hover:bg-gray-100 py-6 px-8 text-base" asChild>
                  <Link to="/auth?action=signup">Start Free Trial</Link>
                </Button>
                <Button className="bg-transparent border border-white text-white hover:bg-white/10 py-6 px-8 text-base" asChild>
                  <Link to="/contact">Schedule Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
