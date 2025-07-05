import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { MessageCircle, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sent_date_time: string;
  sender_role: string;
  event: {
    title: string;
    date: string;
    venue: {
      name: string;
    };
  };
}

interface RecentMessagesCardProps {
  messages: Message[];
  unreadCount: number;
}

export const RecentMessagesCard: React.FC<RecentMessagesCardProps> = ({
  messages,
  unreadCount
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Recent Messages
        </CardTitle>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="h-6 px-2 text-xs">
            {unreadCount} unread
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.slice(0, 3).map((message) => (
              <div key={message.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {message.event.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {message.event.venue.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(message.event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(message.sent_date_time)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/musician-messages">
                  View All Messages
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">No messages yet</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/musician-messages">
                Check Messages
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 