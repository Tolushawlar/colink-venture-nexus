
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
import { Camera } from "lucide-react";

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
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
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

  // Load user data into the form
  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.user_metadata?.displayName || "",
        bio: user.user_metadata?.bio || "",
        website: user.user_metadata?.website || "",
        industry: user.user_metadata?.industry || "",
        interests: user.user_metadata?.interests || "",
      });
      // Set profile image from user metadata if available
      setProfileImage(user.user_metadata?.avatarUrl || null);
    }
  }, [user, form]);
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update user profile with form values and profile image
      await updateUserProfile({
        displayName: values.displayName,
        bio: values.bio,
        website: values.website,
        industry: values.industry,
        interests: values.interests,
        avatarUrl: profileImage
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Navigate back to the user dashboard
      const accountType = user?.user_metadata?.accountType;
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
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just create a local URL for the image
      // In a real app, you would upload this to storage
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Show success toast
      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated.",
      });
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
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Upload profile picture</span>
                      </label>
                      <input 
                        id="profile-image" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
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
                      const accountType = user?.user_metadata?.accountType;
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
