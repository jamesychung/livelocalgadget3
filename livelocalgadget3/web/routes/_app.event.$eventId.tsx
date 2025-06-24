import React, { useState } from "react";
import { useParams, Link, useOutletContext, useNavigate } from "react-router";
import { useFindOne, useAction } from "@gadgetinc/react";
import { api } from "../api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, User, DollarSign, FileText, MessageSquare, Check, X, AlertTriangle, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import type { AuthOutletContext } from "./_app";

export default function InternalEventPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [updateEvent, { fetching: updatingEvent }] = useAction(api.event.update);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [actionType, setActionType] = useState<'confirmed' | 'cancel' | null>(null);

    console.log("InternalEventPage - eventId from useParams:", eventId);

    const [{ data: event, fetching, error }] = useFindOne(api.event, eventId!, {
        select: {
            id: true,
            title: true,
            description: true,
            date: true,
            startTime: true,
            endTime: true,
            status: true,
            ticketPrice: true,
            totalCapacity: true,
            availableTickets: true,
            musician: {
                id: true,
                name: true,
                stageName: true,
                email: true,
                phone: true,
            },
            venue: {
                id: true,
                name: true,
                address: true,
            }
        }
    });

    if (!eventId) {
        return <div className="p-4 text-red-500">No event ID provided.</div>;
    }

    if (fetching) {
        return <div className="p-4">Loading...</div>;
    }

    if (error || !event) {
        console.error("InternalEventPage - Error fetching event:", error);
        return (
            <div className="p-4 text-red-500">
                <h2 className="text-lg font-bold">Error loading event details.</h2>
                <p>Event ID: {eventId}</p>
                {error && <pre className="mt-2 bg-gray-100 p-2 rounded">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    const handleAction = async () => {
        if (!actionType) return;

        await updateEvent({
            id: (event as any).id,
            status: actionType,
        });
        setShowConfirmDialog(false);
        setActionType(null);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode, label: string }> = {
            proposed: { variant: "secondary", icon: <AlertTriangle className="mr-2 h-4 w-4" />, label: "Proposed" },
            confirmed: { variant: "default", icon: <Check className="mr-2 h-4 w-4" />, label: "Confirmed" },
            cancelled: { variant: "destructive", icon: <X className="mr-2 h-4 w-4" />, label: "Cancelled" },
        };
        const config = statusMap[status.toLowerCase()] || { variant: "outline", icon: null, label: status };
        return (
            <Badge variant={config.variant} className="text-base">
                {config.icon}
                {config.label}
            </Badge>
        );
    };
    
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">{(event as any).title}</h1>
                    {getStatusBadge((event as any).status)}
                </div>
                <div className="flex gap-2">
                    {(event as any).status === 'proposed' && (
                        <>
                            <Button 
                                variant="destructive" 
                                onClick={() => { setActionType('cancel'); setShowConfirmDialog(true); }}
                                disabled={updatingEvent}
                            >
                                <X className="mr-2 h-4 w-4" /> Cancel Event
                            </Button>
                            <Button 
                                onClick={() => { setActionType('confirmed'); setShowConfirmDialog(true); }}
                                disabled={updatingEvent}
                            >
                                <Check className="mr-2 h-4 w-4" /> Confirm Event
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> {format(new Date((event as any).date), 'EEEE, MMMM d, yyyy')}</div>
                            <div className="flex items-center"><Clock className="mr-2 h-4 w-4" /> {(event as any).startTime} - {(event as any).endTime}</div>
                            <div className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {(event as any).venue ? `${(event as any).venue.name} - ${(event as any).venue.address}` : 'Venue not specified'}</div>
                            <p>{(event as any).description}</p>
                        </CardContent>
                    </Card>
                    {/*<Card>
                        <CardHeader><CardTitle>Terms & Notes</CardTitle></CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{(event as any).notes || "No additional terms or notes provided."}</p>
                        </CardContent>
                    </Card>*/}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Musician</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <h3 className="font-semibold">{(event as any).musician?.stageName || (event as any).musician?.name || "Musician not assigned"}</h3>
                            <div className="flex items-center text-sm text-muted-foreground"><MessageSquare className="mr-2 h-4 w-4" /> {(event as any).musician?.email || "No email provided"}</div>
                            <div className="flex items-center text-sm text-muted-foreground"><User className="mr-2 h-4 w-4" /> {(event as any).musician?.phone || "No phone number"}</div>
                            { (event as any).musician ? (
                                <Button variant="secondary" asChild className="w-full mt-2">
                                    <Link to={`/musician/${(event as any).musician.id}`}>View Profile</Link>
                                </Button>
                            ) : (
                                <Button variant="secondary" className="w-full mt-2" disabled>
                                    View Profile
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Financials</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-center"><DollarSign className="mr-2 h-4 w-4" /> Ticket Price: ${(event as any).ticketPrice}</div>
                            <div className="flex items-center"><User className="mr-2 h-4 w-4" /> Capacity: {(event as any).totalCapacity}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" /> Message Musician
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/event/${eventId}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" /> Modify Event
                        </Button>
                        <Button variant="destructive" onClick={() => { setActionType('cancel'); setShowConfirmDialog(true); }}>
                            <X className="mr-2 h-4 w-4" /> Cancel Event
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            You are about to {actionType} this event. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                        <Button 
                            variant={actionType === 'cancel' ? 'destructive' : 'default'}
                            onClick={handleAction}
                            disabled={updatingEvent}
                        >
                            {updatingEvent ? 'Processing...' : `Yes, ${actionType} event`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 