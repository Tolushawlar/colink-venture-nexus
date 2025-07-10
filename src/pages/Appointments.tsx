/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Check, X, Plus, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import emailjs from '@emailjs/browser';
import { authenticatedApiCall } from "@/config/api";
// Removed Zoom imports

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  attendeeEmail: string;
  attendeeName: string;
  creatorId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
}

const Appointments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [businessNames, setBusinessNames] = useState<Record<string, string>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    attendeeEmail: "",
    attendeeName: "",
    meetingLink: ""
  });

  useEffect(() => {
    const initializeAppointments = async () => {
      await fetchAppointments();
      
      // Check URL parameters for pre-filled appointment data
      const urlParams = new URLSearchParams(window.location.search);
      const attendeeEmail = urlParams.get('attendeeEmail');
      const attendeeName = urlParams.get('attendeeName');
      const openModal = urlParams.get('openModal');
      
      if (attendeeEmail || attendeeName) {
        setNewAppointment(prev => ({
          ...prev,
          attendeeEmail: attendeeEmail || prev.attendeeEmail,
          attendeeName: attendeeName || prev.attendeeName
        }));
      }
      
      if (openModal === 'true') {
        setShowCreateDialog(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    
    initializeAppointments();
  }, []);

  // Removed Zoom functions

  const fetchAppointments = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      console.log('Fetching appointments...');
      const response = await authenticatedApiCall('/appointments');

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Appointments data:', data);
        setAppointments(data.appointments || []);
        
        // Fetch business names for creators
        try {
          const businessResponse = await authenticatedApiCall('/businesses/');
          if (businessResponse.ok) {
            const businessData = await businessResponse.json();
            const nameMap: Record<string, string> = {};
            businessData.businesses.forEach((business: any) => {
              const ownerId = business.owner_id || business.ownerId;
              if (ownerId) {
                nameMap[ownerId] = business.name;
              }
            });
            setBusinessNames(nameMap);
          }
        } catch (error) {
          console.error('Error fetching business names:', error);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch appointments:', response.status, errorText);
        toast({
          title: "Error",
          description: "Failed to load appointments.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments.",
        variant: "destructive"
      });
    }
  };

  const handleCreateAppointment = async () => {
    console.log('Form data:', newAppointment);
    
    if (!newAppointment.title?.trim() || !newAppointment.date || !newAppointment.time || !newAppointment.attendeeEmail?.trim()) {
      console.log('Validation failed:', {
        title: newAppointment.title,
        date: newAppointment.date,
        time: newAppointment.time,
        email: newAppointment.attendeeEmail
      });
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (title, date, time, attendee email).",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No auth token');

      const appointmentData = { ...newAppointment };

      const response = await authenticatedApiCall('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments([...appointments, data.appointment]);
        
        // Send meeting invitation email
        try {
          const templateParams = {
            email: newAppointment.attendeeEmail,
            name: newAppointment.attendeeName || newAppointment.attendeeEmail.split('@')[0],
            from_name: "CoLink Venture",
            meeting_title: newAppointment.title,
            meeting_description: newAppointment.description || 'No description provided',
            meeting_date: new Date(newAppointment.date).toLocaleDateString(),
            meeting_time: newAppointment.time,
            meeting_duration: `${newAppointment.duration} minutes`,
            meeting_link: newAppointment.meetingLink,
            organizer_name: user?.user_metadata?.displayName || user?.email || 'CoLink Venture User'
          };

          await emailjs.send('service_nmp9326', 'template_u1drdvl', templateParams, 'JEOwNb-hlyrgzUx-F');
          console.log('Meeting invitation email sent successfully');
          
          toast({
            title: "Appointment Created",
            description: "Meeting scheduled and invitation sent successfully.",
          });
        } catch (emailError) {
          console.error('Failed to send meeting invitation email:', emailError);
          toast({
            title: "Appointment Created",
            description: "Meeting scheduled but email invitation failed to send.",
            variant: "destructive"
          });
        }
        
        setShowCreateDialog(false);
        setNewAppointment({
          title: "",
          description: "",
          date: "",
          time: "",
          duration: 60,
          attendeeEmail: "",
          attendeeName: "",
          meetingLink: ""
        });
      } else {
        throw new Error('Failed to create appointment');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No auth token');

      const response = await authenticatedApiCall(`/appointments/${appointmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAppointments(appointments.map(apt => 
          apt.id === appointmentId ? { ...apt, status: status as any } : apt
        ));

        toast({
          title: "Status Updated",
          description: `Appointment has been ${status}.`,
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status.",
        variant: "destructive"
      });
    }
  };

  const isCreator = (appointment: Appointment) => {
    return appointment.creatorId === user?.id;
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const pastAppointments = appointments.filter(apt => apt.status !== 'scheduled');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Appointments</h1>
          {/* <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div> */}
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-10">
                  <p className="text-center text-muted-foreground">No upcoming appointments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <CardTitle>{appointment.title}</CardTitle>
                      <CardDescription>{appointment.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.time} ({appointment.duration} min)</span>
                      </div>
                      <div className="text-sm">
                        <strong>Attendee:</strong> {appointment.attendeeName} ({appointment.attendeeEmail})
                      </div>
                      {appointment.meetingLink && (
                        <div className="flex items-center gap-2 text-sm">
                          <Video className="h-4 w-4 text-blue-600" />
                          <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {isCreator(appointment) ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Complete
                          </Button>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Created by {businessNames[appointment.creatorId] || 'Unknown Business'}
                        </span>
                      )}
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
                  <p className="text-center text-muted-foreground">No past appointments</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-gray-50">
                    <CardHeader>
                      <CardTitle>{appointment.title}</CardTitle>
                      <CardDescription>{appointment.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.time}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full" variant="outline">
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

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule Meeting</DialogTitle>
              <DialogDescription>
                Create a new appointment
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium">Meeting Title *</label>
                <Input
                  placeholder="Enter meeting title"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Meeting description"
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Date *</label>
                  <Input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => {
                      console.log('Date changed:', e.target.value);
                      setNewAppointment(prev => ({...prev, date: e.target.value}));
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time *</label>
                  <Input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => {
                      console.log('Time changed:', e.target.value);
                      setNewAppointment(prev => ({...prev, time: e.target.value}));
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={newAppointment.duration}
                  onChange={(e) => setNewAppointment({...newAppointment, duration: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Attendee Name</label>
                <Input
                  placeholder="Enter attendee name"
                  value={newAppointment.attendeeName}
                  onChange={(e) => setNewAppointment({...newAppointment, attendeeName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Attendee Email *</label>
                <Input
                  type="email"
                  placeholder="Enter attendee email"
                  value={newAppointment.attendeeEmail}
                  onChange={(e) => setNewAppointment({...newAppointment, attendeeEmail: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Meeting Link *</label>
                <Input
                  type="url"
                  placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                  value={newAppointment.meetingLink}
                  onChange={(e) => setNewAppointment({...newAppointment, meetingLink: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter>

              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAppointment} disabled={loading}>
                {loading ? "Creating..." : "Schedule Meeting"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;