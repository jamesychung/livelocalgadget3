import React, { useState, useEffect, useRef } from "react";
import { useFindMany, useMutation, useUser } from "@gadgetinc/react";
import { api } from "../../api";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { MessageCircle, Send, Paperclip, ChevronDown, ChevronUp } from "lucide-react";
import { useAction } from "@gadgetinc/react";

interface BookingMessagingProps {
  bookingId: string;
  eventTitle?: string;
  musicianName?: string;
  className?: string;
  bookingData?: any;
}

export const BookingMessaging: React.FC<BookingMessagingProps> = ({
  bookingId,
  eventTitle,
  musicianName,
  className = "",
  bookingData
}) => {
  const user = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for this booking
  const [{ data: messages, fetching: messagesFetching, error: messagesError }] = useFindMany(api.message, {
    filter: {
      booking: { id: { equals: bookingId } },
      isActive: { equals: true }
    },
    sort: { createdAt: "Ascending" }
  });

  // Use passed booking data or fetch it if not provided
  const [{ data: bookingDataFromAPI }] = useFindMany(api.booking, {
    filter: { id: { equals: bookingId } },
    select: {
      id: true,
      event: {
        id: true,
        venue: {
          id: true,
          owner: {
            id: true
          }
        }
      },
      musician: {
        id: true,
        user: {
          id: true
        }
      }
    },
    pause: !!bookingData // Don't fetch if bookingData is provided
  });

  // Use provided booking data or fetched data
  const booking = (bookingData || bookingDataFromAPI?.[0]) as any;

  // Check if we have valid booking data
  const hasValidBooking = booking && booking.id && booking.event && booking.musician;

  // Create message action
  const [createMessageResult, createMessage] = useAction(api.message.create);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !hasValidBooking || !user || isSending) return;

    setIsSending(true);
    try {
      console.log("BookingMessaging Debug:", {
        currentUserId: user.id,
        bookingEventVenueOwnerId: booking.event?.venue?.owner?.id,
        bookingMusicianUserId: booking.musician?.user?.id,
        booking,
        bookingEvent: booking.event,
        bookingMusician: booking.musician
      });

      // Determine recipient based on current user's role
      const isVenue = user.id === booking.event?.venue?.owner?.id;
      const recipientId = isVenue 
        ? booking.musician?.user?.id 
        : booking.event?.venue?.owner?.id;

      console.log("Recipient determination:", {
        isVenue,
        recipientId,
        eventVenueOwnerId: booking.event?.venue?.owner?.id,
        musicianUserId: booking.musician?.user?.id
      });

      if (!recipientId) {
        console.error("Could not determine recipient");
        return;
      }

      // Try using useMutation
      const messageData = {
        content: newMessage.trim(),
        booking: { connect: { id: booking.id } },
        recipient: { connect: { id: recipientId } },
        messageType: "text"
      };

      console.log("Sending message data:", messageData);

      const result = await createMessage(messageData);

      console.log("Message creation result:", result);
      
      // Check if there was an error in the result
      if (result.error) {
        console.error("Message creation failed:", result.error);
        throw result.error;
      }

      console.log("Message created successfully");
      
      setNewMessage("");
      // Messages will automatically refresh on next render
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Log detailed error information
      if (error?.graphQLErrors) {
        console.error("GraphQL Errors:", error.graphQLErrors);
      }
      if (error?.networkError) {
        console.error("Network Error:", error.networkError);
      }
      if (error?.message) {
        console.error("Error Message:", error.message);
      }
      
      // Check if the message was actually created despite the error
      console.log("Checking if message was created despite error...");
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

  const messageCount = messages?.length || 0;

  // Collapsed view
  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className={`w-full justify-start ${className}`}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Messages {messageCount > 0 && `(${messageCount})`}
        <ChevronDown className="w-4 h-4 ml-auto" />
      </Button>
    );
  }

  // Expanded view
  return (
    <Card className={`mt-4 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Messages</span>
            {messageCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {messageCount}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8 p-0"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </CardTitle>
        {(eventTitle || musicianName) && (
          <div className="text-sm text-gray-600">
            {eventTitle && <p><strong>Event:</strong> {eventTitle}</p>}
            {musicianName && <p><strong>Musician:</strong> {musicianName}</p>}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Messages List */}
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {messagesFetching ? (
            <div className="text-center text-gray-500 py-4">Loading messages...</div>
          ) : messagesError ? (
            <div className="text-center text-red-500 py-4">
              Error loading messages: {messagesError.message}
            </div>
          ) : messages && messages.length > 0 ? (
            <>
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
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>

        {/* Message Input */}
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
            disabled={!newMessage.trim() || isSending || !hasValidBooking}
            size="sm"
            className="self-end"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 
