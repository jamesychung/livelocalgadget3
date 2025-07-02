import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
import { api } from "../../api";

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
          event: { id: { equals: eventId } }
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
            id: true,
            firstName: true,
            lastName: true,
            email: true
          },
          booking: {
            id: true,
            musician: {
              id: true,
              stageName: true
            }
          }
        },
        sort: { createdAt: "Descending" }
      });

      // Map GadgetRecordList to EventHistoryEntry[]
      const mappedHistory = history.map((entry: any) => ({
        ...entry,
        createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : String(entry.createdAt)
      }));

      setHistoryData(mappedHistory);
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
      case 'event_genres':
        return 'Genres';
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

  const formatValue = (value: string, field: string) => {
    if (!value || value === 'none' || value === 'null') return '—';
    
    // Handle genres field specifically
    if (field === 'genres') {
      try {
        // Try to parse as JSON array
        const genresArray = JSON.parse(value);
        if (Array.isArray(genresArray)) {
          return genresArray.length > 0 ? genresArray.join(', ') : 'None';
        }
      } catch {
        // If not valid JSON, try to parse as string array
        if (value.startsWith('[') && value.endsWith(']')) {
          const cleanValue = value.slice(1, -1).replace(/"/g, '');
          const genres = cleanValue.split(',').map(g => g.trim()).filter(g => g);
          return genres.length > 0 ? genres.join(', ') : 'None';
        }
      }
      // Fallback to original value
      return value;
    }
    
    // Handle date fields
    if (field.includes('date') || field.includes('Date')) {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return value;
      }
    }
    
    // Handle time fields
    if (field.includes('time') || field.includes('Time')) {
      return value;
    }
    
    // Handle price fields
    if (field.includes('price') || field.includes('Price')) {
      const num = parseFloat(value);
      return isNaN(num) ? value : `$${num.toFixed(2)}`;
    }
    
    // Handle capacity fields
    if (field.includes('capacity') || field.includes('Capacity')) {
      const num = parseInt(value);
      return isNaN(num) ? value : num.toString();
    }
    
    // Default: truncate long strings
    if (value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    
    return value;
  };

  const filteredHistory = historyData.filter(entry => {
    const matchesTab = activeTab === "all" || entry.changeType.includes(activeTab);
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.changeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.booking?.musician?.stageName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

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
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No history entries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Date & Time</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Change Type</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Previous Value</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">New Value</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-700">Changed By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((entry) => {
                    const field = entry.changeType.replace('event_', '');
                    return (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              {getChangeTypeIcon(entry.changeType)}
                            </div>
                            <span className="font-medium">{getChangeTypeLabel(entry.changeType)}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          <div className="max-w-xs">
                            {entry.changeType.includes('status') ? (
                              getStatusBadge(entry.previousValue)
                            ) : (
                              <span className="text-gray-600">
                                {formatValue(entry.previousValue, field)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          <div className="max-w-xs">
                            {entry.changeType.includes('status') ? (
                              getStatusBadge(entry.newValue)
                            ) : (
                              <span className="text-gray-600">
                                {formatValue(entry.newValue, field)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-sm">
                          {entry.changedBy ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">
                                {entry.changedBy.firstName} {entry.changedBy.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">System</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 
