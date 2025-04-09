
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock appointments data
const mockAppointments = [
  {
    id: "1",
    businessId: "2",
    businessName: "Creative Studios",
    businessLogo: "https://via.placeholder.com/150",
    date: "2025-04-15",
    time: "10:00 AM",
    location: "Online Meeting",
    status: "upcoming",
    purpose: "Brand Collaboration Discussion"
  },
  {
    id: "2",
    businessId: "3",
    businessName: "Marketing Experts",
    businessLogo: "https://via.placeholder.com/150",
    date: "2025-04-20",
    time: "2:00 PM",
    location: "Their Office",
    status: "upcoming",
    purpose: "Co-marketing Campaign Planning"
  },
  {
    id: "3",
    businessId: "1",
    businessName: "Tech Solutions Inc",
    businessLogo: "https://via.placeholder.com/150",
    date: "2025-04-05",
    time: "11:30 AM",
    location: "Our Office",
    status: "completed",
    purpose: "API Integration Meeting"
  },
];

const Appointments = () => {
  const { toast } = useToast();

  const handleCancelAppointment = (appointmentId: string, businessName: string) => {
    // In a real app, you would call an API to cancel the appointment
    toast({
      title: "Appointment Cancelled",
      description: `Your appointment with ${businessName} has been cancelled.`,
    });
  };

  const handleRescheduleAppointment = (appointmentId: string, businessName: string) => {
    // In a real app, you would open a modal to reschedule
    toast({
      title: "Reschedule Requested",
      description: `You can now select a new date and time for ${businessName}.`,
    });
  };

  const upcomingAppointments = mockAppointments.filter(appointment => appointment.status === "upcoming");
  const pastAppointments = mockAppointments.filter(appointment => appointment.status === "completed");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Appointments</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-10">
                  <p className="text-center text-muted-foreground">You have no upcoming appointments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{appointment.businessName}</CardTitle>
                          <CardDescription>{appointment.purpose}</CardDescription>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={appointment.businessLogo} />
                          <AvatarFallback>{appointment.businessName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id, appointment.businessName)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleRescheduleAppointment(appointment.id, appointment.businessName)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Reschedule
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-10">
                  <p className="text-center text-muted-foreground">You have no past appointments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-gray-50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{appointment.businessName}</CardTitle>
                          <CardDescription>{appointment.purpose}</CardDescription>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={appointment.businessLogo} />
                          <AvatarFallback>{appointment.businessName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        size="sm" 
                        className="w-full"
                        variant="outline"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Completed
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
