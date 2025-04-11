
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Heart, Target, Handshake } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-colink-navy mb-6">
                About <span className="text-colink-teal">CoLink Venture</span>
              </h1>
              <p className="text-xl text-gray-600">
                Simplifying and accelerating partnerships and sponsorships for individuals and organizations through our innovative platform.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="bg-white py-16">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-colink-navy mb-6">
                  Who We Are
                </h2>
                <p className="text-gray-600 mb-6">
                  CoLink Venture is an Innovative Platform Designed to Simplify and Accelerate Partnerships and Sponsorships Efficiently to Access Mutually Beneficial Services and Resources.
                </p>
                <p className="text-gray-600 mb-6">
                  CoLink Venture simplifies and accelerates partnerships and sponsorships for individuals and organizations through its innovative platform. The platform provides a centralized hub where organizations and individuals can connect and collaborate more efficiently. It streamlines the process of finding and forming partnerships by matching compatible entities based on shared interests, values, and needs. This saves time and effort in searching for potential partners.
                </p>
                <p className="text-gray-600">
                  Through our platform, individuals and organizations can form mutually beneficial partnerships, leveraging each other's strengths and resources to drive meaningful change.
                </p>
              </div>
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                    alt="Team collaboration"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-colink-teal flex items-center justify-center">
                  <Handshake className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="bg-gradient-to-r from-colink-navy/10 to-colink-teal/10 py-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <Target className="w-16 h-16 text-colink-navy mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-colink-navy mb-6">
                Our Mission Statement
              </h2>
              <p className="text-xl text-gray-600">
                Our Mission is to provide an efficient way to connect businesses and service providers to create mutually beneficial partnerships that drive meaningful change.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-16">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-colink-navy mb-12">
                Values We Live By
              </h2>
              
              <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <div className="bg-colink-teal/10 p-4 rounded-full">
                    <Heart className="w-8 h-8 text-colink-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-colink-navy mb-3">Building Strong Relationships</h3>
                    <p className="text-gray-600">
                      CoLink Venture understands the importance of strong relationships in building thriving communities. We believe that by working together, we can accomplish far more than we could alone.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="bg-colink-teal/10 p-4 rounded-full">
                    <Users className="w-8 h-8 text-colink-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-colink-navy mb-3">Collaboration with our partners</h3>
                    <p className="text-gray-600">
                      We are driven by a relentless desire to achieve success for ourselves and our clients. Our platform facilitates the connection and collaboration between individuals and organizations, creating a foundation for progress and success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-colink-blue to-colink-purple py-16">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl mb-8">
                Discover how CoLink Venture can help your business find the perfect partnerships and sponsorships.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-colink-blue hover:bg-gray-100 py-6 px-8 text-base" asChild>
                  <Link to="/auth?action=signup">Get Started</Link>
                </Button>
                <Button className="bg-transparent border border-white text-white hover:bg-white/10 py-6 px-8 text-base" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
