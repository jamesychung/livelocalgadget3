import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MessageCircle } from "lucide-react";
import { useMessaging } from "../../hooks/useMessaging";
import { useAuth } from "../../lib/auth";
import { ActivityLog, generateEventActivityItems } from "./ActivityLog";
import { MessageComposer } from "./MessageComposer";
import { MessageThread } from "./MessageThread";
import { EventDetailsPanel } from "./EventDetailsPanel";

interface EventMessagingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
  onClose: () => void;
}

export function EventMessagingDialog({ open, onOpenChange, event, onClose }: EventMessagingDialogProps) {
  const { user } = useAuth();
  const { sendMessage, markMessagesAsRead } = useMessaging(user);
  const [newMessage, setNewMessage] = useState("");
  const [messageCategory, setMessageCategory] = useState("general");
  const [selectedRecipient, setSelectedRecipient] = useState("all");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [leftPanelTab, setLeftPanelTab] = useState("details");
  const [isSending, setIsSending] = useState(false);

  // Set default recipient when event changes
  React.useEffect(() => {
    if (event && event.status === 'applied' && event.applications && event.applications.length > 0) {
      // Default to first applicant for applied events
      setSelectedRecipient(event.applications[0].id);
    } else if (event && event.musician) {
      // Default to the musician for confirmed/selected events
      setSelectedRecipient(event.musician.user_id);
    } else {
      setSelectedRecipient("all");
    }
  }, [event]);

  // Mark messages as read when dialog opens
  React.useEffect(() => {
    if (open && event && event.messages) {
      const unreadMessages = event.messages.filter((msg: any) => !msg.read_status);
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg: any) => msg.id);
        markMessagesAsRead(messageIds).catch(console.error);
      }
    }
  }, [open, event, markMessagesAsRead]);

  if (!event) return null;

  // Get messages for this event
  const eventMessages = event.messages || [];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    try {
      if (selectedRecipient === "all" && event.applications) {
        // Send to all applicants
        for (const application of event.applications) {
          await sendMessage({
            event_id: event.id,
            recipient_id: application.musician.user_id,
            content: newMessage,
            message_category: messageCategory,
            attachments: attachments.map(file => ({ name: file.name, size: file.size, type: file.type }))
          });
        }
      } else if (selectedRecipient !== "all") {
        // Send to specific recipient
        const recipientId = event.musician?.user_id || selectedRecipient;
        await sendMessage({
          event_id: event.id,
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
      const app = event.applications?.find((app: any) => app.id === applicantId);
      if (app && app.musician.user_id) {
        setSelectedRecipient(app.musician.user_id);
      } else {
        setSelectedRecipient(applicantId);
      }
    }
  };

  const getSelectedRecipientName = () => {
    if (selectedRecipient === "all") return "All Applicants";
    if (event.musician && selectedRecipient === event.musician.user_id) return event.musician.stage_name;
    if (event.applications) {
      // First try to find by user_id (for messaging)
      const appByUserId = event.applications.find((app: any) => app.musician.user_id === selectedRecipient);
      if (appByUserId) return appByUserId.musician.stage_name;
      
      // Fallback to find by application id (for UI selection)
      const appById = event.applications.find((app: any) => app.id === selectedRecipient);
      if (appById) return appById.musician.stage_name;
    }
    return "Unknown";
  };

  // Generate activity items for the ActivityLog
  const activityItems = generateEventActivityItems(event, event.applications || []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Event Messages
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-full">
          {/* Left Panel */}
          <div className="w-1/3 border-r border-gray-200 p-6">
            <Tabs value={leftPanelTab} onValueChange={setLeftPanelTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <EventDetailsPanel
                  event={event}
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

          {/* Right Panel - Messages */}
          <div className="w-2/3 flex flex-col">
            <MessageThread
              messages={eventMessages}
              currentUserRole="venue"
              recipientName={getSelectedRecipientName()}
              className="flex-1"
            />
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
        </div>
      </DialogContent>
    </Dialog>
  );
} 