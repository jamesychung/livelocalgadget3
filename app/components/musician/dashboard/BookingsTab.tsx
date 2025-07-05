import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, DollarSign, AlertCircle, CheckCircle, MessageSquare, Users } from 'lucide-react';

interface Booking {
  id: string;
  status: string;
  proposed_rate?: number;
  musician_pitch?: string;
  created_at: string;
  event?: {
    id: string;
    title: string;
    date: string;
    start_time?: string;
    end_time?: string;
    description?: string;
    venue?: {
      id: string;
      name: string;
      city?: string;
      state?: string;
    };
  };
}

interface BookingsTabProps {
  bookings: Booking[];
}

export const BookingsTab: React.FC<BookingsTabProps> = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'selected': return 'bg-blue-500';
      case 'applied': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'selected': return 'secondary';
      case 'applied': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Group bookings by date - normalize both booking dates and calendar dates
    const bookingsByDate = bookings.reduce((acc, booking) => {
      if (booking.event?.date) {
        // Normalize the booking date to YYYY-MM-DD format
        const bookingDate = new Date(booking.event.date);
        const dateKey = bookingDate.toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(booking);
      }
      return acc;
    }, {} as Record<string, Booking[]>);

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="text-sm text-gray-500">
                  {bookings.length} total bookings
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={view === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('calendar')}
                >
                  Calendar
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((day, index) => {
                const isCurrentMonth = day.getMonth() === month;
                const isToday = day.toDateString() === new Date().toDateString();
                const dateKey = day.toISOString().split('T')[0];
                const dayBookings = bookingsByDate[dateKey] || [];
                
                return (
                  <div
                    key={index}
                    className={`min-h-[140px] p-2 border border-gray-200 ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    {dayBookings.map((booking, bookingIndex) => (
                      <div
                        key={bookingIndex}
                        className={`text-xs p-1 mb-1 rounded text-white ${getStatusColor(booking.status)}`}
                      >
                        <div className="font-medium truncate">
                          {booking.event?.title}
                        </div>
                        {booking.event?.start_time && (
                          <div className="opacity-90">
                            {formatTime(booking.event.start_time)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderList = () => {
    const sortedBookings = [...bookings].sort((a, b) => {
      if (!a.event?.date || !b.event?.date) return 0;
      return new Date(b.event.date).getTime() - new Date(a.event.date).getTime();
    });

    return (
      <div className="space-y-4">
        {sortedBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{booking.event?.title}</h3>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.event?.venue?.name}</span>
                      {booking.event?.venue?.city && (
                        <span>, {booking.event.venue.city}</span>
                      )}
                    </div>
                    {booking.event?.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.event.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {booking.event?.start_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(booking.event.start_time)}
                          {booking.event.end_time && ` - ${formatTime(booking.event.end_time)}`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {booking.proposed_rate && (
                    <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <DollarSign className="h-4 w-4" />
                      <span>${booking.proposed_rate}</span>
                    </div>
                  )}
                  
                  {booking.musician_pitch && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {booking.musician_pitch}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Applied {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sortedBookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No bookings yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start applying to events to see your bookings here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {view === 'calendar' ? renderCalendar() : renderList()}
    </div>
  );
}; 