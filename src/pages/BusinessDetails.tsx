import React, { useEffect, useState, FormEvent } from "react";
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
  Copy,
  Building,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Business } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiCall } from "@/config/api";


const BusinessDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const searchParams = new URLSearchParams(location.search);
  // Check if this is a profile edit request
  const isProfileEdit = searchParams.get('profile') === 'edit';
  console.log("URL search params:", location.search, "isProfileEdit:", isProfileEdit);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Handle profile edit redirection
  useEffect(() => {
    if (isProfileEdit) {
      console.log("Profile edit detected, redirecting to profile page");
      // Set a flag in sessionStorage to prevent auto-navigation
      sessionStorage.setItem('skipAutoNavigation', 'true');
      // Use direct window location to break the navigation cycle
      window.location.href = '/profile';
    }
    
    // Cleanup function to remove the flag
    return () => {
      sessionStorage.removeItem('skipAutoNavigation');
    };
  }, [isProfileEdit]);
  
  // Fetch business details
  useEffect(() => {
    // Skip fetching if this is a profile edit
    if (isProfileEdit) return;
    
    const fetchBusinessDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await apiCall(`/businesses/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch business details: ${response.status}`);
        }

        const data = await response.json();
        console.log("Business data:", data); // Debug log
        setBusiness(data);
        
        // Fetch user posts after getting business details
        if (data.business?.owner?.id) {
          fetchUserPosts(data.business.owner.id);
        }
      } catch (err) {
        console.error("Error fetching business details:", err);
        setError(err instanceof Error ? err.message : "Failed to load business details");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async (ownerId) => {
      setLoadingPosts(true);
      try {
        const response = await apiCall('/posts');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        
        const data = await response.json();
        // Filter posts by owner ID and map field names
        const filteredPosts = data.posts
          .filter(post => post.user_id === ownerId)
          .map(post => ({
            ...post,
            id: post.id || `post-${Date.now()}-${Math.random()}`,
            createdAt: post.created_at,
            userId: post.user_id
          }));
        setPosts(filteredPosts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchBusinessDetails();
  }, [id, isProfileEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContact = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    if (!business) return;
    
    // Validate form fields
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to send your message.",
        variant: "destructive"
      });
      return;
    }
    
    setSendingEmail(true);
    
    try {
      const response = await apiCall("/send-email", {
        method: "POST",
        body: JSON.stringify({
          recipientEmail: business.business.owner.email,
          senderName: contactForm.name,
          senderEmail: contactForm.email,
          subject: contactForm.subject,
          message: contactForm.message,
          businessName: business.business.name
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }
      
      // Reset form on success
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${business.business.name}.`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to Send Message",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSendingEmail(false);
    }
  };

  let parsedPartnershipOffers = [];
  let parsedSponsorshipOffers = [];
  
  try {
    // Handle both string and array formats
    const partnershipData = business?.business?.partnership_offers || business?.business?.partnershipOffers;
    if (partnershipData) {
      if (typeof partnershipData === 'string') {
        parsedPartnershipOffers = JSON.parse(partnershipData);
      } else if (Array.isArray(partnershipData)) {
        parsedPartnershipOffers = partnershipData;
      }
    }
    if (!Array.isArray(parsedPartnershipOffers)) {
      parsedPartnershipOffers = [];
    }
  } catch (e) {
    console.error("Failed to parse partnershipOffers:", e);
    parsedPartnershipOffers = [];
  }

  try {
    // Handle both string and array formats
    const sponsorshipData = business?.business?.sponsorship_offers || business?.business?.sponsorshipOffers;
    if (sponsorshipData) {
      if (typeof sponsorshipData === 'string') {
        parsedSponsorshipOffers = JSON.parse(sponsorshipData);
      } else if (Array.isArray(sponsorshipData)) {
        parsedSponsorshipOffers = sponsorshipData;
      }
    }
    if (!Array.isArray(parsedSponsorshipOffers)) {
      parsedSponsorshipOffers = [];
    }
  } catch (e) {
    console.error("Failed to parse sponsorshipOffers:", e);
    parsedSponsorshipOffers = [];
  }

  const handleChat = () => {
    // Navigate to chats with business owner ID as parameter
    const ownerId = business?.business?.owner?.id || business?.business?.ownerId;
    if (ownerId) {
      navigate(`/chats?userId=${ownerId}`);
    } else {
      navigate('/chats');
    }

    toast({
      title: "Chat Started",
      description: `You can now chat with ${business?.business?.name || "this business"}.`,
    });
  };

  const handleScheduleAppointment = () => {
    // Navigate to appointments with business info as parameters
    const businessEmail = business?.business?.email || business?.business?.owner?.email;
    const businessName = business?.business?.name;
    
    const params = new URLSearchParams();
    if (businessEmail) params.set('attendeeEmail', businessEmail);
    if (businessName) params.set('attendeeName', businessName);
    params.set('openModal', 'true');
    
    navigate(`/appointments?${params.toString()}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading business details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !business) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-500 mb-4">{error || "Failed to load business details"}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <img
                src={business.business.logo}
                alt={business.business.name || "Business logo"}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{business.business.name}</h1>
              <p className="text-gray-500 mt-1">{business.business.industry}</p>
              <p className="mt-3 text-gray-700">{business.business.description}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
              {/* Check if this is the current user's own business */}
              {(() => {
                const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
                const currentUserId = currentUser.id;
                const businessOwnerId = business?.business?.owner_id || business?.business?.ownerId;
                const isOwnBusiness = businessOwnerId === currentUserId;
                
                return (
                  <>
                    <Button 
                      onClick={handleChat}
                      disabled={isOwnBusiness}
                      variant={isOwnBusiness ? "outline" : "default"}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {isOwnBusiness ? "Your Business" : "Chat"}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={handleScheduleAppointment}
                      disabled={isOwnBusiness}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

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
                <CardTitle>About {business.business.name}</CardTitle>
                <CardDescription>Company information and overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{business.business.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Industry</p>
                      <p className="text-gray-700">{business.business.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-gray-700">{business.business.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a href={business.business.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                        {business.business.website?.replace(/^https?:\/\//, '')}
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
                <div>
                  <h3 className="text-lg font-semibold mb-3">Partnership Opportunities</h3>
                  {parsedPartnershipOffers && parsedPartnershipOffers.length > 0 ? (
                    <ul className="space-y-3">
                      {parsedPartnershipOffers.map((offer, index) => (
                        <li key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium">{offer}</div>
                          {/* <p className="text-gray-600 text-sm mt-1">
                            Contact us to explore this partnership opportunity.
                          </p> */}
                          {/* <Button size="sm" className="mt-2" onClick={handleContact}>
                            Learn More
                          </Button> */}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No partnership offers available at the moment.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Sponsorship Opportunities</h3>
                  {parsedSponsorshipOffers && parsedSponsorshipOffers.length > 0 ? (
                    <ul className="space-y-3">
                      {parsedSponsorshipOffers.map((offer, index) => (
                        <li key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium">{offer}</div>
                          {/* <p className="text-gray-600 text-sm mt-1">
                            Contact us to learn more about this sponsorship opportunity.
                          </p> */}
                          {/* <Button size="sm" className="mt-2" onClick={handleContact}>
                            Learn More
                          </Button> */}
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
                {business.business.gallery ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.isArray(business.business.gallery) 
                      ? business.business.gallery.map((image, index) => (
                          <div key={index} className="aspect-video rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      : JSON.parse(business.business.gallery).map((image, index) => (
                          <div key={index} className="aspect-video rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                    }
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
                {loadingPosts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <div key={post.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                            {post.type}
                          </div>
                        </div>
                        <p className="mt-3">{post.content}</p>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={async () => {
                              const postText = `${post.title}\n\n${post.content}`;
                              try {
                                await navigator.clipboard.writeText(postText);
                                toast({
                                  title: "Copied!",
                                  description: "Post content copied to clipboard.",
                                });
                              } catch (error) {
                                toast({
                                  title: "Copy failed",
                                  description: "Unable to copy to clipboard.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Post
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
                      <a href={`mailto:${business.business.owner.email}`} className="text-primary">
                        {business.business.owner.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a href={`tel:${business.business.phone}`} className="text-gray-700">
                        {business.business.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-gray-700">{business.business.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a href={business.business.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                        {business.business.website?.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                </div>

                {/* <div className="mt-6">
                  <h3 className="font-medium mb-3">Send a Message</h3>
                  <form onSubmit={handleContact} className="space-y-3">
                    <Input 
                      name="name"
                      placeholder="Your name" 
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input 
                      name="email"
                      placeholder="Your email" 
                      type="email" 
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input 
                      name="subject"
                      placeholder="Subject" 
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                    />
                    <Textarea 
                      name="message"
                      placeholder="Your message" 
                      className="min-h-32" 
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={sendingEmail}
                    >
                      {sendingEmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDetails;
