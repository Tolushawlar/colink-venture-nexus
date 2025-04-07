
import React from "react";
import { 
  Handshake, 
  Users, 
  Search, 
  MessageSquare, 
  Bot, 
  ShieldCheck,
  LucideIcon 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureItem } from "@/types";

const features: FeatureItem[] = [
  {
    title: "Strategic Partnerships",
    description: "Connect with compatible businesses to create mutually beneficial partnerships.",
    icon: Handshake,
  },
  {
    title: "Sponsorship Opportunities",
    description: "Find and secure sponsorships for your events and initiatives.",
    icon: Users,
  },
  {
    title: "Advanced Search",
    description: "Easily find businesses and services that match your specific needs.",
    icon: Search,
  },
  {
    title: "Real-time Messaging",
    description: "Communicate with potential partners through our secure messaging system.",
    icon: MessageSquare,
  },
  {
    title: "AI Assistance",
    description: "Get guidance and suggestions from our AI-powered assistant.",
    icon: Bot,
  },
  {
    title: "Verified Businesses",
    description: "All businesses are verified to ensure legitimate partnerships.",
    icon: ShieldCheck,
  },
];

const Features = () => {
  return (
    <section className="section bg-white" id="solutions">
      <div className="container-wide">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-colink-navy">
            Your All-in-One Platform for Business Growth
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            CoLink Venture provides powerful tools and features to help your business connect, collaborate, and grow through strategic partnerships and sponsorships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-colink-teal/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-colink-teal" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
