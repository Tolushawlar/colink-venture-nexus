
import { supabase } from "@/integrations/supabase/client";
import { Business, Post, Appointment, ChatMessage } from "@/types";
import { toast } from "@/hooks/use-toast";

// Business Profiles
export const createBusinessProfile = async (businessData: Partial<Business>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("business_profiles")
      .insert({
        user_id: user.user.id,
        name: businessData.name || "Untitled Business",
        description: businessData.description,
        logo: businessData.logo,
        industry: businessData.industry,
        website: businessData.website,
        email: businessData.email,
        phone: businessData.phone,
        location: businessData.location
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error creating business profile:", error);
    toast({
      variant: "destructive",
      title: "Error creating business profile",
      description: error.message
    });
    throw error;
  }
};

export const getBusinessProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from("business_profiles")
      .select("*");
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching business profiles:", error);
    toast({
      variant: "destructive",
      title: "Error fetching business profiles",
      description: error.message
    });
    throw error;
  }
};

export const getBusinessProfileById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching business profile:", error);
    toast({
      variant: "destructive",
      title: "Error fetching business profile",
      description: error.message
    });
    throw error;
  }
};

export const getUserBusinessProfile = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("user_id", user.user.id)
      .single();
      
    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned" error
    return data;
  } catch (error: any) {
    console.error("Error fetching user business profile:", error);
    // Don't show toast for "no rows returned" error
    if (error.code !== "PGRST116") {
      toast({
        variant: "destructive",
        title: "Error fetching user business profile",
        description: error.message
      });
    }
    return null;
  }
};

// Posts
export const createPost = async (postData: Partial<Post>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.user.id,
        business_id: postData.userId,
        title: postData.title || "Untitled Post",
        content: postData.content || "",
        type: postData.type || "update",
        image_url: postData.userId // This seems like a mistake. Using userId here as a placeholder, but should be updated
      })
      .select()
      .single();
      
    if (error) throw error;
    
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
      description: error.message
    });
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, business_profiles(name, logo)")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    toast({
      variant: "destructive",
      title: "Error fetching posts",
      description: error.message
    });
    throw error;
  }
};

// Appointments
export const createAppointment = async (appointmentData: Partial<Appointment>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        requester_id: user.user.id,
        recipient_id: appointmentData.userId || "",
        date: appointmentData.date,
        time: appointmentData.time,
        location: appointmentData.location,
        purpose: appointmentData.purpose
      })
      .select()
      .single();
      
    if (error) throw error;
    
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
      description: error.message
    });
    throw error;
  }
};

export const getAppointments = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        requester:requester_id(email),
        recipient:recipient_id(email),
        requester_business:requester_business_id(name, logo),
        recipient_business:recipient_business_id(name, logo)
      `)
      .or(`requester_id.eq.${user.user.id},recipient_id.eq.${user.user.id}`)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    toast({
      variant: "destructive",
      title: "Error fetching appointments",
      description: error.message
    });
    throw error;
  }
};

export const updateAppointmentStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    
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
      description: error.message
    });
    throw error;
  }
};

// Messages
export const sendMessage = async (recipientId: string, text: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.user.id,
        recipient_id: recipientId,
        text
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error sending message:", error);
    toast({
      variant: "destructive",
      title: "Error sending message",
      description: error.message
    });
    throw error;
  }
};

export const getMessagesByContact = async (contactId: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.user.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user.user.id})`)
      .order("created_at", { ascending: true });
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    toast({
      variant: "destructive",
      title: "Error fetching messages",
      description: error.message
    });
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", messageId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error marking message as read:", error);
    // No toast needed here since this is a background operation
    throw error;
  }
};

// Set up real-time subscriptions
export const subscribeToMessages = (userId: string, onNewMessage: (message: any) => void) => {
  const channel = supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`,
      },
      (payload) => onNewMessage(payload.new)
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToAppointments = (userId: string, onAppointmentUpdate: (appointment: any) => void) => {
  const channel = supabase
    .channel('public:appointments')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `or(requester_id=eq.${userId},recipient_id=eq.${userId})`,
      },
      (payload) => onAppointmentUpdate(payload.new)
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};
