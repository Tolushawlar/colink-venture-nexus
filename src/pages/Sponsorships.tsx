
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Award, Search, MessageSquare, PieChart, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Sponsorships = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container-wide py-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-gray-500 hover:text-colink-purple flex items-center gap-1">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-colink-navy mb-6">Sponsorship Dashboard</h1>
          
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-colink-purple/10 text-colink-purple p-3 rounded-lg font-medium">
                    <PieChart size={18} />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg transition-colors cursor-pointer">
                    <Award size={18} />
                    <span>My Sponsorships</span>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg transition-colors cursor-pointer">
                    <Calendar size={18} />
                    <span>Sponsorship Opportunities</span>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg transition-colors cursor-pointer">
                    <MessageSquare size={18} />
                    <span>Messages</span>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg transition-colors cursor-pointer">
                    <Settings size={18} />
                    <span>Settings</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Sponsorship Overview</h2>
                  <Button className="btn-secondary">Create New Opportunity</Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-colink-purple/10 to-colink-purple/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Active Sponsorships</p>
                    <h3 className="text-2xl font-bold">16</h3>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-colink-teal/10 to-colink-teal/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Investment</p>
                    <h3 className="text-2xl font-bold">$45,230</h3>
                    <p className="text-xs text-green-600">+18% from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-colink-blue/10 to-colink-blue/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">ROI</p>
                    <h3 className="text-2xl font-bold">3.7x</h3>
                    <p className="text-xs text-green-600">+0.4 from last month</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Trending Sponsorship Opportunities</h3>
                    <Button variant="outline">View All</Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Search for sponsorship opportunities..." />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-3">Event/Initiative</th>
                        <th scope="col" className="px-4 py-3">Organizer</th>
                        <th scope="col" className="px-4 py-3">Type</th>
                        <th scope="col" className="px-4 py-3">Budget</th>
                        <th scope="col" className="px-4 py-3">Audience</th>
                        <th scope="col" className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">Tech Conference 2025</td>
                        <td className="px-4 py-3">Global Tech Events</td>
                        <td className="px-4 py-3">Event</td>
                        <td className="px-4 py-3">$5,000 - $15,000</td>
                        <td className="px-4 py-3">5,000+</td>
                        <td className="px-4 py-3">
                          <Button size="sm">Apply</Button>
                        </td>
                      </tr>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">Community Garden Project</td>
                        <td className="px-4 py-3">EcoFriends</td>
                        <td className="px-4 py-3">Initiative</td>
                        <td className="px-4 py-3">$1,000 - $5,000</td>
                        <td className="px-4 py-3">Local Community</td>
                        <td className="px-4 py-3">
                          <Button size="sm">Apply</Button>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">Youth Sports League</td>
                        <td className="px-4 py-3">City Recreation</td>
                        <td className="px-4 py-3">Sports</td>
                        <td className="px-4 py-3">$2,000 - $8,000</td>
                        <td className="px-4 py-3">2,500+</td>
                        <td className="px-4 py-3">
                          <Button size="sm">Apply</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sponsorships;
