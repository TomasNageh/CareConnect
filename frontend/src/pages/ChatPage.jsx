import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, MessageCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import * as chatAPI from '../services/chat';
import { toast } from 'sonner';

export default function ChatPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.otherUserId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await chatAPI.getConversations();
      const doctorUserId = location.state?.doctorUserId;

      if (doctorUserId) {
        const foundConv = data.find((conv) => conv.otherUserId === doctorUserId);

        if (foundConv) {
          setConversations(data || []);
          setSelectedConversation(foundConv);
        } else {
          const newConv = {
            otherUserId: doctorUserId,
            otherUserName: location.state?.doctorName || 'Doctor',
            otherUserRole: 'Doctor',
            lastMessage: null,
            lastMessageTime: null,
            unreadCount: 0,
          };
          setConversations([newConv, ...(data || [])]);
          setSelectedConversation(newConv);
          setMessages([]);
        }
      } else {
        setConversations(data || []);
        if (data?.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const data = await chatAPI.getChatHistory(otherUserId);
      setMessages(data || []);
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        setMessages([]);
      } else {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      await chatAPI.sendMessage({
        receiverId: selectedConversation.otherUserId,
        message: messageText,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          senderId: user.id,
          message: messageText,
          sentAt: new Date().toISOString(),
          isRead: false,
        },
      ]);

      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setNewMessage(messageText);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl text-gray-900 mb-6">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  <div className="divide-y">
                    {conversations.map((conv) => (
                      <div
                        key={conv.otherUserId}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.otherUserId === conv.otherUserId ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(conv.otherUserName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conv.otherUserName}
                              </p>
                              {conv.unreadCount > 0 && (
                                <Badge className="bg-blue-600">{conv.unreadCount}</Badge>
                              )}
                            </div>
                            {conv.lastMessage && (
                              <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No conversations yet</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedConversation ? (
              <Card className="h-full flex flex-col">
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(selectedConversation.otherUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversation.otherUserName}
                    </h3>
                    <p className="text-xs text-gray-500">{selectedConversation.otherUserRole}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isOwnMessage = msg.senderId === user.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {new Date(msg.sentAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a conversation to start chatting</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
