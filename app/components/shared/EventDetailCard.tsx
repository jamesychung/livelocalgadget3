import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { StatusBadge } from "../venue/dashboard/StatusBadge";

interface EventDetailCardProps {
  event: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    venue_id: string;
    status: string;
    created_at: string;
    updated_at?: string;
    musician?: {
      id: string;
      stage_name: string;
      city?: string;
      state?: string;
      genre?: string;
    };
  };
  onEventClick: (event: any) => void;
  showMusicianInfo?: boolean;
  variant?: 'default' | 'confirmed' | 'pending';
}

export const EventDetailCard: React.FC<EventDetailCardProps> = ({ 
  event, 
  onEventClick, 
  showMusicianInfo = false,
  variant = 'default'
}) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'confirmed':
        return {
          container: 'bg-white p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
          badge: 'bg-green-100 text-green-800',
          title: 'text-green-800'
        };
      case 'pending':
        return {
          container: 'bg-white p-4 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
          badge: 'bg-orange-100 text-orange-800',
          title: 'text-orange-800'
        };
      default:
        return {
          container: 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
          badge: 'bg-gray-100 text-gray-800',
          title: 'text-gray-800'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div 
      className={styles.container}
      onClick={() => onEventClick(event)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {showMusicianInfo && event.musician?.stage_name ? (
            <span className="text-blue-600 font-semibold text-lg">
              {event.musician.stage_name.charAt(0)}
            </span>
          ) : (
            <Calendar className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${styles.title}`}>{event.title}</h4>
                          <StatusBadge status={event.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            {event.start_time && event.end_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
              </div>
            )}
          </div>
          {showMusicianInfo && event.musician && (
            <div className="text-sm text-gray-500 mt-1">
              Musician: {event.musician.stage_name}
              {event.musician.city && event.musician.state && (
                <span> • {event.musician.city}, {event.musician.state}</span>
              )}
            </div>
          )}
          {event.description && (
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
              {event.description}
            </div>
          )}
          <div className="text-xs text-blue-600 mt-1">
            Click for event details and activity log
          </div>
        </div>
      </div>
    </div>
  );
}; 