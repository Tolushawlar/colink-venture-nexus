
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types";

// Get all appointments for the current user
export const getAppointments = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        requester:requester_id(*),
        recipient:recipient_id(*),
        requester_business:requester_business_id(*),
        recipient_business:recipient_business_id(*)
      `)
      .or(`requester_id.eq.${user.user.id},recipient_id.eq.${user.user.id}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData: Partial<Appointment>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        requester_id: user.user.id,
        recipient_id: appointmentData.userId || "",
        requester_business_id: appointmentData.businessId,
        recipient_business_id: null, // This could be populated if known
        date: appointmentData.date,
        time: appointmentData.time,
        location: appointmentData.location || "Virtual Meeting",
        purpose: appointmentData.purpose || "Business Discussion"
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (id: string) => {
  try {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};
