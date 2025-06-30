import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Users, Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react";

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
  handleCommunicateBooking
}) => {
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
    total: bookingsData.length
  };

  const hasConfirmedBooking = stats.confirmed > 0;

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
        <div className="grid grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                    onClick={() => handleRowClick(booking)}
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
                      <div className="text-sm font-medium">{booking.musician.genre || 'N/A'}</div>
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
                      <div className="flex items-center gap-2">
                        {booking.status === "applied" && (
                          <>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookMusician(booking.id);
                              }}
                              disabled={hasConfirmedBooking}
                              className={`h-8 px-3 text-xs ${
                                hasConfirmedBooking 
                                  ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500" 
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                              title={hasConfirmedBooking ? "Another musician is already confirmed for this event" : "Confirm this musician"}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCommunicateBooking(booking.id);
                              }}
                              className="h-8 px-3 text-xs"
                              title="Start communicating with this musician"
                            >
                              <MessageCircle className="mr-1 h-3 w-3" />
                              Message
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectBooking(booking.id);
                              }}
                              className="h-8 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              title="Reject this application"
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        )}
                        {booking.status === "rejected" && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              disabled={true}
                              className="h-8 px-3 text-xs opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                              title="Cannot confirm a rejected booking"
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Confirm
                            </Button>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Rejected
                            </Badge>
                          </div>
                        )}
                        {booking.status === "confirmed" && (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Confirmed
                            </Badge>
                            <Button
                              size="sm"
                              disabled={true}
                              className="h-8 px-3 text-xs opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                              title="Cannot reject a confirmed booking"
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {booking.status === "invited" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Resending invitation for booking:", booking.id);
                            }}
                            className="h-8 px-3 text-xs"
                            title="Resend invitation to this musician"
                          >
                            <Users className="mr-1 h-3 w-3" />
                            Resend Invite
                          </Button>
                        )}
                        {booking.status === "communicating" && (
                          <>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookMusician(booking.id);
                              }}
                              disabled={hasConfirmedBooking}
                              className={`h-8 px-3 text-xs ${
                                hasConfirmedBooking 
                                  ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500" 
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                              title={hasConfirmedBooking ? "Another musician is already confirmed for this event" : "Confirm this musician"}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectBooking(booking.id);
                              }}
                              className="h-8 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              title="Reject this application"
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        )}
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
      </CardContent>
    </Card>
  );
};
