
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Users, Search, MessageSquare, PieChart, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Partnerships = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container-wide py-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-gray-500 hover:text-colink-teal flex items-center gap-1">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-colink-navy mb-6">Partnership Dashboard</h1>
          
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-colink-teal/10 text-colink-teal p-3 rounded-lg font-medium">
                    <PieChart size={18} />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg transition-colors cursor-pointer">
                    <Users size={18} />
                    <span>My Partners</span>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-gray-100 p-3 rounded-lg transition-colors cursor-pointer">
                    <Briefcase size={18} />
                    <span>Partnership Offers</span>
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
                  <h2 className="text-xl font-semibold">Partnership Overview</h2>
                  <Button className="btn-primary">Create New Partnership</Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-colink-teal/10 to-colink-teal/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Active Partnerships</p>
                    <h3 className="text-2xl font-bold">24</h3>
                    <p className="text-xs text-green-600">+8% from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-colink-blue/10 to-colink-blue/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Partnership Requests</p>
                    <h3 className="text-2xl font-bold">12</h3>
                    <p className="text-xs text-green-600">+3% from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-colink-purple/10 to-colink-purple/5 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <h3 className="text-2xl font-bold">78%</h3>
                    <p className="text-xs text-green-600">+5% from last month</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recommended Partners</h3>
                    <Button variant="outline">View All</Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Search for potential partners..." />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-3">Company</th>
                        <th scope="col" className="px-4 py-3">Industry</th>
                        <th scope="col" className="px-4 py-3">Partnership Type</th>
                        <th scope="col" className="px-4 py-3">Match Score</th>
                        <th scope="col" className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">TechSolutions Inc.</td>
                        <td className="px-4 py-3">Software</td>
                        <td className="px-4 py-3">Co-marketing</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-gray-200 rounded-full">
                              <div className="bg-green-500 h-2.5 rounded-full" style={{width: "92%"}}></div>
                            </div>
                            <span className="ml-2">92%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm">Connect</Button>
                        </td>
                      </tr>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">Global Marketing</td>
                        <td className="px-4 py-3">Marketing</td>
                        <td className="px-4 py-3">Strategic Alliance</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-gray-200 rounded-full">
                              <div className="bg-green-500 h-2.5 rounded-full" style={{width: "87%"}}></div>
                            </div>
                            <span className="ml-2">87%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm">Connect</Button>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">Retail Partners</td>
                        <td className="px-4 py-3">Retail</td>
                        <td className="px-4 py-3">Distribution</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-2.5 w-full bg-gray-200 rounded-full">
                              <div className="bg-green-500 h-2.5 rounded-full" style={{width: "78%"}}></div>
                            </div>
                            <span className="ml-2">78%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm">Connect</Button>
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

export default Partnerships;
