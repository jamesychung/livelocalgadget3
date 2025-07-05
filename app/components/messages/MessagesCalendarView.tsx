import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  unread_count?: number;
  musician?: any;
  applications?: any[];
  allPastMusicians?: any[];
}

interface MessagesCalendarViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  filteredEvents: Event[];
  onEventClick: (event: Event) => void;
}

export function MessagesCalendarView({ 
  currentDate, 
  setCurrentDate, 
  filteredEvents, 
  onEventClick 
}: MessagesCalendarViewProps) {
  
  // Calendar navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    const currentDateIter = new Date(startDate);
    
    while (currentDateIter <= lastDay || dates.length < 42) {
      dates.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    return dates;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredEvents.filter(event => {
      return event.date === dateStr;
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  };

  // Helper function to format time
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}${ampm}`;
  };

  // Helper function to format event display
  const formatEventDisplay = (event: Event) => {
    const startTime = formatTime(event.start_time);
    const endTime = formatTime(event.end_time);
    const timeRange = startTime && endTime ? `${startTime}-${endTime}` : startTime || endTime || '';
    const showName = event.title || 'Event';
    
    if (timeRange) {
      return `${timeRange} - ${showName}`;
    }
    return showName;
  };

  const monthDates = getMonthDates();

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
            {day}
          </div>
        ))}
        
        {/* Calendar dates */}
        {monthDates.map((date, index) => {
          const dateEvents = getEventsForDate(date);
          const hasEvents = dateEvents.length > 0;
          const unreadCount = dateEvents.reduce((sum, event) => sum + (event.unread_count || 0), 0);
          
          return (
            <div
              key={index}
              className={`min-h-[140px] p-2 border border-gray-200 ${
                isCurrentMonth(date) ? 'bg-white' : 'bg-gray-50'
              } ${isToday(date) ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentMonth(date) ? 'text-gray-900' : 'text-gray-400'
              } ${isToday(date) ? 'text-blue-600' : ''}`}>
                {date.getDate()}
              </div>
              
              {hasEvents && (
                <div className="space-y-1">
                  {dateEvents.slice(0, 3).map((event, eventIndex) => {
                    const eventUnreadCount = event.unread_count || 0;
                    const isClickable = event.musician || 
                                       (event.applications && event.applications.length > 0) ||
                                       (event.allPastMusicians && event.allPastMusicians.length > 0);
                    
                    return (
                      <div
                        key={eventIndex}
                        className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                          event.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          event.status === 'applied' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                          event.status === 'selected' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } ${!isClickable ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => isClickable && onEventClick(event)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{formatEventDisplay(event)}</span>
                          {eventUnreadCount > 0 && (
                            <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs flex items-center justify-center">
                              {eventUnreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {dateEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dateEvents.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 