
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";

const pricingTiers = [
  {
    name: "Free",
    price: 0,
    description: "Basic features for limited use",
    features: [
      "3 business connections per month",
      "Basic business profile",
      "Limited search filters",
      "Community access",
      "Basic messaging"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Starter",
    price: 9.99,
    description: "Everything you need to get started",
    features: [
      "15 business connections per month",
      "Enhanced business profile",
      "Industry & location filters",
      "Appointment scheduling",
      "Priority messaging",
      "Basic partnership matching"
    ],
    cta: "Start 14-day Trial",
    popular: false
  },
  {
    name: "Professional",
    price: 29.99,
    description: "For growing businesses and creators",
    features: [
      "Unlimited business connections",
      "Featured profile with badge",
      "Advanced search & filters",
      "Smart partnership matching",
      "Sponsorship opportunity alerts",
      "Business analytics dashboard",
      "Priority customer support"
    ],
    cta: "Start 14-day Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: 99.99,
    description: "For organizations with large networks",
    features: [
      "Unlimited platform access",
      "Verified business status",
      "Custom partnership categories",
      "Advanced analytics & reporting",
      "Dedicated account manager",
      "API access for integrations",
      "White-label options"
    ],
    cta: "Start 14-day Trial",
    popular: false
  }
];

const PricingTier = ({ tier }: { tier: typeof pricingTiers[0] }) => {
  const navigate = useNavigate();
  
  return (
    <Card className={`flex flex-col ${tier.popular ? 'border-colink-teal shadow-lg' : ''}`}>
      {tier.popular && (
        <div className="bg-colink-teal text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${tier.price}</span>
          {tier.price > 0 && <span className="text-muted-foreground">/month</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check size={18} className="text-colink-teal shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${tier.popular ? 'bg-colink-teal hover:bg-colink-teal/90' : ''}`}
          onClick={() => navigate("/auth?plan=" + tier.name.toLowerCase())}
        >
          {tier.cta}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to connect with businesses for partnerships and sponsorships. All paid plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <PricingTier key={i} tier={tier} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need something different?</h2>
          <p className="text-muted-foreground mb-6">
            Contact us for custom pricing options for larger teams or specific requirements
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
