/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { authenticatedApiCall } from "@/config/api";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

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
    console.log("Form submitted with values:", values);
    try {
      // Show loading toast
      toast({
        title: "Setting up your profile",
        description: "Please wait while we set up your account...",
      });

      // Update user profile with the form values
      const profileResponse = await authenticatedApiCall('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          accountType: values.accountType,
          displayName: values.displayName,
          bio: values.bio,
          website: values.website,
          industry: values.industry,
          interests: values.interests,
          avatarUrl: profileImage
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Profile update failed:', errorText);
        throw new Error('Failed to update profile');
      }

      // Map form values to business API payload
      const businessPayload = {
        name: values.businessName || values.displayName,
        description: values.businessDescription || values.bio,
        logo: profileImage  || "", // Use the uploaded profile image as the logo
        industry: values.industry,
        // Split and trim services/interests if they are comma-separated strings
        partnershipOffers: values.services?.split(',').map(s => s.trim()).filter(Boolean),
        sponsorshipOffers: values.interests?.split(',').map(s => s.trim()).filter(Boolean),
        website: values.website,
        email: values.email,
        phone: values.phone,
        location: values.address,
        gallery: galleryImages // Use the uploaded gallery images
      };

      try {
        console.log('Creating business with payload:', businessPayload);
        
        // Call business API to create a new business entry
        const response = await authenticatedApiCall('/businesses/', {
          method: 'POST',
          body: JSON.stringify(businessPayload),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Business API response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Business API error:", response.status, errorText);
          
          toast({
            title: "Warning",
            description: "Profile created but business details may not have been saved completely.",
            variant: "destructive"
          });
        } else {
          const businessData = await response.json();
          console.log('Business profile created successfully:', businessData);
          
          toast({
            title: "Success",
            description: "Business profile created successfully!",
          });
        }
      } catch (apiError) {
        console.error("Business API error:", apiError);
        
        toast({
          title: "Warning",
          description: "Profile created but business details may not have been saved.",
          variant: "destructive"
        });
      }

      // Success toast
      toast({
        title: "Profile setup complete!",
        description: "Your profile has been created successfully.",
      });

      // Store account type in sessionStorage (without quotes)
      sessionStorage.setItem('accountType', values.accountType);
      console.log('Setting accountType in sessionStorage:', values.accountType);
      
      // Remove onboarded flag from sessionStorage
      sessionStorage.removeItem('onboarded');
      console.log('Removed onboarded flag from sessionStorage');
      
      // Navigate to the appropriate dashboard based on account type after successful API call
      const accountType = values.accountType;
      console.log(`Navigating to /${accountType}s dashboard after onboarding`);
      navigate(`/${accountType}s`);

    } catch (error) {
      console.error("Error setting up profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem setting up your profile",
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

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // Upload image to Cloudinary via backend
      const response = await authenticatedApiCall('/uploads', {
        method: 'POST',
        body: formData,
        headers: {}
      });
      
      const data = await response.json();
      const imageUrl = data.data.imageUrl;
      console.log("Image uploaded successfully:", imageUrl);
      setProfileImage(imageUrl);
      
      toast({
        title: "Image uploaded", 
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsGalleryUploading(true);
    
    try {
      const uploadedUrls: string[] = [];
      
      // Upload each image to Cloudinary
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await authenticatedApiCall('/uploads', {
          method: 'POST',
          body: formData,
          headers: {}
        });
        
        const data = await response.json();
        const imageUrl = data.data.imageUrl;
        console.log(imageUrl);
        uploadedUrls.push(imageUrl);
      }
      
      // Add the new image URLs to the gallery
      setGalleryImages([...galleryImages, ...uploadedUrls]);
      
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} images.`,
      });
    } catch (error: any) {
      console.error('Gallery upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload gallery images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGalleryUploading(false);
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
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                          <span className="sr-only">Upload profile picture</span>
                        </label>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileImageUpload}
                          disabled={isUploading}
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
                              disabled={isGalleryUploading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <label className="w-20 h-20 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600">
                          {isGalleryUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <>
                              <Upload className="h-6 w-6" />
                              <span className="text-xs mt-1">Add</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            multiple
                            onChange={handleGalleryImageUpload}
                            disabled={isGalleryUploading}
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
                  <Button type="button" onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    nextStep();
                  }}>Continue</Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={async () => {
                      console.log('Complete Setup clicked');
                      console.log('Form values:', form.getValues());
                      console.log('Form errors:', form.formState.errors);
                      
                      const isValid = await form.trigger();
                      console.log('Form is valid:', isValid);
                      
                      if (isValid) {
                        const values = form.getValues();
                        await handleSubmit(values);
                      } else {
                        console.log('Form validation failed');
                        toast({
                          title: "Validation Error",
                          description: "Please check all fields, and fill in all required fields.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Complete Setup
                  </Button>
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