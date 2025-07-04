import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { CheckCircle, XCircle, User, Calendar, MapPin, DollarSign, Users } from "lucide-react";

interface ApplicationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: any;
  getEventApplications: (eventId: string) => any[];
  onAcceptApplication: (bookingId: string) => void;
  onRejectApplication: (bookingId: string) => void;
}

export const ApplicationDetailDialog: React.FC<ApplicationDetailDialogProps> = ({
  open,
  onOpenChange,
  selectedEvent,
  getEventApplications,
  onAcceptApplication,
  onRejectApplication,
}) => {
  if (!selectedEvent) return null;

  const applications = getEventApplications(selectedEvent.id);
  const pendingApplications = applications.filter((app: any) => app.bookingStatus === 'pending');
  const acceptedApplications = applications.filter((app: any) => app.bookingStatus === 'selected');
  const rejectedApplications = applications.filter((app: any) => app.bookingStatus === 'rejected');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'selected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applications for {selectedEvent.title}</DialogTitle>
          <DialogDescription>
            Review and manage musician applications for this event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}</span>
                </div>
                {selectedEvent.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.venue.name}</span>
                  </div>
                )}
                {selectedEvent.ticketPrice && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${selectedEvent.ticketPrice}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Pending Applications</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {pendingApplications.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApplications.map((application: any) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <User className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">
                              {application.musician?.stageName || 'Unknown Musician'}
                            </h4>
                            {application.musician?.city && application.musician?.state && (
                              <p className="text-sm text-muted-foreground">
                                {application.musician.city}, {application.musician.state}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(application.bookingStatus)}
                      </div>
                      
                      {application.message && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Message:</p>
                          <p className="text-sm bg-muted p-2 rounded">{application.message}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => onAcceptApplication(application.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRejectApplication(application.id)}
                          className="flex items-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accepted Applications */}
          {acceptedApplications.length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Accepted Applications</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {acceptedApplications.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {acceptedApplications.map((application: any) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <User className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">
                              {application.musician?.stageName || 'Unknown Musician'}
                            </h4>
                            {application.musician?.city && application.musician?.state && (
                              <p className="text-sm text-muted-foreground">
                                {application.musician.city}, {application.musician.state}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(application.bookingStatus)}
                      </div>
                      
                      {application.message && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Message:</p>
                          <p className="text-sm bg-muted p-2 rounded">{application.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rejected Applications */}
          {rejectedApplications.length > 0 && (
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Rejected Applications</span>
                  <Badge variant="destructive">
                    {rejectedApplications.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rejectedApplications.map((application: any) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <User className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">
                              {application.musician?.stageName || 'Unknown Musician'}
                            </h4>
                            {application.musician?.city && application.musician?.state && (
                              <p className="text-sm text-muted-foreground">
                                {application.musician.city}, {application.musician.state}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(application.bookingStatus)}
                      </div>
                      
                      {application.message && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Message:</p>
                          <p className="text-sm bg-muted p-2 rounded">{application.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Applications */}
          {applications.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">
                  Musicians will be able to apply for this event once it's published.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 