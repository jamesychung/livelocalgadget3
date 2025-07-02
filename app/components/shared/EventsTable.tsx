import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Music } from "lucide-react";
import { Event } from "../../hooks/useMusicianEvents";

type SortField = 'date' | 'venue' | 'rate' | 'musicianStatus';

interface EventsTableProps {
    events: Event[];
    sortField: SortField;
    sortDirection: 'asc' | 'desc';
    onSort: (field: SortField) => void;
    onRowClick: (event: Event) => void;
    getMusicianApplicationStatus: (eventId: string) => string;
    searchTerm: string;
    statusFilter: string;
}

export function EventsTable({ 
    events, 
    sortField, 
    sortDirection, 
    onSort, 
    onRowClick, 
    getMusicianApplicationStatus,
    searchTerm,
    statusFilter
}: EventsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Available Events</CardTitle>
            </CardHeader>
            <CardContent>
                {events.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer hover:bg-gray-50">
                                        Event Title
                                    </TableHead>
                                    <TableHead 
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => onSort('date')}
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
                                        onClick={() => onSort('venue')}
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
                                        onClick={() => onSort('rate')}
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
                                        onClick={() => onSort('musicianStatus')}
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
                                            onClick={() => onRowClick(event)}
                                        >
                                            <TableCell>
                                                <div className="font-semibold">{event.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">
                                                        {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                                                    </div>
                                                    {event.startTime && (
                                                        <div className="text-sm text-muted-foreground">
                                                            Start: {event.startTime}
                                                        </div>
                                                    )}
                                                    {event.endTime && (
                                                        <div className="text-sm text-muted-foreground">
                                                            End: {event.endTime}
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
                                                    variant={event.eventStatus === 'open' ? 'default' : 'secondary'}
                                                    className={
                                                        event.eventStatus === 'open' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }
                                                >
                                                    {event.eventStatus?.charAt(0).toUpperCase() + event.eventStatus?.slice(1) || 'Unknown'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const status = getMusicianApplicationStatus(event.id);
                                                    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
                                                    let className = "bg-gray-100 text-gray-800";
                                                    
                                                    switch (status) {
                                                        case "available":
                                                            badgeVariant = "default";
                                                            className = "bg-green-100 text-green-800";
                                                            break;
                                                        case "applied":
                                                            badgeVariant = "default";
                                                            className = "bg-blue-100 text-blue-800";
                                                            break;
                                                        case "confirmed":
                                                            badgeVariant = "default";
                                                            className = "bg-green-100 text-green-800";
                                                            break;
                                                        case "rejected":
                                                            badgeVariant = "destructive";
                                                            className = "bg-red-100 text-red-800";
                                                            break;
                                                        case "cancelled":
                                                            badgeVariant = "secondary";
                                                            className = "bg-gray-100 text-gray-800";
                                                            break;
                                                        default:
                                                            badgeVariant = "secondary";
                                                            className = "bg-gray-100 text-gray-800";
                                                    }
                                                    
                                                    return (
                                                        <Badge 
                                                            variant={badgeVariant}
                                                            className={className}
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </Badge>
                                                    );
                                                })()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No events found</h3>
                        <p className="text-muted-foreground">
                            {searchTerm || statusFilter !== "all" 
                                ? "Try adjusting your search or filter criteria."
                                : "There are currently no events available. Check back later!"
                            }
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 
