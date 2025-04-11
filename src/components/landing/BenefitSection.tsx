
import React from "react";

interface BenefitBoxProps {
  title: string;
  description: string;
  imageSrc: string;
}

const BenefitBox = ({ title, description, imageSrc }: BenefitBoxProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-colink-navy mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const BenefitSection = () => {
  const benefits = [
    {
      title: "Individuals",
      description: "Find opportunities to connect with organizations that share your values and interests.",
      imageSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
    },
    {
      title: "Organizations",
      description: "Connect with partners and sponsors to expand your reach and impact.",
      imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
    },
    {
      title: "Communities",
      description: "Strengthen local connections and build a more vibrant community ecosystem.",
      imageSrc: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
    },
    {
      title: "Businesses",
      description: "Discover partnership opportunities to grow your business and reach new audiences.",
      imageSrc: "https://images.unsplash.com/photo-1556761175-5b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
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
            At CoLink Venture, we understand the power of sponsorship in creating meaningful connections between brands and their target audience. We specialize in helping businesses and organizations find the perfect sponsorship opportunities that align with their goals, values, and target market. Whether you are looking to sponsor a sports event, a music festival, a charitable cause, or any other type of sponsorship, we have you covered.
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
                imageSrc={benefit.imageSrc} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
