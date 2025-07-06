import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Clock, DollarSign, Edit, Users } from "lucide-react";
import { StatusDisplay } from "./StatusDisplay";

interface EventCardProps {
  event: any;
  onEventClick?: () => void;
  showStatusBadge?: boolean;
  showActions?: boolean;
  clickText?: string;
  className?: string;
  applicationCount?: number;
  pendingApplicationCount?: number;
  onEdit?: () => void;
  onViewApplications?: () => void;
}

const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case 'open':
      return 'border-l-blue-500 border-r-blue-500';
    case 'confirmed':
      return 'border-l-green-500 border-r-green-500';
    case 'invited':
      return 'border-l-indigo-500 border-r-indigo-500';
    case 'application_received':
      return 'border-l-purple-500 border-r-purple-500';
    case 'selected':
      return 'border-l-yellow-500 border-r-yellow-500';
    case 'cancel_requested':
      return 'border-l-orange-500 border-r-orange-500';
    case 'cancelled':
      return 'border-l-red-500 border-r-red-500';
    case 'completed':
      return 'border-l-cyan-500 border-r-cyan-500';
    default:
      return 'border-l-gray-300 border-r-gray-300';
  }
};



const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (timeString?: string) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEventClick,
  showStatusBadge = true,
  showActions = true,
  clickText = "Click for event details",
  className = '',
  applicationCount = 0,
  pendingApplicationCount = 0,
  onEdit,
  onViewApplications
}) => {
  const borderColor = getStatusBorderColor(event.eventStatus);

  return (
    <Card className={`${borderColor} border-l-4 border-r-4 hover:shadow-md transition-shadow ${onEventClick ? 'cursor-pointer' : ''} ${className}`}>
      <CardContent className="pt-6" onClick={onEventClick}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {event.title || "Untitled Event"}
                </div>
                <div className="text-md text-gray-600">
                  {applicationCount > 0 
                    ? `${applicationCount} ${applicationCount === 1 ? 'Application' : 'Applications'}` 
                    : 'No Applications'}
                </div>
              </div>
              {showStatusBadge && (
                <StatusDisplay 
                  status={event.eventStatus} 
                  variant="badge" 
                  showIcon={true} 
                  showLabel={true} 
                />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {event.date ? formatDate(event.date) : "Date TBD"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {event.start_time && event.end_time 
                    ? `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                    : event.startTime && event.endTime
                    ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                    : "Time TBD"
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  ${event.rate || 0}/hr
                </span>
              </div>
            </div>
            
            {event.description && (
              <div className="mb-4">
                <div className="text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </div>
              </div>
            )}
          </div>
          
          {showActions && (
            <div className="flex gap-2 ml-4">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
              
              {onViewApplications && applicationCount > 0 && (
                <Button
                  variant={pendingApplicationCount > 0 ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewApplications();
                  }}
                  className={`flex items-center gap-1 ${pendingApplicationCount > 0 ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                >
                  <Users className="h-4 w-4" />
                  {pendingApplicationCount > 0 ? 'Review Applications' : 'View Applications'} ({pendingApplicationCount > 0 ? pendingApplicationCount : applicationCount})
                </Button>
              )}
            </div>
          )}
        </div>
        
        {clickText && onEventClick && (
          <div className="text-xs text-blue-600 mt-3 text-center">
            {clickText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 