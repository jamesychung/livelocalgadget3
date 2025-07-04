import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ActivityLog, generateApplicationsActivityItems, generateEventActivityItems } from "./ActivityLog";
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Phone, 
  Mail, 
  Music, 
  Star, 
  Clock, 
  Award,
  Eye,
  MessageSquare
} from "lucide-react";

interface ApplicationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: any;
  getEventApplications: (eventId: string) => any[];
  onAcceptApplication: (bookingId: string) => void;
  onRejectApplication: (bookingId: string) => void;
}

interface MusicianProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  musician: any;
  application: any;
  onSelect: () => void;
  onReject: () => void;
}

const MusicianProfileDialog: React.FC<MusicianProfileDialogProps> = ({
  open,
  onOpenChange,
  musician,
  application,
  onSelect,
  onReject
}) => {
  if (!musician) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatGenres = (genres: string[] | string) => {
    if (Array.isArray(genres)) {
      return genres.join(', ');
    }
    return genres || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              {musician.profile_picture ? (
                <img 
                  src={musician.profile_picture} 
                  alt={musician.stage_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Music className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{musician.stage_name}</h2>
              <p className="text-sm text-muted-foreground">
                {musician.city && musician.state && `${musician.city}, ${musician.state}`}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Details */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg">Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Proposed Rate:</span>
                  <span className="font-semibold">
                    {formatCurrency(application?.proposed_rate || musician.hourly_rate || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Applied:</span>
                  <span className="text-sm">
                    {application?.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
              
              {application?.musician_pitch && (
                <div>
                  <p className="text-sm font-medium mb-2">Musician's Message:</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {application.musician_pitch}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Musician Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Genres:</span>
                  <span className="text-sm font-medium">
                    {formatGenres(musician.genres || musician.genre)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Experience:</span>
                  <span className="text-sm font-medium">
                    {musician.years_experience ? `${musician.years_experience} years` : 'Not specified'}
                  </span>
                </div>
                
                {musician.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Rating:</span>
                    <span className="text-sm font-medium">
                      {musician.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
                
                {musician.total_gigs && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Gigs:</span>
                    <span className="text-sm font-medium">{musician.total_gigs}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Email:</span>
                  <span className="text-sm font-medium">{musician.email}</span>
                </div>
                
                {musician.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Phone:</span>
                    <span className="text-sm font-medium">{musician.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Hourly Rate:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(musician.hourly_rate || 0)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Location:</span>
                  <span className="text-sm font-medium">
                    {musician.city && musician.state ? `${musician.city}, ${musician.state}` : 'Not specified'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bio */}
          {musician.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{musician.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Instruments */}
          {musician.instruments && Array.isArray(musician.instruments) && musician.instruments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instruments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {musician.instruments.map((instrument: string, index: number) => (
                    <Badge key={index} variant="secondary">{instrument}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onSelect} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Select Musician
            </Button>
            <Button variant="outline" onClick={onReject} className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ApplicationDetailDialog: React.FC<ApplicationDetailDialogProps> = ({
  open,
  onOpenChange,
  selectedEvent,
  getEventApplications,
  onAcceptApplication,
  onRejectApplication,
}) => {
  const [selectedMusicianProfile, setSelectedMusicianProfile] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isMusicianProfileOpen, setIsMusicianProfileOpen] = useState(false);

  if (!selectedEvent) return null;

  const applications = getEventApplications(selectedEvent.id);
  
  // Map booking status to application status
  const pendingApplications = applications.filter((app: any) => app.status === 'applied');
  const selectedApplications = applications.filter((app: any) => app.status === 'selected');
  const rejectedApplications = applications.filter((app: any) => app.status === 'rejected');

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'selected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Selected</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMusicianClick = (musician: any, application: any) => {
    setSelectedMusicianProfile(musician);
    setSelectedApplication(application);
    setIsMusicianProfileOpen(true);
  };

  const handleSelectFromProfile = () => {
    if (selectedApplication) {
      onAcceptApplication(selectedApplication.id);
      setIsMusicianProfileOpen(false);
    }
  };

  const handleRejectFromProfile = () => {
    if (selectedApplication) {
      onRejectApplication(selectedApplication.id);
      setIsMusicianProfileOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applications for {selectedEvent.title}</DialogTitle>
            <DialogDescription>
              Review and manage musician applications for this event
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Tabs defaultValue="applications">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>
              
              <TabsContent value="applications" className="space-y-6 pt-4">
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
                        <span>{formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}</span>
                      </div>
                      {selectedEvent.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEvent.venue.name}</span>
                        </div>
                      )}
                      {selectedEvent.ticket_price && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{formatCurrency(selectedEvent.ticket_price)}</span>
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
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                  {application.musician?.profile_picture ? (
                                    <img 
                                      src={application.musician.profile_picture} 
                                      alt={application.musician.stage_name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <Music className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <button
                                    onClick={() => handleMusicianClick(application.musician, application)}
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {application.musician?.stage_name || 'Unknown Musician'}
                                  </button>
                                  {application.musician?.city && application.musician?.state && (
                                    <p className="text-sm text-muted-foreground">
                                      {application.musician.city}, {application.musician.state}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-muted-foreground">
                                      Rate: {formatCurrency(application.proposed_rate || application.musician?.hourly_rate || 0)}
                                    </span>
                                    {application.musician?.rating && (
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-500" />
                                        <span>{application.musician.rating.toFixed(1)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {getStatusBadge(application.status)}
                            </div>
                            
                            {application.musician_pitch && (
                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground mb-1">Message:</p>
                                <p className="text-sm bg-muted p-2 rounded">{application.musician_pitch}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => onAcceptApplication(application.id)}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Select
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMusicianClick(application.musician, application)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View Profile
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Selected Applications */}
                {selectedApplications.length > 0 && (
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>Selected Applications</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {selectedApplications.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedApplications.map((application: any) => (
                          <div key={application.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                  {application.musician?.profile_picture ? (
                                    <img 
                                      src={application.musician.profile_picture} 
                                      alt={application.musician.stage_name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <Music className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <button
                                    onClick={() => handleMusicianClick(application.musician, application)}
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {application.musician?.stage_name || 'Unknown Musician'}
                                  </button>
                                  {application.musician?.city && application.musician?.state && (
                                    <p className="text-sm text-muted-foreground">
                                      {application.musician.city}, {application.musician.state}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-muted-foreground">
                                      Rate: {formatCurrency(application.proposed_rate || application.musician?.hourly_rate || 0)}
                                    </span>
                                    {application.musician?.rating && (
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-500" />
                                        <span>{application.musician.rating.toFixed(1)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {getStatusBadge(application.status)}
                            </div>
                            
                            {application.musician_pitch && (
                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground mb-1">Message:</p>
                                <p className="text-sm bg-muted p-2 rounded">{application.musician_pitch}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMusicianClick(application.musician, application)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View Profile
                              </Button>
                            </div>
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
                          <div key={application.id} className="border rounded-lg p-4 opacity-60">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                  {application.musician?.profile_picture ? (
                                    <img 
                                      src={application.musician.profile_picture} 
                                      alt={application.musician.stage_name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <Music className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    {application.musician?.stage_name || 'Unknown Musician'}
                                  </h4>
                                  {application.musician?.city && application.musician?.state && (
                                    <p className="text-sm text-muted-foreground">
                                      {application.musician.city}, {application.musician.state}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {getStatusBadge(application.status)}
                            </div>
                            
                            {application.musician_pitch && (
                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground mb-1">Message:</p>
                                <p className="text-sm bg-muted p-2 rounded">{application.musician_pitch}</p>
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
              </TabsContent>
              
              <TabsContent value="activity" className="pt-4">
                {(() => {
                  console.log('🔍 ApplicationDetailDialog Debug:');
                  console.log('selectedEvent:', selectedEvent);
                  console.log('selectedEvent.created_at:', selectedEvent?.created_at);
                  console.log('applications:', applications);
                  console.log('applications with event data:', applications.map(app => ({
                    id: app.id,
                    applied_at: app.applied_at,
                    selected_at: app.selected_at,
                    confirmed_at: app.confirmed_at,
                    musician: app.musician?.stage_name,
                    event: app.event,
                    event_created_at: app.event?.created_at
                  })));
                  
                  const activityItems = generateEventActivityItems(selectedEvent, applications);
                  console.log('Generated activity items:', activityItems);
                  
                  return (
                    <ActivityLog
                      activities={activityItems}
                    />
                  );
                })()}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Musician Profile Dialog */}
      <MusicianProfileDialog
        open={isMusicianProfileOpen}
        onOpenChange={setIsMusicianProfileOpen}
        musician={selectedMusicianProfile}
        application={selectedApplication}
        onSelect={handleSelectFromProfile}
        onReject={handleRejectFromProfile}
      />
    </>
  );
}; 