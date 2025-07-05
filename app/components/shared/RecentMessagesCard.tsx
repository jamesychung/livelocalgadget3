import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageCircle, ExternalLink, Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { EventMessagingDialog } from "./EventMessagingDialog";
import { useMessaging } from "../../hooks/useMessaging";
import { useAuth } from "../../lib/auth";

interface RecentMessagesCardProps {
  className?: string;
}

export function RecentMessagesCard({ className = "" }: RecentMessagesCardProps) {
  const { user } = useAuth();
  const { getRecentMessages, getTotalUnreadCount, loading, error } = useMessaging(user);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  const recentMessages = getRecentMessages(3); // Get 3 most recent messages
  const totalUnread = getTotalUnreadCount();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'selected': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 80) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const handleMessageClick = (messageData: any) => {
    if (messageData.event) {
      setSelectedEvent(messageData.event);
      setIsEventDialogOpen(true);
    }
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading messages...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Error loading messages</p>
            <p className="text-sm text-gray-400 mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Recent Messages
              {totalUnread > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {totalUnread} unread
                </Badge>
              )}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/messages">
                View All
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent messages</p>
              <p className="text-sm text-gray-400 mt-1">Messages with musicians will appear here</p>
            </div>
          ) : (
            <>
              {recentMessages.map((messageData) => {
                const event = messageData.event;
                if (!event) return null;

                const unreadCount = messageData.read_status ? 0 : 1;
                const musicianName = event.musician?.stage_name || 
                  (event.applications && event.applications.length > 0 ? event.applications[0].musician.stage_name : 'Unknown');
                const musicianAvatar = event.musician?.profile_picture || 
                  (event.applications && event.applications.length > 0 ? event.applications[0].musician.profile_picture : null);

                return (
                  <div
                    key={messageData.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                      !messageData.read_status ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-white border-gray-200'
                    }`}
                    onClick={() => handleMessageClick(messageData)}
                    title="Click to open conversation"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={musicianAvatar || undefined} />
                        <AvatarFallback>{musicianName[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(event.status)}`}>
                              {event.status}
                            </Badge>
                          </div>
                          {!messageData.read_status && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-xs text-blue-600 font-medium">
                                New
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">
                          with {musicianName}
                        </p>
                        
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {truncateMessage(messageData.content)}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(messageData.sent_date_time), 'MMM d, h:mm a')}</span>
                          <span>•</span>
                          <span>{format(new Date(event.date), 'MMM d')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {recentMessages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No recent messages</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Event Messaging Dialog */}
      <EventMessagingDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        event={selectedEvent}
        onClose={closeEventDialog}
      />
    </>
  );
} 