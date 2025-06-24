import React, { useState, useEffect } from "react";
import { useFindMany, useAction, useUser } from "@gadgetinc/react";
import { api } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { MessageCircle, Send, Search, Calendar, User } from "lucide-react";

export default function MessagesPage() {
  const user = useUser();
  const [selectedMusician, setSelectedMusician] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user's bookings (for conversations)
  const [{ data: bookings, fetching: bookingsFetching }] = useFindMany(api.booking, {
    filter: {
      or: [
        { musician: { user: { id: { equals: user?.id } } } },
        { venue: { owner: { id: { equals: user?.id } } } }
      ],
      isActive: { equals: true }
    },
    sort: { updatedAt: "Descending" }
  });

  // Fetch messages for selected booking
  const [{ data: messages, fetching: messagesFetching }] = useFindMany(api.message, {
    filter: {
      booking: { id: { equals: selectedEvent } },
      isActive: { equals: true }
    },
    sort: { createdAt: "Ascending" }
  });

  // Create message action
  const [createMessageResult, createMessage] = useAction(api.message.create);

  // Group bookings by musician for conversation list
  const conversations = bookings?.reduce((acc, booking) => {
    const musicianId = booking.musician?.id;
    const venueId = booking.venue?.id;
    
    if (!acc[musicianId]) {
      acc[musicianId] = {
        musician: booking.musician,
        events: []
      };
    }
    
    acc[musicianId].events.push(booking);
    return acc;
  }, {} as Record<string, { musician: any; events: any[] }>) || {};

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedEvent || isSending) return;

    setIsSending(true);
    try {
      const currentBooking = bookings?.find(b => b.id === selectedEvent);
      if (!currentBooking) return;

      // Determine recipient
      const isVenue = user?.id === currentBooking.venue?.owner?.id;
      const recipientId = isVenue ? currentBooking.musician?.user?.id : currentBooking.venue?.owner?.id;
      
      await createMessage({
        content: newMessage.trim(),
        booking: { connect: { id: selectedEvent } },
        recipient: { connect: { id: recipientId } },
        messageType: "text"
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = Object.entries(conversations).filter(([_, data]) => {
    if (!searchTerm) return true;
    return data.musician?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Panel - Conversations */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search musicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {bookingsFetching ? (
              <div className="p-4 text-center text-gray-500">Loading conversations...</div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map(([musicianId, data]) => (
                <div
                  key={musicianId}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedMusician === musicianId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                  }`}
                  onClick={() => setSelectedMusician(musicianId)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={data.musician?.profileImage} />
                      <AvatarFallback>
                        {data.musician?.name?.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {data.musician?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {data.events.length} event{data.events.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="flex-1 flex flex-col">
          {selectedMusician ? (
            <>
              {/* Event Selection */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium mb-2">Select Event:</h3>
                <div className="flex flex-wrap gap-2">
                  {conversations[selectedMusician]?.events.map((event) => (
                    <Button
                      key={event.id}
                      variant={selectedEvent === event.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedEvent(event.id)}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      {event.event?.title || "Untitled Event"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedEvent ? (
                  <>
                    {messagesFetching ? (
                      <div className="text-center text-gray-500">Loading messages...</div>
                    ) : messages && messages.length > 0 ? (
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender?.id === user?.id ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                                message.sender?.id === user?.id
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <div className="text-sm">{message.content}</div>
                              <div className={`text-xs mt-1 ${
                                message.sender?.id === user?.id ? "text-blue-100" : "text-gray-500"
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    Select an event to view messages
                  </div>
                )}
              </div>

              {/* Message Input */}
              {selectedEvent && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 min-h-[60px] resize-none"
                      disabled={isSending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                      size="sm"
                      className="self-end"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a musician from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 