/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Plus,
  Image,
  FileText,
  Trash2,
  Loader2,
  Copy
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authenticatedApiCall } from "@/config/api";

// Mock posts data
const mockPosts = [
  {
    id: "1",
    title: "New Software Integration Service",
    content: "We're excited to announce our new API integration service that helps businesses connect their systems seamlessly.",
    type: "service",
    createdAt: "2025-04-01T10:30:00",
    likes: 24,
    comments: 5
  },
  {
    id: "2",
    title: "Join Our Upcoming Tech Workshop",
    content: "We're hosting a free workshop on AI implementation strategies for small businesses. Limited spots available!",
    type: "announcement",
    createdAt: "2025-03-28T14:45:00",
    likes: 42,
    comments: 12
  },
  {
    id: "3",
    title: "New Partnership with CloudTech Solutions",
    content: "We're proud to announce our strategic partnership with CloudTech Solutions to bring advanced cloud services to our clients.",
    type: "update",
    createdAt: "2025-03-20T09:15:00",
    likes: 38,
    comments: 8
  }
];

const Posts = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    type: "service"
  });

  // Helper function to get auth token
  const getAuthToken = () => {
    return sessionStorage.getItem('token');
  };
  
  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await authenticatedApiCall('/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        
        // Get user ID from token
        const token = getAuthToken();
        let userId = '';
        
        if (token) {
          try {
            // Parse JWT token to get user ID
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            userId = payload.sub || payload.user_id || payload.id;
          } catch (e) {
            console.error('Error parsing token:', e);
          }
        }
        
        // Filter posts by user ID and map field names
        const userPosts = data.posts
          .filter(post => post.user_id === userId)
          .map(post => ({
            ...post,
            id: post.id || `post-${Date.now()}-${Math.random()}`,
            createdAt: post.created_at,
            userId: post.user_id
          }));
        setPosts(userPosts);
        
        // Fetch business logo for current user
        try {
          const businessResponse = await authenticatedApiCall('/businesses/');
          if (businessResponse.ok) {
            const businessData = await businessResponse.json();
            const userBusiness = businessData.businesses.find((business: any) => 
              business.owner_id === userId || business.ownerId === userId
            );
            if (userBusiness?.logo) {
              setBusinessLogo(userBusiness.logo);
            }
          }
        } catch (error) {
          console.error('Error fetching business logo:', error);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load posts. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [toast]);

  const handleCreatePost = async () => {
    // Validate form fields
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating post with data:', {
        title: newPost.title,
        content: newPost.content,
        type: newPost.type
      });
      
      // Add authorization header to fetch request
      const response = await authenticatedApiCall('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          type: newPost.type
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Post creation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Post creation failed:', response.status, errorText);
        throw new Error(`Failed to create post: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Post created successfully:', responseData);

      // Handle different response structures
      const createdPost = responseData.post || responseData;
      
      // Add post to the list with proper field mapping
      const formattedPost = {
        id: createdPost.id || `post-${Date.now()}`,
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
        createdAt: createdPost.created_at || new Date().toISOString(),
        userId: createdPost.user_id,
        likes: 0,
        comments: 0
      };
      
      setPosts(prevPosts => [formattedPost, ...prevPosts]);

      // Show success toast
      toast({
        title: "Post Created",
        description: "Your post has been published successfully.",
      });

      // Reset form
      setNewPost({
        title: "",
        content: "",
        type: "service"
      });
      setShowNewPostForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await authenticatedApiCall(`/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Remove post from local state
        setPosts(posts.filter(post => post.id !== postId));
        
        toast({
          title: "Post Deleted",
          description: "Your post has been deleted.",
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "service":
        return "Service Offer";
      case "announcement":
        return "Announcement";
      case "update":
        return "Latest Update";
      default:
        return type;
    }
  };

  const handleCopyPost = async (post: any) => {
    const postText = `${post.title}\n\n${post.content}`;
    
    try {
      await navigator.clipboard.writeText(postText);
      toast({
        title: "Copied!",
        description: "Post content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Button onClick={() => setShowNewPostForm(!showNewPostForm)}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        {showNewPostForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Share a service offer, announcement, or update</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="post-title">
                  Post Title
                </label>
                <Input
                  id="post-title"
                  placeholder="Enter post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="post-type">
                  Post Type
                </label>
                <Select
                  value={newPost.type}
                  onValueChange={(value) => setNewPost({ ...newPost, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service Offer</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="update">Latest Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="post-content">
                  Post Content
                </label>
                <div className="border rounded-md">
                  <div className="p-2 border-b bg-gray-50 flex gap-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                          const range = selection.getRangeAt(0);
                          const bold = document.createElement('strong');
                          try {
                            range.surroundContents(bold);
                          } catch (e) {
                            bold.appendChild(range.extractContents());
                            range.insertNode(bold);
                          }
                        }
                      }}
                    >
                      <strong>B</strong>
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                          const range = selection.getRangeAt(0);
                          const italic = document.createElement('em');
                          try {
                            range.surroundContents(italic);
                          } catch (e) {
                            italic.appendChild(range.extractContents());
                            range.insertNode(italic);
                          }
                        }
                      }}
                    >
                      <em>I</em>
                    </Button>
                  </div>
                  <div
                    contentEditable
                    className="p-3 min-h-32 focus:outline-none"
                    onInput={(e) => {
                      const content = e.currentTarget.innerHTML;
                      setNewPost({ ...newPost, content });
                    }}
                    dangerouslySetInnerHTML={{ __html: newPost.content }}
                  />
                </div>
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-2">
                  Add Media (Optional)
                </label>
                <div className="flex gap-2">
                  <Button variant="outline" type="button">
                    <Image className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                  <Button variant="outline" type="button">
                    <FileText className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                </div>
              </div> */}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>Publish Post</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <CardTitle>{post.title}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(post.createdAt)}
                        </div>
                        <div className="px-1.5 py-0.5 bg-gray-100 rounded">
                          {getPostTypeLabel(post.type)}
                        </div>
                      </div>
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={businessLogo || post.user?.avatarUrl || user?.user_metadata?.avatarUrl} />
                      <AvatarFallback>
                        {(post.user?.displayName || user?.user_metadata?.displayName || "")?.substring(0, 2) || 
                         (post.user?.email || user?.email || "")?.substring(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm">{post.content}</p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleCopyPost(post)}
                  >
                    <Copy className="mr-1 h-4 w-4" />
                    <span>Copy Post</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="py-8">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-4">You haven't created any posts yet.</p>
                <Button onClick={() => setShowNewPostForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Posts;
