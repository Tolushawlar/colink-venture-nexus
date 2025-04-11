
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type Post = {
  id: string;
  title: string;
  content: string;
  type: "service" | "announcement" | "update";
  user_id: string;
  business_id?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  user_info?: {
    email?: string;
    user_metadata?: {
      displayName?: string;
      avatarUrl?: string;
    }
  };
  business_name?: string;
  likes?: number;
  comments?: number;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_info?: {
    email?: string;
    user_metadata?: {
      displayName?: string;
      avatarUrl?: string;
    }
  };
};

// Get all posts
export const getPosts = async () => {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*, user:user_id(email, user_metadata), business_profiles!business_id(name)")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Transform the response to match our Post type
    const transformedPosts = posts.map(post => ({
      ...post,
      user_info: post.user,
      business_name: post.business_profiles?.name,
      // Placeholder values for likes/comments
      likes: Math.floor(Math.random() * 50), // Will be replaced with actual counts
      comments: Math.floor(Math.random() * 10), // Will be replaced with actual counts
    }));
    
    return transformedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Get posts by user ID
export const getPostsByUser = async (userId: string) => {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*, user:user_id(email, user_metadata), business_profiles!business_id(name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Transform the response to match our Post type
    const transformedPosts = posts.map(post => ({
      ...post,
      user_info: post.user,
      business_name: post.business_profiles?.name,
      // Placeholder values for likes/comments
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 10),
    }));
    
    return transformedPosts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// Create a new post
export const createPost = async (postData: Partial<Post>) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: postData.title,
        content: postData.content,
        type: postData.type,
        user_id: postData.user_id,
        business_id: postData.business_id,
        image_url: postData.image_url
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId: string) => {
  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Like a post (placeholder - would need a likes table)
export const likePost = async (postId: string) => {
  // This would typically involve adding a record to a likes table
  // For now, we'll just return success
  try {
    // Here you would add a record to a likes table
    // For simulation purposes, we'll just return success
    return true;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Get comments for a post
export const getComments = async (postId: string) => {
  try {
    // This would involve fetching from a comments table
    // For placeholder purposes, we'll return mock data
    return [
      {
        id: "1",
        post_id: postId,
        user_id: "user1",
        content: "Great post! Very informative.",
        created_at: new Date().toISOString(),
        user_info: {
          email: "user1@example.com",
          user_metadata: {
            displayName: "User One",
            avatarUrl: ""
          }
        }
      },
      {
        id: "2",
        post_id: postId,
        user_id: "user2",
        content: "Thanks for sharing this information!",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        user_info: {
          email: "user2@example.com",
          user_metadata: {
            displayName: "User Two",
            avatarUrl: ""
          }
        }
      }
    ];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Add a comment to a post
export const addComment = async (postId: string, userId: string, content: string) => {
  try {
    // This would involve adding to a comments table
    // For placeholder purposes, we'll return mock data
    return {
      id: `new-${Date.now()}`,
      post_id: postId,
      user_id: userId,
      content: content,
      created_at: new Date().toISOString(),
      user_info: {
        email: "current_user@example.com",
        user_metadata: {
          displayName: "Current User",
          avatarUrl: ""
        }
      }
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string) => {
  try {
    // This would involve deleting from a comments table
    // For simulation purposes, we'll just return success
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
