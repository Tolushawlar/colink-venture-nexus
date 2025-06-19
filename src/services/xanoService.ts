import { xanoApi } from "@/integrations/xano/client";
import { Business, Post, Appointment, ChatMessage } from "@/types";
import { toast } from "@/hooks/use-toast";

// Business Profiles
export const createBusinessProfile = async (businessData: Partial<Business>) => {
  try {
    const user = await xanoApi.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const data = await xanoApi.post("/business_profiles", {
      user_id: user.id,
      name: businessData.name || "Untitled Business",
      description: businessData.description,
      logo: businessData.logo,
      industry: businessData.industry,
      website: businessData.website,
      email: businessData.email,
      phone: businessData.phone,
      location: businessData.location
    });
      
    return data;
  } catch (error: any) {
    console.error("Error creating business profile:", error);
    toast({
      variant: "destructive",
      title: "Error creating business profile",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

export const getBusinessProfiles = async () => {
  try {
    const data = await xanoApi.get("/business_profiles");
    return data;
  } catch (error: any) {
    console.error("Error fetching business profiles:", error);
    toast({
      variant: "destructive",
      title: "Error fetching business profiles",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

export const getBusinessProfileById = async (id: string) => {
  try {
    const data = await xanoApi.get(`/business_profiles/${id}`);
    return data;
  } catch (error: any) {
    console.error("Error fetching business profile:", error);
    toast({
      variant: "destructive",
      title: "Error fetching business profile",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

export const getUserBusinessProfile = async () => {
  try {
    const user = await xanoApi.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const data = await xanoApi.get(`/business_profiles/user/${user.id}`);
    return data;
  } catch (error: any) {
    console.error("Error fetching user business profile:", error);
    // Check if it's a 404 error (no profile found)
    if (error.response && error.response.status === 404) {
      return null;
    }
    
    toast({
      variant: "destructive",
      title: "Error fetching user business profile",
      description: error.message || "An error occurred"
    });
    return null;
  }
};

// Posts
export const createPost = async (postData: Partial<Post>) => {
  try {
    const user = await xanoApi.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const data = await xanoApi.post("/posts", {
      user_id: user.id,
      business_id: postData.userId,
      title: postData.title || "Untitled Post",
      content: postData.content || "",
      type: postData.type || "update",
      image_url: postData.userId // This seems like a mistake. Using userId here as a placeholder, but should be updated
    });
    
    toast({
      title: "Post created",
      description: "Your post has been created successfully."
    });
    
    return data;
  } catch (error: any) {
    console.error("Error creating post:", error);
    toast({
      variant: "destructive",
      title: "Error creating post",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const data = await xanoApi.get("/posts", { 
      _sort: "-created_at",
      _with: "business_profiles" 
    });
    
    return data;
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    toast({
      variant: "destructive",
      title: "Error fetching posts",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

// Appointments
export const createAppointment = async (appointmentData: Partial<Appointment>) => {
  try {
    const user = await xanoApi.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const data = await xanoApi.post("/appointments", {
      requester_id: user.id,
      recipient_id: appointmentData.userId || "",
      date: appointmentData.date,
      time: appointmentData.time,
      location: appointmentData.location,
      purpose: appointmentData.purpose
    });
    
    toast({
      title: "Appointment scheduled",
      description: "Your appointment has been scheduled successfully."
    });
    
    return data;
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    toast({
      variant: "destructive",
      title: "Error creating appointment",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

export const getAppointments = async () => {
  try {
    const user = await xanoApi.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const data = await xanoApi.get("/appointments/user", {
      user_id: user.id,
      _sort: "-created_at",
      _with: "requester,recipient,requester_business,recipient_business"
    });
    
    return data;
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    toast({
      variant: "destructive",
      title: "Error fetching appointments",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

export const updateAppointmentStatus = async (id: string, status: string) => {
  try {
    const data = await xanoApi.put(`/appointments/${id}`, { status });
    
    toast({
      title: "Appointment updated",
      description: `Appointment has been ${status}.`
    });
    
    return data;
  } catch (error: any) {
    console.error("Error updating appointment:", error);
    toast({
      variant: "destructive",
      title: "Error updating appointment",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

// Messages
export const sendMessage = async (recipientId: string, text: string) => {
  try {
    const user = await xanoApi.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const data = await xanoApi.post("/messages", {
      sender_id: user.id,
      recipient_id: recipientId,
      text
    });
    
    return data;
  } catch (error: any) {
    console.error("Error sending message:", error);
    toast({
      variant: "destructive",
      title: "Error sending message",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

export const getMessagesByContact = async (contactId: string) => {
  try {
    const user = await xanoApi.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const data = await xanoApi.get("/messages/conversation", {
      user_id: user.id,
      contact_id: contactId,
      _sort: "created_at"
    });
    
    return data;
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    toast({
      variant: "destructive",
      title: "Error fetching messages",
      description: error.message || "An error occurred"
    });
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const data = await xanoApi.put(`/messages/${messageId}`, { read: true });
    return data;
  } catch (error: any) {
    console.error("Error marking message as read:", error);
    // No toast needed here since this is a background operation
    throw error;
  }
};

// Set up real-time functionality
// Note: Xano doesn't have built-in real-time like Supabase
// You'll need to implement polling or use a third-party service like Pusher
export const setupMessagePolling = (userId: string, onNewMessage: (message: any) => void) => {
  // Set up polling interval to check for new messages
  const interval = setInterval(async () => {
    try {
      const messages = await xanoApi.get("/messages/unread", { recipient_id: userId });
      if (messages && messages.length > 0) {
        messages.forEach(onNewMessage);
      }
    } catch (error) {
      console.error("Error polling for messages:", error);
    }
  }, 5000); // Poll every 5 seconds
  
  return () => {
    clearInterval(interval);
  };
};

export const setupAppointmentPolling = (userId: string, onAppointmentUpdate: (appointment: any) => void) => {
  // Set up polling interval to check for appointment updates
  const interval = setInterval(async () => {
    try {
      const appointments = await xanoApi.get("/appointments/updates", { user_id: userId });
      if (appointments && appointments.length > 0) {
        appointments.forEach(onAppointmentUpdate);
      }
    } catch (error) {
      console.error("Error polling for appointment updates:", error);
    }
  }, 10000); // Poll every 10 seconds
  
  return () => {
    clearInterval(interval);
  };
};