import { authenticatedApiCall } from "@/config/api";

// Cache for user profile images to avoid repeated API calls
const profileImageCache = new Map<string, string>();

export const getUserProfileImage = async (userId: string): Promise<string | null> => {
  // Check cache first
  if (profileImageCache.has(userId)) {
    return profileImageCache.get(userId) || null;
  }

  try {
    const response = await authenticatedApiCall(`/users/profile/${userId}`);
    if (response.ok) {
      const data = await response.json();
      const avatarUrl = data.user?.avatar_url || data.user?.avatarUrl;
      
      // Cache the result
      if (avatarUrl) {
        profileImageCache.set(userId, avatarUrl);
      }
      
      return avatarUrl || null;
    }
  } catch (error) {
    console.error('Error fetching user profile image:', error);
  }
  
  return null;
};

export const clearProfileImageCache = () => {
  profileImageCache.clear();
};