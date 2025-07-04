import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Music, Eye } from "lucide-react";
import { EventsTableProps } from './types';

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  sortField,
  sortDirection,
  handleSort,
  handleRowClick,
  handleViewBookingDetails,
  user,
  getMusicianApplicationStatus,
  getStatusDisplay
}) => {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date & Time
                    {sortField === 'date' && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('venue')}
                >
                  <div className="flex items-center gap-2">
                    Venue & Location
                    {sortField === 'venue' && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('rate')}
                >
                  <div className="flex items-center gap-2">
                    Rate
                    {sortField === 'rate' && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead>Event Status</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('musicianStatus')}
                >
                  <div className="flex items-center gap-2">
                    Musician Status
                    {sortField === 'musicianStatus' && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => {
                const isUpcoming = event.date && new Date(event.date) > new Date();
                
                return (
                  <TableRow 
                    key={event.id} 
                    className={`cursor-pointer hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    onClick={() => handleRowClick(event)}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                        </div>
                        {event.start_time && (
                          <div className="text-sm text-muted-foreground">
                            Start: {event.start_time}
                          </div>
                        )}
                        {event.end_time && (
                          <div className="text-sm text-muted-foreground">
                            End: {event.end_time}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{event.venue?.name}</div>
                        {event.venue?.city && event.venue?.state && (
                          <div className="text-sm text-muted-foreground">
                            {event.venue.city}, {event.venue.state}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.rate ? (
                        <div className="font-medium text-green-600">
                          ${event.rate}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">TBD</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={event.event_status === 'open' ? 'default' : 'secondary' as const}
                        className={
                          event.event_status === 'open' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {event.event_status?.charAt(0).toUpperCase() + event.event_status?.slice(1) || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const { status, booking } = getMusicianApplicationStatus(event.id);
                        const statusInfo = getStatusDisplay(status, booking);
                        return (
                          <div className="space-y-2">
                            <Badge 
                              variant={statusInfo.variant}
                              className={statusInfo.className}
                            >
                              {statusInfo.label}
                            </Badge>
                            
                            {booking && (
                              <div className="flex justify-start">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-xs px-2 py-1 h-auto"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent event row click
                                    handleViewBookingDetails(booking);
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Activity Log
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}; 