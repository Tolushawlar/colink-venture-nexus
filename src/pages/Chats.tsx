
import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock chat data
const mockChats = [
  {
    id: "1",
    businessId: "2",
    businessName: "Creative Studios",
    businessLogo: "https://via.placeholder.com/150",
    lastMessage: "Thanks for reaching out. We'd love to discuss collaboration opportunities.",
    timestamp: "2025-04-08T09:30:00",
    unread: true
  },
  {
    id: "2",
    businessId: "1",
    businessName: "Tech Solutions Inc",
    businessLogo: "https://via.placeholder.com/150",
    lastMessage: "Let's schedule a call to discuss the API integration details.",
    timestamp: "2025-04-07T14:45:00",
    unread: false
  },
  {
    id: "3",
    businessId: "4",
    businessName: "Event Masters",
    businessLogo: "https://via.placeholder.com/150",
    lastMessage: "Looking forward to our meeting next week!",
    timestamp: "2025-04-05T11:20:00",
    unread: false
  }
];

// Mock messages for the currently selected chat
const mockMessages = [
  {
    id: "1",
    senderId: "user",
    text: "Hello! I'm interested in discussing potential collaborations with your company.",
    timestamp: "2025-04-08T09:15:00"
  },
  {
    id: "2",
    senderId: "business2",
    text: "Thanks for reaching out. We'd love to discuss collaboration opportunities.",
    timestamp: "2025-04-08T09:30:00"
  }
];

const Chats = () => {
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = React.useState(mockChats[0]);
  const [messageText, setMessageText] = React.useState("");
  const [messages, setMessages] = React.useState(mockMessages);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (messageText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: "user",
      text: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
    
    // In a real app, you would send the message to an API
    
    // Simulate business reply after 1 second
    setTimeout(() => {
      const businessReply = {
        id: (Date.now() + 1).toString(),
        senderId: `business${selectedChat.businessId}`,
        text: "Thank you for your message! We'll get back to you soon.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, businessReply]);
      
      toast({
        title: "New Message",
        description: `${selectedChat.businessName} has replied to your message.`,
      });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Chats</h1>
        
        <div className="flex h-[calc(100vh-200px)] overflow-hidden rounded-lg border">
          {/* Chat list sidebar */}
          <div className="w-1/3 border-r bg-white">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Recent Conversations</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {mockChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === chat.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={chat.businessLogo} />
                    <AvatarFallback>{chat.businessName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{chat.businessName}</h3>
                      <span className="text-xs text-gray-500">{formatDate(chat.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread && (
                    <div className="ml-2 bg-primary h-2 w-2 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat messages and input */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedChat ? (
              <>
                <div className="p-4 border-b bg-white flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={selectedChat.businessLogo} />
                    <AvatarFallback>{selectedChat.businessName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h2 className="font-medium">{selectedChat.businessName}</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isUser = message.senderId === "user";
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isUser ? 'bg-primary text-primary-foreground' : 'bg-white shadow'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
