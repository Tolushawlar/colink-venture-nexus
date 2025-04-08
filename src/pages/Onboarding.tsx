
import React, { useState } from "react";
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

const formSchema = z.object({
  accountType: z.enum(["partnership", "sponsorship"] as const),
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

const Onboarding = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "partnership",
      displayName: user?.user_metadata?.name || "",
      bio: "",
      website: "",
      industry: "",
      interests: "",
    },
  });
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Here you would save the profile data to Supabase
      console.log("Submitting profile data:", values);
      
      // Mock successful update
      toast({
        title: "Profile created!",
        description: "Your profile has been set up successfully.",
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
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Complete your profile</CardTitle>
            <CardDescription>
              Step {step} of 3 • Tell us more about you to get started
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
                  </div>
                )}
                
                {step === 3 && (
                  <div className="space-y-4">
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
                
                {step < 3 ? (
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
             'Almost there!'}
          </h2>
          <p className="mb-6 text-lg">
            {step === 1 ? 'First, let\'s understand your needs so we can tailor your experience.' : 
             step === 2 ? 'Share more about yourself or your organization to attract the right partners.' : 
             'Just a few more details to help us find the perfect matches for you.'}
          </p>
          <div className="flex space-x-2 mb-8">
            <div className={`h-2 flex-1 rounded ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
            <div className={`h-2 flex-1 rounded ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
            <div className={`h-2 flex-1 rounded ${step >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
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
