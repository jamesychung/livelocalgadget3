import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MessageCircle, User, Calendar } from "lucide-react";
import { useMessaging } from "../../hooks/useMessaging";
import { useAuth } from "../../lib/auth";
import { api } from "../../api";
import { ActivityLog, generateEventActivityItems, generateBookingActivityItems } from "./ActivityLog";
import { MessageComposer } from "./MessageComposer";
import { MessageThread } from "./MessageThread";
import { EventDetailsPanel } from "./EventDetailsPanel";
import { ResizableDialog } from "./ResizableDialog";

interface EventMessagingDialogProps {
  // Dialog state
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  
  // Context - one of these is required
  event?: any;           // For event-based messaging
  booking?: any;         // For booking-specific messaging  
  recipientId?: string;  // For direct user messaging
  recipientName?: string; // For direct user messaging
  
  // Display options
  title?: string;
  showActivityLog?: boolean;
  showEventDetails?: boolean;
  compact?: boolean;     // For mobile/embedded use
  
  // Legacy props for compatibility
  selectedEvent?: any;   // Alternative to event
}

export function EventMessagingDialog({ 
  open, 
  onOpenChange, 
  event, 
  booking,
  recipientId,
  recipientName,
  onClose,
  title,
  showActivityLog = true,
  showEventDetails = true,
  compact = false,
  
  // Legacy compatibility
  selectedEvent
}: EventMessagingDialogProps) {
  const { user } = useAuth();
  const { sendMessage, markMessagesAsRead, venue, musician, events } = useMessaging(user);
  
  // Determine the context and get the appropriate data
  const currentEvent = event || selectedEvent;
  const currentBooking = booking;
  const isEventContext = !!currentEvent;
  const isBookingContext = !!currentBooking;
  const isDirectContext = !!recipientId && !isEventContext && !isBookingContext;
  
  // Get the event data from the messaging hook if available (includes updated messages)
  const foundEvent = currentEvent ? events.find(e => e.id === currentEvent.id) : null;
  const contextEvent = foundEvent || currentEvent;
  
  // State management
  const [newMessage, setNewMessage] = useState("");
  const [messageCategory, setMessageCategory] = useState("general");
  const [selectedRecipient, setSelectedRecipient] = useState("all");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [leftPanelTab, setLeftPanelTab] = useState("details");
  const [isSending, setIsSending] = useState(false);
  
  // Set default recipient when context changes
  React.useEffect(() => {
    if (isDirectContext && recipientId) {
      setSelectedRecipient(recipientId);
    } else if (isBookingContext && currentBooking) {
      // For booking context, determine the other party
      const isVenue = venue?.id;
      const isMusician = musician?.user_id;
      
      if (isVenue && currentBooking.musician?.user_id) {
        setSelectedRecipient(currentBooking.musician.user_id);
      } else if (isMusician && currentBooking.event?.venue?.owner_id) {
        setSelectedRecipient(currentBooking.event.venue.owner_id);
      }
    } else if (isEventContext && contextEvent) {
      if (contextEvent.status === 'applied' && contextEvent.applications && contextEvent.applications.length > 0) {
        // Default to first applicant for applied events
        setSelectedRecipient(contextEvent.applications[0].id);
      } else if (contextEvent.musician) {
        // Default to the musician for confirmed/selected events
        setSelectedRecipient(contextEvent.musician.user_id);
      } else {
        setSelectedRecipient("all");
      }
    }
  }, [contextEvent, currentBooking, recipientId, venue, musician, isEventContext, isBookingContext, isDirectContext]);

  // Mark messages as read when dialog opens
  React.useEffect(() => {
    if (open && contextEvent && contextEvent.messages) {
      const unreadMessages = contextEvent.messages.filter((msg: any) => !msg.read_status);
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg: any) => msg.id);
        markMessagesAsRead(messageIds).catch(console.error);
      }
    }
  }, [open, contextEvent, markMessagesAsRead]);

  // Don't render if no valid context
  if (!isEventContext && !isBookingContext && !isDirectContext) {
    console.warn("EventMessagingDialog: No valid context provided (event, booking, or recipientId)");
    return null;
  }

  // Get messages based on context
  const getMessages = () => {
    if (isEventContext && contextEvent) {
      return contextEvent.messages || [];
    } else if (isBookingContext && currentBooking) {
      return currentBooking.messages || [];
    } else if (isDirectContext) {
      // For direct messaging, we'd need to fetch messages between current user and recipient
      // This could be enhanced later
      return [];
    }
    return [];
  };

  const eventMessages = getMessages();

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    try {
      if (isEventContext && contextEvent) {
        // Event-based messaging (existing logic)
        if (selectedRecipient === "all" && contextEvent.applications) {
          // Send to all applicants
          for (const application of contextEvent.applications) {
            await sendMessage({
              event_id: contextEvent.id,
              recipient_id: application.musician.user_id,
              content: newMessage,
              message_category: messageCategory,
              attachments: attachments.map(file => ({ name: file.name, size: file.size, type: file.type }))
            });
          }
        } else if (selectedRecipient !== "all") {
          // Send to specific recipient
          let recipientId;
          
          if (musician?.user_id) {
            // If current user is a musician, send to venue owner
            recipientId = contextEvent.venue?.owner_id;
          } else {
            // If current user is venue, send to selected musician
            recipientId = contextEvent.musician?.user_id || selectedRecipient;
          }
          
          if (!recipientId) {
            console.error('No recipient ID found for message');
            return;
          }
          
          await sendMessage({
            event_id: contextEvent.id,
            recipient_id: recipientId,
            content: newMessage,
            message_category: messageCategory,
            attachments: attachments.map(file => ({ name: file.name, size: file.size, type: file.type }))
          });
        }
      } else if (isBookingContext && currentBooking) {
        // Booking-based messaging - use the API directly
        const messageData = {
          content: newMessage.trim(),
          booking: { connect: { id: currentBooking.id } },
          recipient: { connect: { id: "placeholder" } }, // Will be determined in API
          messageType: "text",
          message_category: messageCategory
        };

        await api.message.create(messageData);
      } else if (isDirectContext && recipientId) {
        // Direct messaging - this would need to be implemented
        console.log("Direct messaging not yet implemented");
        return;
      }
      
      setNewMessage("");
      setAttachments([]);
      setMessageCategory("general");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleApplicantSelect = (applicantId: string) => {
    if (applicantId === "all") {
      setSelectedRecipient("all");
    } else {
      // Find the application and get the musician's user_id
      const app = contextEvent?.applications?.find((app: any) => app.id === applicantId);
      if (app && app.musician.user_id) {
        setSelectedRecipient(app.musician.user_id);
      } else {
        setSelectedRecipient(applicantId);
      }
    }
  };

  const getSelectedRecipientName = () => {
    if (isDirectContext && recipientName) {
      return recipientName;
    } else if (isBookingContext && currentBooking) {
      const isVenue = venue?.id;
      if (isVenue && currentBooking.musician?.stage_name) {
        return currentBooking.musician.stage_name;
      } else if (currentBooking.event?.venue?.name) {
        return currentBooking.event.venue.name;
      }
    } else if (isEventContext && contextEvent) {
      if (selectedRecipient === "all") return "All Applicants";
      if (contextEvent.musician && selectedRecipient === contextEvent.musician.user_id) return contextEvent.musician.stage_name;
      if (contextEvent.applications) {
        // First try to find by user_id (for messaging)
        const appByUserId = contextEvent.applications.find((app: any) => app.musician.user_id === selectedRecipient);
        if (appByUserId) return appByUserId.musician.stage_name;
        
        // Fallback to find by application id (for UI selection)
        const appById = contextEvent.applications.find((app: any) => app.id === selectedRecipient);
        if (appById) return appById.musician.stage_name;
      }
    }
    return "Unknown";
  };

  // Generate activity items based on context
  const getActivityItems = () => {
    if (isEventContext && contextEvent) {
      return generateEventActivityItems(contextEvent, contextEvent.applications || []);
    } else if (isBookingContext && currentBooking) {
      return generateBookingActivityItems(currentBooking);
    }
    return [];
  };

  const activityItems = getActivityItems();

  // Get dialog title
  const getDialogTitle = () => {
    if (title) return title;
    if (isEventContext && contextEvent) return `Event Messages - ${contextEvent.title}`;
    if (isBookingContext && currentBooking) return `Booking Messages - ${currentBooking.event?.title || 'Event'}`;
    if (isDirectContext) return `Messages with ${recipientName || 'User'}`;
    return "Messages";
  };

  // Get dialog icon
  const getDialogIcon = () => {
    if (isEventContext) return <Calendar className="h-5 w-5" />;
    if (isBookingContext) return <Calendar className="h-5 w-5" />;
    if (isDirectContext) return <User className="h-5 w-5" />;
    return <MessageCircle className="h-5 w-5" />;
  };

  // Create the left panel content
  const leftPanel = (
    <div className="p-6">
      <Tabs value={leftPanelTab} onValueChange={setLeftPanelTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          {isEventContext && contextEvent && showEventDetails && (
            <EventDetailsPanel
              event={contextEvent}
              selectedRecipient={selectedRecipient}
              onApplicantSelect={handleApplicantSelect}
            />
          )}
          {isBookingContext && currentBooking && (
            <div className="space-y-4">
              <h4 className="font-medium">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Event:</strong> {currentBooking.event?.title || 'N/A'}</div>
                <div><strong>Date:</strong> {currentBooking.event?.date || 'N/A'}</div>
                <div><strong>Status:</strong> {currentBooking.status || 'N/A'}</div>
                {currentBooking.proposed_rate && (
                  <div><strong>Rate:</strong> ${currentBooking.proposed_rate}</div>
                )}
                {currentBooking.musician_pitch && (
                  <div><strong>Pitch:</strong> {currentBooking.musician_pitch}</div>
                )}
              </div>
            </div>
          )}
          {isDirectContext && (
            <div className="space-y-4">
              <h4 className="font-medium">Direct Message</h4>
              <div className="text-sm">
                <div><strong>Recipient:</strong> {recipientName || 'User'}</div>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          {showActivityLog && activityItems.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Activity Log</h4>
              <ActivityLog activities={activityItems} />
            </div>
          )}
          {(!showActivityLog || activityItems.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity to display</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Create the right panel content
  const rightPanel = (
    <>
      <MessageThread
        messages={eventMessages}
        currentUserRole={venue?.id ? "venue" : "musician"}
        recipientName={getSelectedRecipientName()}
        className="flex-1 min-h-0"
      />
      <div className="flex-shrink-0">
        <MessageComposer
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          messageCategory={messageCategory}
          setMessageCategory={setMessageCategory}
          attachments={attachments}
          setAttachments={setAttachments}
          onSendMessage={handleSendMessage}
          recipientName={getSelectedRecipientName()}
          isSending={isSending}
        />
      </div>
    </>
  );

  return (
    <ResizableDialog
      open={open}
      onOpenChange={onOpenChange}
      title={getDialogTitle()}
      titleIcon={getDialogIcon()}
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      initialLeftWidth={compact ? 25 : 33}
      minLeftWidth={20}
      maxLeftWidth={60}
      className={compact ? "max-w-4xl h-[70vh]" : "max-w-6xl h-[80vh]"}
    />
  );
} 
