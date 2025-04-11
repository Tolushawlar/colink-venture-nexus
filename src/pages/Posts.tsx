
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
  Loader2,
  Filter
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getPosts, 
  getPostsByUser, 
  createPost, 
  deletePost, 
  likePost, 
  Post 
} from "@/services/postService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const PostsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    type: "service",
    image_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  
  // Fetch posts
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error: any) {
        toast({
          title: "Error fetching posts",
          description: error.message || "Failed to load posts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllPosts();
  }, [toast]);
  
  // Fetch user posts when tab changes
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (activeTab === "my-posts" && user) {
        try {
          setLoading(true);
          const fetchedPosts = await getPostsByUser(user.id);
          setUserPosts(fetchedPosts);
        } catch (error: any) {
          toast({
            title: "Error fetching your posts",
            description: error.message || "Failed to load your posts",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserPosts();
  }, [activeTab, user, toast]);
  
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
      setLoading(true);
      
      // Create new post
      await createPost({
        title: newPost.title,
        content: newPost.content,
        type: newPost.type as "service" | "announcement" | "update",
        user_id: user?.id || "",
        image_url: newPost.image_url || undefined
      });
      
      // Show success toast
      toast({
        title: "Post Created",
        description: "Your post has been published successfully.",
      });
      
      // Reset form
      setNewPost({
        title: "",
        content: "",
        type: "service",
        image_url: ""
      });
      setShowNewPostForm(false);
      
      // Refresh posts
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      
      // If on my-posts tab, refresh user posts
      if (activeTab === "my-posts" && user) {
        const fetchedUserPosts = await getPostsByUser(user.id);
        setUserPosts(fetchedUserPosts);
      }
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      setLoading(true);
      
      // Delete post
      await deletePost(postId);
      
      // Show success toast
      toast({
        title: "Post Deleted",
        description: "Your post has been deleted.",
      });
      
      // Update posts lists
      setPosts(posts.filter(post => post.id !== postId));
      setUserPosts(userPosts.filter(post => post.id !== postId));
      
      // Close dialog if open
      if (isPostDialogOpen && selectedPost?.id === postId) {
        setIsPostDialogOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Error deleting post",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
      
      // Update UI
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
      
      // Update post likes count in the list
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: (post.likes || 0) + (likedPosts[postId] ? -1 : 1)
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      
      // Update user posts if needed
      if (activeTab === "my-posts") {
        const updatedUserPosts = userPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: (post.likes || 0) + (likedPosts[postId] ? -1 : 1)
            };
          }
          return post;
        });
        setUserPosts(updatedUserPosts);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        variant: "destructive",
      });
    }
  };
  
  const handleSharePost = (post: Post) => {
    // Create a shareable link
    const shareableLink = `${window.location.origin}/posts/${post.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link Copied",
          description: "Post link has been copied to clipboard.",
        });
      },
      () => {
        toast({
          title: "Copy Failed",
          description: "Could not copy link to clipboard.",
          variant: "destructive",
        });
      }
    );
  };
  
  const openPostDetails = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
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
  
  // Generate avatar fallback text
  const getAvatarFallback = (post: Post) => {
    const displayName = post.user_info?.user_metadata?.displayName;
    const email = post.user_info?.email;
    
    if (displayName) {
      const initials = displayName.split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return initials;
    }
    
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    
    return "U";
  };
  
  // Render loading skeleton
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-64" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex justify-between w-full">
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
  
  // Render post card
  const renderPostCard = (post: Post) => {
    const isOwnPost = user?.id === post.user_id;
    const isLiked = likedPosts[post.id] || false;
    
    return (
      <Card key={post.id} className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div 
              className="space-y-1 cursor-pointer" 
              onClick={() => openPostDetails(post)}
            >
              <CardTitle className="hover:text-primary transition-colors">{post.title}</CardTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(post.created_at)}
                </div>
                <div className="px-1.5 py-0.5 bg-gray-100 rounded">
                  {getPostTypeLabel(post.type)}
                </div>
              </div>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user_info?.user_metadata?.avatarUrl} />
              <AvatarFallback>{getAvatarFallback(post)}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent 
          className="pb-4 cursor-pointer" 
          onClick={() => openPostDetails(post)}
        >
          <p className="text-sm">{post.content}</p>
          {post.image_url && (
            <div className="mt-4">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="max-h-64 rounded-md object-cover" 
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-gray-600 ${isLiked ? 'text-red-500' : ''}`}
              onClick={() => handleLikePost(post.id)}
            >
              <Heart 
                className={`mr-1 h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
              />
              <span>{post.likes || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600"
              onClick={() => openPostDetails(post)}
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              <span>{post.comments || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600"
              onClick={() => handleSharePost(post)}
            >
              <Share2 className="mr-1 h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
          {isOwnPost && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500"
              onClick={() => handleDeletePost(post.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Posts</h1>
            <TabsList className="mt-4">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="my-posts">My Posts</TabsTrigger>
            </TabsList>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="flex items-center gap-2"
            >
              {showNewPostForm ? (
                <>Cancel</>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  New Post
                </>
              )}
            </Button>
          </div>
        </div>
        
        {showNewPostForm && (
          <Card className="mb-6">
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
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="post-type">
                  Post Type
                </label>
                <Select
                  value={newPost.type}
                  onValueChange={(value) => setNewPost({...newPost, type: value})}
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
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="post-image">
                  Image URL (Optional)
                </label>
                <Input
                  id="post-image"
                  placeholder="Enter image URL"
                  value={newPost.image_url}
                  onChange={(e) => setNewPost({...newPost, image_url: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : 'Publish Post'}
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            renderSkeletons()
          ) : posts.length > 0 ? (
            posts.map(post => renderPostCard(post))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts available.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-posts" className="space-y-4">
          {loading ? (
            renderSkeletons()
          ) : userPosts.length > 0 ? (
            userPosts.map(post => renderPostCard(post))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't created any posts yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowNewPostForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create your first post
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Post Detail Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedPost.title}</DialogTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedPost.user_info?.user_metadata?.avatarUrl} />
                      <AvatarFallback>{getAvatarFallback(selectedPost)}</AvatarFallback>
                    </Avatar>
                    <span>
                      {selectedPost.user_info?.user_metadata?.displayName || 
                        selectedPost.user_info?.email?.split('@')[0] || 
                        'Anonymous'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(selectedPost.created_at)}
                  </div>
                  <div className="px-1.5 py-0.5 bg-gray-100 rounded">
                    {getPostTypeLabel(selectedPost.type)}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <p>{selectedPost.content}</p>
                
                {selectedPost.image_url && (
                  <div className="mt-4">
                    <img 
                      src={selectedPost.image_url} 
                      alt={selectedPost.title} 
                      className="max-h-80 rounded-md object-cover mx-auto" 
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 border-t border-b py-3 my-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${likedPosts[selectedPost.id] ? 'text-red-500' : 'text-gray-600'}`}
                  onClick={() => handleLikePost(selectedPost.id)}
                >
                  <Heart 
                    className={`mr-1 h-4 w-4 ${likedPosts[selectedPost.id] ? 'fill-red-500' : ''}`} 
                  />
                  <span>Like • {selectedPost.likes || 0}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600"
                >
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>Comment • {selectedPost.comments || 0}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600"
                  onClick={() => handleSharePost(selectedPost)}
                >
                  <Share2 className="mr-1 h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Comments</h3>
                
                {/* Comment form */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatarUrl} />
                    <AvatarFallback>
                      {user?.email?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input placeholder="Write a comment..." />
                  </div>
                  <Button size="sm">Post</Button>
                </div>
                
                {/* Comments list - placeholder */}
                <div className="space-y-4 py-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <p className="font-medium text-sm">User One</p>
                        <p className="text-sm">Great post! Thanks for sharing.</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        2 hours ago
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>UT</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <p className="font-medium text-sm">User Two</p>
                        <p className="text-sm">I'm interested in learning more about this. How can we connect?</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        1 hour ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                {user?.id === selectedPost.user_id && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeletePost(selectedPost.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Post
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PostsPage;
