
import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Message sent!",
      description: "We've received your message and will get back to you soon.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-colink-navy mb-6">
                Get In <span className="text-colink-teal">Touch</span>
              </h1>
              <p className="text-xl text-gray-600">
                Have questions or want to learn more? We're here to help. Reach out to our team using the contact information below.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="bg-white py-16">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-colink-navy mb-6">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below, and we'll get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full py-6">
                    Send Message
                  </Button>
                </form>
              </div>
              
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-colink-navy mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-8">
                  You can reach us through the following channels or visit our office during business hours.
                </p>
                
                <div className="grid gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="text-colink-teal" />
                        Email Us
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a href="mailto:info@colinkventure.com" className="text-colink-blue hover:underline">
                        info@colinkventure.com
                      </a>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="text-colink-teal" />
                        Call Us
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a href="tel:+1234567890" className="text-colink-blue hover:underline">
                        +1 (234) 567-890
                      </a>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="text-colink-teal" />
                        Visit Us
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <address className="not-italic">
                        123 Business Avenue, <br />
                        Suite 456, <br />
                        San Francisco, CA 94107
                      </address>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="text-colink-teal" />
                        Business Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p>Saturday - Sunday: Closed</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="h-[400px] bg-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0934339063065!2d-122.4026639!3d37.7868039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858080c885b0ab%3A0x9c959b15cbfe9086!2sUnion%20Square!5e0!3m2!1sen!2sus!4v1659545950722!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="CoLink Venture Location"
          ></iframe>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
