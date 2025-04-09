
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  MessageSquare,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Share2,
  Building
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Business } from "@/types";

// Mock business data - in a real app this would come from Supabase
const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Tech Solutions Inc",
    description: "Enterprise software solutions provider specializing in AI and automation.",
    logo: "https://via.placeholder.com/150",
    industry: "Technology",
    partnershipOffers: ["Software Integration", "API Development", "Tech Consulting"],
    sponsorshipOffers: ["Tech Conference", "Hackathon Events"],
    website: "https://techsolutions-example.com",
    email: "partnerships@techsolutions-example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    gallery: [
      "https://via.placeholder.com/400x300?text=Office",
      "https://via.placeholder.com/400x300?text=Team",
      "https://via.placeholder.com/400x300?text=Product"
    ],
    posts: [
      {
        id: "b1p1",
        title: "Announcing Our New AI Platform",
        content: "We're excited to announce the launch of our new AI-driven analytics platform that helps businesses make data-driven decisions.",
        date: "2025-03-15",
        type: "update"
      },
      {
        id: "b1p2",
        title: "Join Our Partner Program",
        content: "We're expanding our partner program to include technology integration specialists. Apply now to become a certified Tech Solutions Partner.",
        date: "2025-03-05",
        type: "announcement"
      }
    ]
  },
  {
    id: "2",
    name: "Creative Studios",
    description: "Creative design agency offering branding, web design, and digital marketing.",
    logo: "https://via.placeholder.com/150",
    industry: "Design",
    partnershipOffers: ["Brand Collaboration", "Content Creation"],
    sponsorshipOffers: ["Art Exhibition", "Design Workshop"],
    website: "https://creativestudios-example.com",
    email: "hello@creativestudios-example.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    gallery: [
      "https://via.placeholder.com/400x300?text=Portfolio1",
      "https://via.placeholder.com/400x300?text=Portfolio2",
      "https://via.placeholder.com/400x300?text=Studio"
    ],
    posts: [
      {
        id: "b2p1",
        title: "Design Trends for 2025",
        content: "Our design experts analyze the top design trends to watch for in 2025 and how they'll impact brand identities.",
        date: "2025-04-02",
        type: "update"
      }
    ]
  },
  {
    id: "3",
    name: "Marketing Experts",
    description: "Full-service marketing agency with expertise in digital and traditional channels.",
    logo: "https://via.placeholder.com/150",
    industry: "Marketing",
    partnershipOffers: ["Co-marketing Campaigns", "Influencer Partnerships"],
    sponsorshipOffers: ["Marketing Conference", "Industry Events"],
    website: "https://marketingexperts-example.com",
    email: "info@marketingexperts-example.com",
    phone: "+1 (555) 789-0123",
    location: "Chicago, IL",
    gallery: [
      "https://via.placeholder.com/400x300?text=Campaign1",
      "https://via.placeholder.com/400x300?text=Campaign2"
    ],
    posts: [
      {
        id: "b3p1",
        title: "Case Study: Increasing Conversion by 200%",
        content: "Learn how we helped a SaaS startup triple their conversion rate through targeted digital marketing strategies.",
        date: "2025-03-25",
        type: "update"
      }
    ]
  },
  {
    id: "4",
    name: "Event Masters",
    description: "Professional event planning and management services for corporate clients.",
    logo: "https://via.placeholder.com/150",
    industry: "Events",
    partnershipOffers: ["Venue Partnership", "Logistics Collaboration"],
    sponsorshipOffers: ["Corporate Events", "Conference Sponsorship"],
    website: "https://eventmasters-example.com",
    email: "events@eventmasters-example.com",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    gallery: [
      "https://via.placeholder.com/400x300?text=Event1",
      "https://via.placeholder.com/400x300?text=Event2",
      "https://via.placeholder.com/400x300?text=Venue"
    ],
    posts: [
      {
        id: "b4p1",
        title: "Planning Your 2025 Corporate Events",
        content: "Start planning your 2025 corporate events now with our comprehensive guide to venue selection, budget planning, and theme development.",
        date: "2025-04-01",
        type: "service"
      }
    ]
  }
];

const BusinessDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const searchParams = new URLSearchParams(location.search);
  const platformType = searchParams.get('type') || 'partnership';
  
  // Fetch business details
  useEffect(() => {
    if (id) {
      const foundBusiness = mockBusinesses.find(b => b.id === id);
      if (foundBusiness) {
        setBusiness(foundBusiness);
      }
    }
  }, [id]);
  
  // Handle actions
  const handleContact = () => {
    toast({
      title: "Contact Request Sent",
      description: `Your contact request has been sent to ${business?.name}.`,
    });
  };
  
  const handleChat = () => {
    navigate('/chats');
    
    toast({
      title: "Chat Started",
      description: `You can now chat with ${business?.name}.`,
    });
  };
  
  const handleScheduleAppointment = () => {
    navigate('/appointments');
    
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with ${business?.name} has been scheduled.`,
    });
  };
  
  // Render loading state if business is not yet loaded
  if (!business) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading business details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <img 
                src={business.logo} 
                alt={business.name} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{business.name}</h1>
              <p className="text-gray-500 mt-1">{business.industry}</p>
              <p className="mt-3 text-gray-700">{business.description}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
              <Button onClick={handleContact}>
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Button variant="outline" onClick={handleChat}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <Button variant="secondary" onClick={handleScheduleAppointment}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </div>
          </div>
        </div>
        
        {/* Business Tabs */}
        <Tabs defaultValue="about">
          <TabsList className="grid grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About {business.name}</CardTitle>
                <CardDescription>Company information and overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{business.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Industry</p>
                      <p className="text-gray-700">{business.industry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-gray-700">{business.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                        {business.website?.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Services & Opportunities</CardTitle>
                <CardDescription>Available services and collaboration opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Partnership Offers */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Partnership Opportunities</h3>
                  {business.partnershipOffers && business.partnershipOffers.length > 0 ? (
                    <ul className="space-y-3">
                      {business.partnershipOffers.map((offer, index) => (
                        <li key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium">{offer}</div>
                          <p className="text-gray-600 text-sm mt-1">
                            Contact us to explore this partnership opportunity.
                          </p>
                          <Button size="sm" className="mt-2" onClick={handleContact}>
                            Learn More
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No partnership offers available at the moment.</p>
                  )}
                </div>
                
                {/* Sponsorship Offers */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sponsorship Opportunities</h3>
                  {business.sponsorshipOffers && business.sponsorshipOffers.length > 0 ? (
                    <ul className="space-y-3">
                      {business.sponsorshipOffers.map((offer, index) => (
                        <li key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium">{offer}</div>
                          <p className="text-gray-600 text-sm mt-1">
                            Contact us to learn more about this sponsorship opportunity.
                          </p>
                          <Button size="sm" className="mt-2" onClick={handleContact}>
                            Learn More
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No sponsorship offers available at the moment.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>Images and project portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                {business.gallery && business.gallery.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {business.gallery.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${business.name} gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No gallery images available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Posts</CardTitle>
                <CardDescription>Recent announcements and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {business.posts && business.posts.length > 0 ? (
                  <div className="space-y-6">
                    {business.posts.map((post) => (
                      <div key={post.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {post.date}
                          </div>
                          <div className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                            {post.type}
                          </div>
                        </div>
                        <p className="mt-3">{post.content}</p>
                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleContact}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No posts available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Ways to get in touch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href={`mailto:${business.email}`} className="text-primary">
                        {business.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a href={`tel:${business.phone}`} className="text-gray-700">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-gray-700">{business.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                        {business.website?.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Send a Message</h3>
                  <div className="space-y-3">
                    <Input placeholder="Your name" />
                    <Input placeholder="Your email" type="email" />
                    <Input placeholder="Subject" />
                    <Textarea placeholder="Your message" className="min-h-32" />
                    <Button onClick={handleContact} className="w-full">
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDetails;
