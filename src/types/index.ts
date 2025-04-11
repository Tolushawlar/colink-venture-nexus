
export type AccountType = "partnership" | "sponsorship";

export type Business = {
  id: string;
  user_id: string; // Added user_id property
  name: string;
  description: string;
  logo: string;
  industry: string;
  partnershipOffers?: string[];
  sponsorshipOffers?: string[];
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  gallery?: string[];
  posts?: BusinessPost[];
};

export type BusinessPost = {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
  industry?: string;
  interests?: string[];
  accountType: AccountType;
};

export type Appointment = {
  id: string;
  businessId: string;
  userId: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  purpose: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  read: boolean;
};

export type Post = {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "service" | "announcement" | "update";
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  // Add additional fields to match Supabase response
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string | null;
  business_id?: string | null;
  user_info?: any;
  business_name?: string;
  business_profiles?: any;
};

// Add missing type definitions
export type FeatureItem = {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
};

export type NavItem = {
  title: string;
  href: string;
  isActive?: boolean;
  description?: string; // Adding this property to fix the type error
};

export type UserPlan = "free" | "basic" | "pro";
