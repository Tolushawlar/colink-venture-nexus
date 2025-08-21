
import React from "react";
import { User, Building, Users, Briefcase } from "lucide-react";

interface BenefitBoxProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const BenefitBox = ({ title, description, icon }: BenefitBoxProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-colink-blue/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-colink-navy mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const BenefitSection = () => {
  const benefits = [
    {
      title: "Individuals",
      description: "Find opportunities to connect with organizations that share your values and interests.",
      icon: <User size={32} className="text-colink-blue" />
    },
    {
      title: "Organizations",
      description: "Connect with partners and sponsors to expand your reach and impact.",
      icon: <Building size={32} className="text-colink-purple" />
    },
    {
      title: "Communities",
      description: "Strengthen local connections and build a more vibrant community ecosystem.",
      icon: <Users size={32} className="text-colink-teal" />
    },
    {
      title: "Businesses",
      description: "Discover partnership opportunities to grow your business and reach new audiences.",
      icon: <Briefcase size={32} className="text-colink-navy" />
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-colink-navy mb-4">
            Who Benefits From Our Connected Ecosystem?
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            CoLink Venture transforms how individuals and organizations form partnerships and sponsorships. Our platform acts as a centralized hub, enabling seamless connections and collaborations.
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-4">
            We help businesses and organizations discover ideal partnership and sponsorship opportunities that align with their goals, values, and target markets. By intelligently matching users based on shared interests and needs, we simplify the partnership process, saving time and enhancing connection quality.
          </p>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-center mb-6">
            Explore our connected ecosystem for:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitBox 
                key={index} 
                title={benefit.title} 
                description={benefit.description} 
                icon={benefit.icon} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
