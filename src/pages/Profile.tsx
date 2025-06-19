/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  bio: z.string().optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  industry: z.string().min(1, "Please select an industry"),
  interests: z.string().optional(),
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

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      website: "",
      industry: "",
      interests: "",
    },
  });

  // Fetch user profile data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        
        const userData = response.data.user;
        
        // Update form with user data from API
        form.reset({
          displayName: userData.displayName || "",
          bio: userData.bio || "",
          website: userData.website || "",
          industry: userData.industry || "",
          interests: userData.interests || "",
        });
        
        // Set profile image
        setProfileImage(userData.avatarUrl || null);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [form, toast]);
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update user profile with form values and profile image
      const updateData = {
        displayName: values.displayName,
        bio: values.bio,
        website: values.website,
        industry: values.industry,
        interests: values.interests,
        avatarUrl: profileImage
      };
      
      await axios.put('http://localhost:3000/api/users/profile', updateData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Get account type from session storage
      const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
      const accountType = userData.accountType;
      
      // Navigate back to the user dashboard
      if (accountType === 'partnership') {
        navigate('/partnerships');
      } else {
        navigate('/sponsorships');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // Upload image to Cloudinary via backend
      const uploadResponse = await axios.post('http://localhost:3000/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      const imageUrl = uploadResponse.data.data.imageUrl;
      console.log(imageUrl);
      setProfileImage(imageUrl);
      
      // Immediately update user profile with new avatar URL
      await axios.put('http://localhost:3000/api/users/profile', {
        avatarUrl: imageUrl
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      toast({
        title: "Image uploaded", 
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name: string = "") => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            {isLoading ? (
              <CardContent className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
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
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click the camera icon to update your profile picture
                    </p>
                  </div>

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
                  
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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
                  
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests & Goals</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What kind of opportunities are you looking for?"
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
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => {
                      const accountType = sessionStorage.getItem('accountType')?.slice(1, -1);
                      if (accountType === 'partnership') {
                        navigate('/partnerships');
                      } else {
                        navigate('/sponsorships');
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
