import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MessageCircle } from "lucide-react";
import { useMessaging } from "../../hooks/useMessaging";
import { useAuth } from "../../lib/auth";
import { ActivityLog, generateEventActivityItems } from "./ActivityLog";
import { MessageComposer } from "./MessageComposer";
import { MessageThread } from "./MessageThread";
import { EventDetailsPanel } from "./EventDetailsPanel";
import { ResizableDialog } from "./ResizableDialog";

interface EventMessagingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
  onClose: () => void;
}

export function EventMessagingDialog({ open, onOpenChange, event, onClose }: EventMessagingDialogProps) {
  const { user } = useAuth();
  const { sendMessage, markMessagesAsRead, venue, musician, events } = useMessaging(user);
  
  // Get the current event data from the messaging hook (includes updated messages)
  const foundEvent = events.find(e => e.id === event?.id);
  const currentEvent = foundEvent || event;
  

  const [newMessage, setNewMessage] = useState("");
  const [messageCategory, setMessageCategory] = useState("general");
  const [selectedRecipient, setSelectedRecipient] = useState("all");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [leftPanelTab, setLeftPanelTab] = useState("details");
  const [isSending, setIsSending] = useState(false);
  
  // Set default recipient when event changes
  React.useEffect(() => {
    if (currentEvent && currentEvent.status === 'applied' && currentEvent.applications && currentEvent.applications.length > 0) {
      // Default to first applicant for applied events
      setSelectedRecipient(currentEvent.applications[0].id);
    } else if (currentEvent && currentEvent.musician) {
      // Default to the musician for confirmed/selected events
      setSelectedRecipient(currentEvent.musician.user_id);
    } else {
      setSelectedRecipient("all");
    }
  }, [currentEvent]);

  // Mark messages as read when dialog opens
  React.useEffect(() => {
    if (open && currentEvent && currentEvent.messages) {
      const unreadMessages = currentEvent.messages.filter((msg: any) => !msg.read_status);
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg: any) => msg.id);
        markMessagesAsRead(messageIds).catch(console.error);
      }
    }
  }, [open, currentEvent, markMessagesAsRead]);

  if (!currentEvent) return null;

  // Get messages for this event
  const eventMessages = currentEvent.messages || [];
  


  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    

    
    setIsSending(true);
    try {
      if (selectedRecipient === "all" && currentEvent.applications) {
        // Send to all applicants
        for (const application of currentEvent.applications) {
          await sendMessage({
            event_id: currentEvent.id,
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
          recipientId = currentEvent.venue?.owner_id;

        } else {
          // If current user is venue, send to selected musician
          recipientId = currentEvent.musician?.user_id || selectedRecipient;

        }
        
        if (!recipientId) {
          console.error('No recipient ID found for message');
          return;
        }
        
        await sendMessage({
          event_id: currentEvent.id,
          recipient_id: recipientId,
          content: newMessage,
          message_category: messageCategory,
          attachments: attachments.map(file => ({ name: file.name, size: file.size, type: file.type }))
        });
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
      const app = currentEvent.applications?.find((app: any) => app.id === applicantId);
      if (app && app.musician.user_id) {
        setSelectedRecipient(app.musician.user_id);
      } else {
        setSelectedRecipient(applicantId);
      }
    }
  };

  const getSelectedRecipientName = () => {
    if (selectedRecipient === "all") return "All Applicants";
    if (currentEvent.musician && selectedRecipient === currentEvent.musician.user_id) return currentEvent.musician.stage_name;
    if (currentEvent.applications) {
      // First try to find by user_id (for messaging)
      const appByUserId = currentEvent.applications.find((app: any) => app.musician.user_id === selectedRecipient);
      if (appByUserId) return appByUserId.musician.stage_name;
      
      // Fallback to find by application id (for UI selection)
      const appById = currentEvent.applications.find((app: any) => app.id === selectedRecipient);
      if (appById) return appById.musician.stage_name;
    }
    return "Unknown";
  };

  // Generate activity items for the ActivityLog
  const activityItems = generateEventActivityItems(currentEvent, currentEvent.applications || []);

  // Create the left panel content
  const leftPanel = (
    <div className="p-6">
      <Tabs value={leftPanelTab} onValueChange={setLeftPanelTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <EventDetailsPanel
            event={currentEvent}
            selectedRecipient={selectedRecipient}
            onApplicantSelect={handleApplicantSelect}
          />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <div className="space-y-4">
            <h4 className="font-medium">Activity Log</h4>
            <ActivityLog activities={activityItems} />
          </div>
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
      title="Event Messages"
      titleIcon={<MessageCircle className="h-5 w-5" />}
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      initialLeftWidth={33}
      minLeftWidth={20}
      maxLeftWidth={60}
    />
  );
} 
