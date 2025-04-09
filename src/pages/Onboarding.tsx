
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AccountType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";

const formSchema = z.object({
  accountType: z.enum(["partnership", "sponsorship"] as const),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  bio: z.string().optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  industry: z.string().min(1, "Please select an industry"),
  interests: z.string().optional(),
  // Business info
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
  services: z.string().optional(),
  // Contact info
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const industries = [
  "Technology",
  "Marketing",
  "Design",
  "Events",
  "Education",
  "Finance",
  "Healthcare",
  "Media",
  "Retail",
  "Other"
];

const Onboarding = () => {
  const { user, updateUserProfile } = useAuth();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "partnership",
      displayName: user?.user_metadata?.displayName || "",
      bio: "",
      website: "",
      industry: "",
      interests: "",
      businessName: "",
      businessDescription: "",
      services: "",
      email: user?.email || "",
      phone: "",
      address: "",
    },
  });
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update user profile with the form values
      await updateUserProfile({
        accountType: values.accountType,
        displayName: values.displayName,
        bio: values.bio,
        website: values.website,
        industry: values.industry,
        interests: values.interests,
        businessName: values.businessName,
        businessDescription: values.businessDescription,
        services: values.services,
        email: values.email,
        phone: values.phone,
        address: values.address,
        avatarUrl: profileImage,
        galleryImages: galleryImages
      });
      
      // Navigate to the appropriate dashboard based on account type
      if (values.accountType === "partnership") {
        navigate("/partnerships");
      } else {
        navigate("/sponsorships");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "There was a problem setting up your profile",
        variant: "destructive",
      });
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just create a local URL for the image
      // In a real app, you would upload this to storage
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
  
  const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setGalleryImages([...galleryImages, ...newImages]);
    }
  };
  
  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };
  
  const getInitials = (name: string = "") => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Complete your profile</CardTitle>
            <CardDescription>
              Step {step} of 4 • Tell us more about you to get started
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <CardContent>
                {step === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What are you looking for?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="partnership" id="partnership" />
                                <label htmlFor="partnership" className="font-medium">
                                  Partnerships
                                  <p className="text-sm text-muted-foreground">
                                    Find strategic business partners and collaborators
                                  </p>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sponsorship" id="sponsorship" />
                                <label htmlFor="sponsorship" className="font-medium">
                                  Sponsorships
                                  <p className="text-sm text-muted-foreground">
                                    Find sponsors for your initiatives or events
                                  </p>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name or organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry.toLowerCase()}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col items-center pt-4">
                      <div className="relative">
                        <Avatar className="w-24 h-24 border-2 border-white shadow-md">
                          {profileImage ? (
                            <AvatarImage src={profileImage} alt="Profile" />
                          ) : (
                            <AvatarFallback className="text-lg">
                              {getInitials(form.getValues("displayName"))}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <label 
                          htmlFor="profile-image" 
                          className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                          <span className="sr-only">Upload profile picture</span>
                        </label>
                        <input 
                          id="profile-image" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleProfileImageUpload}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Click the camera icon to upload your profile picture
                      </p>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a bit about yourself or your organization" 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            This will be shown on your profile.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourwebsite.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium mb-1">Gallery Images (optional)</h3>
                      <div className="flex flex-wrap gap-2">
                        {galleryImages.map((image, index) => (
                          <div key={index} className="relative w-20 h-20 border rounded">
                            <img 
                              src={image} 
                              alt={`Gallery ${index + 1}`} 
                              className="w-full h-full object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <label className="w-20 h-20 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600">
                          <Upload className="h-6 w-6" />
                          <span className="text-xs mt-1">Add</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            multiple 
                            onChange={handleGalleryImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Upload images to showcase your work or organization
                      </p>
                    </div>
                  </div>
                )}
                
                {step === 3 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business/Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your business or organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="businessDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what your business or organization does" 
                              className="min-h-24" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Services/Offerings</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List your main services or offerings, separated by commas" 
                              className="min-h-24" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            These will be shown in your business profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {step === 4 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@yourorganization.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your contact phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address (optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your business or organization address" 
                              className="min-h-20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interests & Goals</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={`What kind of ${form.getValues("accountType")} opportunities are you looking for?`}
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            This helps us match you with relevant opportunities.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="mt-6">
                      <h3 className="font-medium">Plan Selected: {user?.user_metadata?.plan || "Free"}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You can change your plan anytime from your account settings.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                {step > 1 ? (
                  <Button variant="outline" type="button" onClick={prevStep}>Back</Button>
                ) : (
                  <Button variant="outline" type="button" onClick={() => navigate("/")}>Cancel</Button>
                )}
                
                {step < 4 ? (
                  <Button type="button" onClick={nextStep}>Continue</Button>
                ) : (
                  <Button type="submit">Complete Setup</Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      
      <div className="hidden md:block md:w-1/2 bg-colink-navy p-12">
        <div className="h-full flex flex-col justify-center text-white max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            {step === 1 ? 'Welcome to CoLink Venture!' : 
             step === 2 ? 'Tell us your story' : 
             step === 3 ? 'Business Details' :
             'Almost there!'}
          </h2>
          <p className="mb-6 text-lg">
            {step === 1 ? 'First, let\'s understand your needs so we can tailor your experience.' : 
             step === 2 ? 'Share more about yourself or your organization to attract the right partners.' : 
             step === 3 ? 'Tell us about your business or services so we can showcase them to potential partners.' :
             'Just a few more details to help us find the perfect matches for you.'}
          </p>
          <div className="flex space-x-2 mb-8">
            <div className={`h-2 flex-1 rounded ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
            <div className={`h-2 flex-1 rounded ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
            <div className={`h-2 flex-1 rounded ${step >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
            <div className={`h-2 flex-1 rounded ${step >= 4 ? 'bg-white' : 'bg-white/30'}`}></div>
          </div>
          <div className="border-t border-white/20 pt-6">
            <blockquote className="italic">
              "CoLink Venture has transformed how we find business partnerships. We've closed deals that would have taken months to find otherwise."
            </blockquote>
            <div className="mt-4 font-medium">
              - Sarah Johnson, Marketing Director
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
