import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MessageCircle, Calendar, Clock, Users, Mail } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  unread_count?: number;
  musician?: {
    id: string;
    stage_name: string;
  };
  applications?: Array<{
    musician: {
      stage_name: string;
    };
  }>;
  allPastMusicians?: Array<{
    id: string;
    stage_name: string;
  }>;
  messages?: Array<{
    content: string;
    sent_date_time: string;
  }>;
}

interface MessagesListViewProps {
  filteredEvents: Event[];
  statusFilter: string;
  onEventClick: (event: Event) => void;
}

export function MessagesListView({ filteredEvents, statusFilter, onEventClick }: MessagesListViewProps) {
  
  // Helper function to format time
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}${ampm}`;
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600">
          {statusFilter === "with_messages" 
            ? "No events have unread messages"
            : statusFilter === "all"
              ? "You don't have any events yet"
              : `No events with status "${statusFilter}"`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => {
        const eventUnreadCount = event.unread_count || 0;
        const isClickable = event.musician || 
                           (event.applications && event.applications.length > 0) ||
                           (event.allPastMusicians && event.allPastMusicians.length > 0);
        const lastMessage = event.messages && event.messages.length > 0 
          ? event.messages[event.messages.length - 1] 
          : null;
        
        return (
          <Card 
            key={event.id} 
            className={`transition-all duration-200 ${
              isClickable ? 'hover:shadow-md cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => isClickable && onEventClick(event)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge className={
                      event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      event.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'selected' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {event.status}
                    </Badge>
                    {eventUnreadCount > 0 && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {eventUnreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </div>
                  </div>

                  {/* Show musician or applicants */}
                  {event.musician ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{event.musician.stage_name}</span>
                      <span className="text-gray-500">• Confirmed performer</span>
                    </div>
                  ) : event.applications && event.applications.length > 0 ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{event.applications.length} applicant{event.applications.length > 1 ? 's' : ''}</span>
                      <span className="text-gray-500">
                        • {event.applications.map(app => app.musician.stage_name).join(', ')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>No musicians connected</span>
                    </div>
                  )}

                  {/* Show last message preview */}
                  {lastMessage && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <p className="text-gray-700 line-clamp-2">{lastMessage.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(lastMessage.sent_date_time), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isClickable && (
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 