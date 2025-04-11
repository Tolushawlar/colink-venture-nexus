
import React, { useEffect, useState } from "react";
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
import { getAppointments, updateAppointmentStatus, subscribeToAppointments } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";

const Appointments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
      
      // Subscribe to real-time updates
      const unsubscribe = subscribeToAppointments(user.id, (appointment) => {
        setAppointments(prev => {
          const existingIndex = prev.findIndex(a => a.id === appointment.id);
          if (existingIndex >= 0) {
            // Update existing appointment
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], ...appointment };
            return updated;
          } else {
            // Add new appointment
            return [...prev, appointment];
          }
        });
        
        // Show toast for new appointment
        toast({
          title: "Appointment Updated",
          description: "An appointment has been updated.",
        });
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string, businessName: string) => {
    try {
      await updateAppointmentStatus(appointmentId, "cancelled");
      toast({
        title: "Appointment Cancelled",
        description: `Your appointment with ${businessName} has been cancelled.`,
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleRescheduleAppointment = (appointmentId: string, businessName: string) => {
    // In a real app, you would open a modal to reschedule
    toast({
      title: "Reschedule Requested",
      description: `You can now select a new date and time for ${businessName}.`,
    });
  };

  const upcomingAppointments = appointments.filter(appointment => 
    appointment.status === "pending" || appointment.status === "confirmed"
  );
  
  const pastAppointments = appointments.filter(appointment => 
    appointment.status === "completed" || appointment.status === "cancelled"
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-colink-teal"></div>
        </div>
      </DashboardLayout>
    );
  }

  const getBusinessName = (appointment: any) => {
    if (user?.id === appointment.requester_id) {
      return appointment.recipient_business?.name || 'Business';
    } else {
      return appointment.requester_business?.name || 'Business';
    }
  };

  const getBusinessLogo = (appointment: any) => {
    if (user?.id === appointment.requester_id) {
      return appointment.recipient_business?.logo || '';
    } else {
      return appointment.requester_business?.logo || '';
    }
  };

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
                          <CardTitle>{getBusinessName(appointment)}</CardTitle>
                          <CardDescription>{appointment.purpose}</CardDescription>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={getBusinessLogo(appointment)} />
                          <AvatarFallback>{getBusinessName(appointment).substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.location || "No location specified"}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id, getBusinessName(appointment))}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleRescheduleAppointment(appointment.id, getBusinessName(appointment))}
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
                          <CardTitle>{getBusinessName(appointment)}</CardTitle>
                          <CardDescription>{appointment.purpose}</CardDescription>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={getBusinessLogo(appointment)} />
                          <AvatarFallback>{getBusinessName(appointment).substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.location || "No location specified"}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        size="sm" 
                        className="w-full"
                        variant="outline"
                      >
                        {appointment.status === "completed" ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Cancelled
                          </>
                        )}
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
