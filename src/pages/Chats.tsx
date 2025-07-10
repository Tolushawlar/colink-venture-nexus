import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Users, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authenticatedApiCall, apiCall } from "@/config/api";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
  isSentByCurrentUser: boolean;
  messageType: string;
  sender: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string;
  };
  recipient: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string;
  };
}

interface ChatUser {
  partner: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string;
  };
  messages: Message[];
  totalMessages: number;
  unreadCount: number;
}

const Chats = () => {
  const { toast } = useToast();
  const [chats, setChats] = useState<Record<string, ChatUser>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessLoading, setBusinessLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const response = await authenticatedApiCall('/chats/messages/all');

        if (response.ok) {
          const data = await response.json();
          
          // Get business mapping to update chat display names
          const businessResponse = await apiCall('/businesses/');
          if (businessResponse.ok) {
            const businessData = await businessResponse.json();
            const businessByOwnerId = new Map();
            
            businessData.businesses.forEach((business: any) => {
              const ownerId = business.owner_id || business.ownerId;
              if (ownerId) {
                businessByOwnerId.set(ownerId, {
                  name: business.name,
                  logo: business.logo,
                  industry: business.industry
                });
              }
            });
            
            // Update chats with business info and exclude own business
            const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
            const currentUserId = currentUser.id;
            
            const updatedChats = { ...data.data.messagesByUser };
            
            // Filter out chats with own business and update remaining chats
            Object.keys(updatedChats).forEach(userId => {
              if (userId === currentUserId) {
                delete updatedChats[userId];
                return;
              }
              
              const businessInfo = businessByOwnerId.get(userId);
              if (businessInfo) {
                updatedChats[userId] = {
                  ...updatedChats[userId],
                  partner: {
                    ...updatedChats[userId].partner,
                    displayName: businessInfo.name,
                    avatarUrl: businessInfo.logo
                  }
                };
              }
            });
            
            setChats(updatedChats);
          } else {
            setChats(data.data.messagesByUser);
          }
          
          // Check if there's a userId parameter in URL
          const urlParams = new URLSearchParams(window.location.search);
          const targetUserId = urlParams.get('userId');
          
          if (targetUserId) {
            if (data.data.messagesByUser[targetUserId]) {
              setSelectedUserId(targetUserId);
            } else {
              // Create a new chat entry for the user if it doesn't exist
              const newChatEntry = {
                partner: {
                  id: targetUserId,
                  email: '',
                  displayName: 'Business Owner',
                  avatarUrl: ''
                },
                messages: [],
                totalMessages: 0,
                unreadCount: 0
              };
              
              setChats(prev => ({
                ...prev,
                [targetUserId]: newChatEntry
              }));
              
              setSelectedUserId(targetUserId);
            }
          } else {
            // Set first chat as selected if available
            const userIds = Object.keys(data.data.messagesByUser);
            if (userIds.length > 0) {
              setSelectedUserId(userIds[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast({
          title: "Error",
          description: "Failed to load chats",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchBusinesses = async () => {
      setBusinessLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const [businessesResponse, usersResponse] = await Promise.all([
          apiCall('/businesses/'),
          apiCall('/users/getAllUsers')
        ]);
        
        const businessesData = await businessesResponse.json();
        const usersData = await usersResponse.json();
        
        // Get current user ID
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        const currentUserId = currentUser.id;
        
        // Filter businesses to exclude current user's own business
        const filteredBusinesses = businessesData.businesses
          .filter((business: any) => {
            const businessOwnerId = business.owner_id || business.ownerId;
            return businessOwnerId !== currentUserId;
          })
          .map((business: any) => ({
            ...business,
            // Map owner_id to ownerId for consistency
            ownerId: business.owner_id || business.ownerId
          }));
        
        setBusinesses(filteredBusinesses);
        
        // Create a mapping of user IDs to business info for chat display
        const businessByOwnerId = new Map();
        filteredBusinesses.forEach((business: any) => {
          const ownerId = business.owner_id || business.ownerId;
          if (ownerId) {
            businessByOwnerId.set(ownerId, {
              name: business.name,
              logo: business.logo,
              industry: business.industry
            });
          }
        });
        
        // Update existing chats with business info
        setChats(prevChats => {
          const updatedChats = { ...prevChats };
          Object.keys(updatedChats).forEach(userId => {
            const businessInfo = businessByOwnerId.get(userId);
            if (businessInfo) {
              updatedChats[userId] = {
                ...updatedChats[userId],
                partner: {
                  ...updatedChats[userId].partner,
                  displayName: businessInfo.name,
                  avatarUrl: businessInfo.logo
                }
              };
            }
          });
          return updatedChats;
        });
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setBusinessLoading(false);
      }
    };

    fetchChats();
    fetchBusinesses();
  }, [toast]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (messageText.trim() === "" || !selectedUserId) return;

    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      const response = await authenticatedApiCall('/chats/message', {
        method: 'POST',
        body: JSON.stringify({
          recipientId: selectedUserId,
          text: messageText.trim()
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessageText("");
        toast({
          title: "Message Sent",
          description: "Your message has been sent.",
        });
        
        // Refresh chats to show the new message
        const chatsResponse = await authenticatedApiCall('/chats/messages/all');
        
        if (chatsResponse.ok) {
          const data = await chatsResponse.json();
          setChats(data.data.messagesByUser);
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleStartNewChat = async (business: any) => {
    const ownerId = business.ownerId || business.owner_id;
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    const currentUserId = currentUser.id;
    
    if (!ownerId) {
      toast({
        title: "Error",
        description: "Unable to start chat with this business.",
        variant: "destructive"
      });
      return;
    }
    
    // Prevent users from chatting with themselves
    if (ownerId === currentUserId) {
      toast({
        title: "Cannot Chat",
        description: "You cannot start a chat with your own business.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if chat already exists
    if (chats[ownerId]) {
      setSelectedUserId(ownerId);
      toast({
        title: "Chat Opened",
        description: `Continue your conversation with ${business.name}.`,
      });
      return;
    }
    
    // Create a new chat entry immediately for better UX
    const newChatEntry = {
      partner: {
        id: ownerId,
        email: business.email || '',
        displayName: business.name,
        avatarUrl: business.logo || ''
      },
      messages: [],
      totalMessages: 0,
      unreadCount: 0
    };
    
    setChats(prev => ({
      ...prev,
      [ownerId]: newChatEntry
    }));
    
    setSelectedUserId(ownerId);
    
    toast({
      title: "Chat Started",
      description: `You can now chat with ${business.name}.`,
    });
  };

  const getLastMessage = (messages: Message[]) => {
    if (messages.length === 0) return "No messages yet";
    return messages[messages.length - 1].text;
  };

  const getLastMessageTime = (messages: Message[]) => {
    if (messages.length === 0) return "";
    return messages[messages.length - 1].timestamp;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading chats...</p>
        </div>
      </DashboardLayout>
    );
  }

  const chatEntries = Object.entries(chats);
  const selectedChat = selectedUserId ? chats[selectedUserId] : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Chats</h1>
        
        <div className="flex h-[calc(100vh-200px)] overflow-hidden rounded-lg border">
          {/* Chat list sidebar */}
          <div className="w-1/3 border-r bg-white">
            <Tabs defaultValue="chats" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-2">
                <TabsTrigger value="chats" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chats
                </TabsTrigger>
                <TabsTrigger value="directory" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Directory
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chats" className="flex-1 overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">Recent Conversations</h2>
                </div>
                <div className="overflow-y-auto h-full">
                  {chatEntries.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No conversations yet
                    </div>
                  ) : (
                    chatEntries.map(([userId, chatData]) => (
                      <div
                        key={userId}
                        className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedUserId === userId ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => setSelectedUserId(userId)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={chatData.partner.avatarUrl} />
                          <AvatarFallback>
                            {chatData.partner.displayName?.substring(0, 2) || 
                             chatData.partner.email?.substring(0, 2) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-medium truncate">
                              {chatData.partner.displayName || chatData.partner.email}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatDate(getLastMessageTime(chatData.messages))}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {getLastMessage(chatData.messages)}
                          </p>
                        </div>
                        {chatData.unreadCount > 0 && (
                          <div className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {chatData.unreadCount}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="directory" className="flex-1 overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">Business Directory</h2>
                </div>
                <div className="overflow-y-auto h-full">
                  {businessLoading ? (
                    <div className="p-4 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </div>
                  ) : businesses.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No businesses available
                    </div>
                  ) : (
                    businesses.map((business) => (
                      <div
                        key={business.id}
                        className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-50"
                        onClick={() => handleStartNewChat(business)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={business.logo} />
                          <AvatarFallback>
                            {business.name?.substring(0, 2) || "B"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{business.name}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {business.industry}
                          </p>
                        </div>
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Chat messages and input */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedChat ? (
              <>
                <div className="p-4 border-b bg-white flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={selectedChat.partner.avatarUrl} />
                    <AvatarFallback>
                      {selectedChat.partner.displayName?.substring(0, 2) || 
                       selectedChat.partner.email?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-medium">
                    {selectedChat.partner.displayName || selectedChat.partner.email}
                  </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChat.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isSentByCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-white shadow'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isSentByCurrentUser 
                            ? 'text-primary-foreground/70' 
                            : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t bg-white">
                  <form 
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={messageText.trim() === ""}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chats;