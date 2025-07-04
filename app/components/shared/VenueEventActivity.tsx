import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronUp, ChevronDown, Users, Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { BookingActionButtons } from "./BookingActionButtons";
import { BookingDetailDialog } from "./BookingDetailDialog";
import { supabase } from "../../lib/supabase";

interface VenueEventActivityProps {
  bookingsData: any[];
  bookingsLoading: boolean;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  setSortColumn: (column: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  handleRowClick: (booking: any) => void;
  handleBookMusician: (bookingId: string) => void;
  handleRejectBooking: (bookingId: string) => void;
  handleCommunicateBooking: (bookingId: string) => void;
  eventGenres?: string[];
}

export const VenueEventActivity: React.FC<VenueEventActivityProps> = ({
  bookingsData,
  bookingsLoading,
  sortColumn,
  sortDirection,
  setSortColumn,
  setSortDirection,
  handleRowClick,
  handleBookMusician,
  handleRejectBooking,
  handleCommunicateBooking,
  eventGenres
}) => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Confirmed
        </Badge>;
      case "communicating":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          Communicating
        </Badge>;
      case "applied":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Applied
        </Badge>;
      case "invited":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Users className="h-3 w-3" />
          Invited
        </Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const getSortValue = (booking: any, column: string) => {
    switch (column) {
      case 'musician':
        return booking.musician?.stageName || '';
      case 'genre':
        return booking.musician?.genre || '';
      case 'location':
        return `${booking.musician?.city || ''} ${booking.musician?.state || ''}`;
      case 'rate':
        return booking.proposedRate || 0;
      case 'status':
        return booking.status || '';
      case 'date':
        return new Date(booking.createdAt).getTime();
      default:
        return '';
    }
  };

  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedBookings = [...bookingsData].sort((a, b) => {
    const aValue = getSortValue(a, sortColumn);
    const bValue = getSortValue(b, sortColumn);
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate summary statistics
  const stats = {
    applied: bookingsData.filter(b => b.status === "applied").length,
    invited: bookingsData.filter(b => b.status === "invited").length,
    communicating: bookingsData.filter(b => b.status === "communicating").length,
    confirmed: bookingsData.filter(b => b.status === "confirmed").length,
    rejected: bookingsData.filter(b => b.status === "rejected").length,
    total: bookingsData.length,
    genreMatches: eventGenres && eventGenres.length > 0 
      ? bookingsData.filter(b => eventGenres.includes(b.musician.genre)).length 
      : 0
  };

  const hasConfirmedBooking = stats.confirmed > 0;

  // Function to check if musician genre matches event genres
  const getGenreMatch = (musicianGenre: string) => {
    if (!eventGenres || eventGenres.length === 0) return null;
    return eventGenres.includes(musicianGenre);
  };

  const getGenreDisplay = (musicianGenre: string) => {
    const isMatch = getGenreMatch(musicianGenre);
    return (
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${isMatch ? 'text-green-600' : ''}`}>
          {musicianGenre || 'N/A'}
        </span>
        {isMatch && (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
            Match
          </Badge>
        )}
      </div>
    );
  };

  // Handle booking row click to open detail dialog
  const onBookingClick = (booking: any) => {
    // Ensure we have all the necessary data for the activity log
    const fetchCompleteBookingData = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            event:events (
              id,
              title,
              date,
              start_time,
              end_time,
              description,
              created_at
            ),
            musician:musicians (
              id,
              stage_name,
              genre,
              city,
              state,
              phone,
              email,
              hourly_rate,
              profile_picture
            )
          `)
          .eq('id', booking.id)
          .single();
          
        if (error) {
          console.error('Error fetching complete booking data:', error);
          setSelectedBooking(booking);
        } else {
          console.log('Complete booking data for activity log:', data);
          // Make sure we have all the necessary data for the activity log
          const bookingWithEventData = {
            ...data,
            date: data.event?.date,
            start_time: data.event?.start_time,
            end_time: data.event?.end_time,
            venue: booking.venue
          };
          setSelectedBooking(bookingWithEventData);
        }
        setIsDialogOpen(true);
      } catch (err) {
        console.error('Error:', err);
        setSelectedBooking(booking);
        setIsDialogOpen(true);
      }
    };
    
    fetchCompleteBookingData();
  };

  // Handle booking status update
  const handleBookingStatusUpdate = (updatedBooking: any) => {
    // Close the dialog and refresh the data
    setIsDialogOpen(false);
    window.location.reload();
  };

  if (bookingsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track all musician applications and activity for this event
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading event activity...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track all musician applications and activity for this event
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary Statistics */}
        <div className="grid grid-cols-7 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.invited}</div>
            <div className="text-sm text-muted-foreground">Invited</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.communicating}</div>
            <div className="text-sm text-muted-foreground">Communicating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.genreMatches}</div>
            <div className="text-sm text-muted-foreground">Genre Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>

        {sortedBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('musician')}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      Musician
                      {renderSortIndicator('musician')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('genre')}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      Genre
                      {renderSortIndicator('genre')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      Location
                      {renderSortIndicator('location')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('rate')}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      Rate
                      {renderSortIndicator('rate')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      Status
                      {renderSortIndicator('status')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      Applied
                      {renderSortIndicator('date')}
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onBookingClick(booking)}
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          {booking.musician.profilePicture ? (
                            <img 
                              src={booking.musician.profilePicture} 
                              alt={booking.musician.stageName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {booking.musician.stageName?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{booking.musician.stageName}</div>
                          <div className="text-sm text-muted-foreground">
                            ${booking.proposedRate}/hour
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      {getGenreDisplay(booking.musician.genre)}
                    </td>
                    <td className="py-4 px-3">
                      <div className="text-sm">
                        {booking.musician.city && booking.musician.state 
                          ? `${booking.musician.city}, ${booking.musician.state}`
                          : 'N/A'
                        }
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-semibold text-green-600">${booking.proposedRate}</div>
                      <div className="text-xs text-muted-foreground">
                        Proposed Rate
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-4 px-3">
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(booking.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                        <div onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full flex items-center justify-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                onBookingClick(booking);
                              }}
                            >
                              <Clock className="h-3 w-3" />
                              View Activity Log
                            </Button>
                            <BookingActionButtons
                              booking={booking}
                              currentUser={{venue: { id: booking.venue_id }}}
                              onStatusUpdate={(updatedBooking) => {
                                // Refresh the bookings data
                                window.location.reload();
                              }}
                              className="justify-start"
                            />
                          </div>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground">
              Musicians will appear here once they apply to your event.
            </p>
          </div>
        )}
        
        {/* Booking Detail Dialog with Activity Log */}
        <BookingDetailDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          booking={selectedBooking}
          currentUser={{venue: { id: selectedBooking?.venue_id }}}
          onStatusUpdate={handleBookingStatusUpdate}
        />
      </CardContent>
    </Card>
  );
};
