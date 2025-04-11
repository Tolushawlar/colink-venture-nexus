
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Building,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Business } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAppointment } from "@/services/appointmentService";

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

// Form schema for appointment scheduling
const appointmentSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  purpose: z.string().min(5, {
    message: "Purpose must be at least 5 characters.",
  }),
  location: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const BusinessDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const platformType = searchParams.get('type') || 'partnership';

  // Initialize form
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: new Date(),
      time: "10:00",
      purpose: "",
      location: "Virtual Meeting",
    },
  });
  
  useEffect(() => {
    const fetchBusiness = async () => {
      setIsLoading(true);
      
      try {
        if (id) {
          // Try to fetch from the database first
          const { data, error } = await supabase
            .from("business_profiles")
            .select("*")
            .eq("id", id)
            .single();
          
          if (error || !data) {
            // If not found in database, use mock data
            const mockBusiness = mockBusinesses.find(b => b.id === id);
            
            if (mockBusiness) {
              setBusiness(mockBusiness);
            } else {
              toast({
                variant: "destructive",
                title: "Business Not Found",
                description: "The business you're looking for could not be found.",
              });
              navigate('/partnerships');
            }
          } else {
            // Business found in database
            setBusiness(data as Business);
          }
        }
      } catch (error) {
        console.error("Error fetching business:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load business details.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusiness();
  }, [id, navigate, toast]);
  
  const handleContact = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    toast({
      title: "Contact Request Sent",
      description: `Your contact request has been sent to ${business?.name}.`,
    });
  };
  
  const handleChat = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    navigate('/chats');
    
    toast({
      title: "Chat Started",
      description: `You can now chat with ${business?.name}.`,
    });
  };
  
  const handleScheduleAppointment = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setIsAppointmentDialogOpen(true);
  };
  
  const onSubmitAppointment = async (values: AppointmentFormValues) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the appointment
      await createAppointment({
        userId: business?.user_id || "",
        businessId: business?.id,
        date: format(values.date, "yyyy-MM-dd"),
        time: values.time,
        purpose: values.purpose,
        location: values.location
      });
      
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment with ${business?.name} has been scheduled for ${format(values.date, "PPP")} at ${values.time}.`,
      });
      
      setIsAppointmentDialogOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Scheduling Appointment",
        description: error.message || "Failed to schedule appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading business details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!business) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-muted-foreground">Business not found</p>
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
      
      {/* Appointment Scheduling Dialog */}
      <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule an Appointment</DialogTitle>
            <DialogDescription>
              Set up a meeting with {business.name}. You'll receive a confirmation once they accept.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAppointment)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe the purpose of this meeting"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Virtual meeting or physical address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAppointmentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Appointment'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BusinessDetails;
