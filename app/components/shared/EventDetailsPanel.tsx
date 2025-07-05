import React from "react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Clock, MapPin, User, Users } from "lucide-react";
import { format } from "date-fns";

interface Musician {
  id: string;
  stage_name: string;
  profile_picture?: string;
  user_id: string;
}

interface Application {
  id: string;
  status: string;
  proposed_rate: number;
  musician_pitch: string;
  musician: Musician;
}

interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  musician?: Musician;
  applications?: Application[];
}

interface EventDetailsPanelProps {
  event: Event;
  selectedRecipient: string;
  onApplicantSelect: (applicantId: string) => void;
  className?: string;
}

export function EventDetailsPanel({
  event,
  selectedRecipient,
  onApplicantSelect,
  className = ""
}: EventDetailsPanelProps) {

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}${ampm}`;
  };

  const formatEventDisplay = (event: Event) => {
    const startTime = formatTime(event.start_time);
    const endTime = formatTime(event.end_time);
    const timeRange = startTime && endTime ? `${startTime}-${endTime}` : startTime || endTime || '';
    return timeRange ? `${timeRange} - ${event.title}` : event.title;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'selected': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{formatEventDisplay(event)}</h3>
          <p className="text-sm text-gray-600">
            {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Badge className={getStatusColor(event.status)}>
          {event.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>Main Stage</span>
        </div>
      </div>

      {/* Musicians/Applicants */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          {event.musician ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
          {event.musician ? 'Musician' : 'Applicants'}
          {event.status === 'applied' && event.applications && (
            <span className="text-xs text-gray-500">
              (Click to select for messaging)
            </span>
          )}
        </h4>
        
        {event.musician ? (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={event.musician.profile_picture} />
              <AvatarFallback>{event.musician.stage_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{event.musician.stage_name}</p>
              <p className="text-sm text-gray-600">Confirmed performer</p>
            </div>
          </div>
        ) : event.applications ? (
          <div className="space-y-2">
            {event.applications.map((app, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  event.status === 'applied' 
                    ? selectedRecipient === app.musician.user_id
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                    : 'bg-gray-50'
                }`}
                onClick={() => event.status === 'applied' && onApplicantSelect(app.id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={app.musician.profile_picture} />
                  <AvatarFallback>{app.musician.stage_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{app.musician.stage_name}</p>
                  <p className="text-xs text-gray-600">Applicant</p>
                </div>
                {event.status === 'applied' && selectedRecipient === app.musician.user_id && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-600 font-medium">Selected</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* All Applicants Option for Applied Events */}
            {event.status === 'applied' && event.applications.length > 1 && (
              <div 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-2 border-dashed ${
                  selectedRecipient === "all"
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-gray-50 hover:bg-blue-50 border-gray-300'
                }`}
                onClick={() => onApplicantSelect("all")}
              >
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Message All Applicants</p>
                  <p className="text-xs text-gray-600">Send to all {event.applications.length} applicants</p>
                </div>
                {selectedRecipient === "all" && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-600 font-medium">Selected</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No musicians connected</p>
        )}
      </div>
    </div>
  );
} 