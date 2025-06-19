
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
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Image,
  FileText,
  Trash2,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
        const response = await fetch('http://localhost:3000/api/posts', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
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
        
        // Filter posts by user ID
        const userPosts = data.posts.filter(post => post.userId === userId);
        setPosts(userPosts);
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
      // Add authorization header to fetch request
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          type: newPost.type
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const createdPost = await response.json();

      // Add post to the list
      setPosts([createdPost, ...posts]);

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

  const handleDeletePost = (postId: string) => {
    // Delete post
    setPosts(posts.filter(post => post.id !== postId));

    // Show success toast
    toast({
      title: "Post Deleted",
      description: "Your post has been deleted.",
    });
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
                <Textarea
                  id="post-content"
                  placeholder="Write your post content..."
                  className="min-h-32"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>

              <div>
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
              </div>
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
                      <AvatarImage src={post.user?.avatarUrl || user?.user_metadata?.avatarUrl} />
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
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <Heart className="mr-1 h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <Share2 className="mr-1 h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </div>
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
