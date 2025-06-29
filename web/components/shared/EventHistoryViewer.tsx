import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  User, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Edit,
  Filter,
  Search
} from "lucide-react";
import { api } from "@/api";

export interface EventHistoryEntry {
  id: string;
  createdAt: string;
  changeType: string;
  previousValue: string;
  newValue: string;
  description: string;
  context: any;
  metadata: any;
  changedBy?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  booking?: {
    id: string;
    musician?: {
      stageName: string;
    };
  };
}

export interface EventHistoryViewerProps {
  eventId: string;
  className?: string;
}

export const EventHistoryViewer: React.FC<EventHistoryViewerProps> = ({ 
  eventId, 
  className = "" 
}) => {
  const [historyData, setHistoryData] = useState<EventHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEventHistory();
  }, [eventId]);

  const fetchEventHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const history = await api.eventHistory.findMany({
        filter: {
          event: { equals: eventId }
        },
        select: {
          id: true,
          createdAt: true,
          changeType: true,
          previousValue: true,
          newValue: true,
          description: true,
          context: true,
          metadata: true,
          changedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          booking: {
            select: {
              id: true,
              musician: {
                select: {
                  stageName: true
                }
              }
            }
          }
        },
        sort: { createdAt: "Descending" }
      });

      setHistoryData(history);
    } catch (err) {
      console.error("Error fetching event history:", err);
      setError("Failed to load event history");
    } finally {
      setLoading(false);
    }
  };

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'booking_status':
        return <CheckCircle className="h-4 w-4" />;
      case 'event_status':
        return <Calendar className="h-4 w-4" />;
      case 'event_created':
        return <Edit className="h-4 w-4" />;
      case 'booking_created':
        return <User className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };

  const getChangeTypeLabel = (changeType: string) => {
    switch (changeType) {
      case 'booking_status':
        return 'Booking Status';
      case 'event_status':
        return 'Event Status';
      case 'event_created':
        return 'Event Created';
      case 'booking_created':
        return 'Booking Created';
      case 'event_title':
        return 'Event Title';
      case 'event_description':
        return 'Event Description';
      case 'event_date':
        return 'Event Date';
      case 'event_ticketPrice':
        return 'Ticket Price';
      default:
        return changeType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      applied: "bg-blue-100 text-blue-800 border-blue-200",
      communicating: "bg-purple-100 text-purple-800 border-purple-200",
      confirmed: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      invited: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pending: "bg-orange-100 text-orange-800 border-orange-200",
      open: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    };

    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {status}
      </Badge>
    );
  };

  const filteredHistory = historyData.filter(entry => {
    const matchesTab = activeTab === "all" || entry.changeType.includes(activeTab);
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.changeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.booking?.musician?.stageName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const groupedHistory = filteredHistory.reduce((groups, entry) => {
    const date = new Date(entry.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, EventHistoryEntry[]>);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Event History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading event history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Event History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={fetchEventHistory} 
              variant="outline" 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Event History ({historyData.length} entries)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete timeline of all changes and actions for this event
        </p>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </Button>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="booking">Bookings</TabsTrigger>
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="created">Created</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* History Timeline */}
        <div className="space-y-6">
          {Object.keys(groupedHistory).length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No history entries found</p>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([date, entries]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {entries.map((entry) => (
                  <div key={entry.id} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {getChangeTypeIcon(entry.changeType)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {getChangeTypeLabel(entry.changeType)}
                        </span>
                        {entry.changeType.includes('status') && (
                          <div className="flex items-center gap-1">
                            {entry.previousValue !== 'none' && getStatusBadge(entry.previousValue)}
                            <span className="text-muted-foreground">→</span>
                            {entry.newValue !== 'none' && getStatusBadge(entry.newValue)}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {entry.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.createdAt).toLocaleTimeString()}
                        </span>
                        
                        {entry.changedBy && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {entry.changedBy.firstName} {entry.changedBy.lastName}
                          </span>
                        )}
                        
                        {entry.booking?.musician && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {entry.booking.musician.stageName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 