import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, MapPin, DollarSign, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MusicianBookingCardProps {
    booking: any;
    onStatusUpdate: (updatedBooking: any) => void;
}

export const MusicianBookingCard: React.FC<MusicianBookingCardProps> = ({
    booking,
    onStatusUpdate
}) => {
    const handleConfirmBooking = async () => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ confirmed_at: new Date().toISOString() })
                .eq('id', booking.id);

            if (error) throw error;

            onStatusUpdate({ ...booking, status: 'confirmed' });
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    };

    const handleRejectBooking = async () => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ cancelled_at: new Date().toISOString() })
                .eq('id', booking.id);

            if (error) throw error;

            onStatusUpdate({ ...booking, status: 'cancelled' });
        } catch (error) {
            console.error('Error rejecting booking:', error);
        }
    };

    const getStatusBadge = () => {
        switch (booking.status) {
            case 'applied':
                return <Badge variant="default">📝 Applied</Badge>;
            case 'selected':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⭐ Venue Selected You</Badge>;
            case 'confirmed':
                return <Badge variant="default" className="bg-green-100 text-green-800">✅ Confirmed</Badge>;
            default:
                return <Badge variant="secondary">{booking.status}</Badge>;
        }
    };

    return (
        <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="font-semibold text-lg">
                                {booking.event?.title}
                            </div>
                            {getStatusBadge()}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {new Date(booking.event?.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {booking.event?.venue?.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    ${booking.proposedRate || booking.musician?.hourly_rate}/hr
                                </span>
                            </div>
                        </div>
                        
                        {booking.musicianPitch && (
                            <div className="mb-4">
                                <div className="text-sm font-medium text-muted-foreground mb-2">
                                    Your Pitch
                                </div>
                                <div className="text-sm bg-muted p-3 rounded-lg">
                                    {booking.musicianPitch}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {booking.status === "selected" && (
                        <div className="flex gap-2 ml-4">
                            <Button
                                size="sm"
                                onClick={handleConfirmBooking}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Confirm Booking
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleRejectBooking}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Decline
                            </Button>
                        </div>
                    )}
                    
                    {booking.status === "confirmed" && (
                        <div className="ml-4">
                            <Badge variant="default" className="bg-green-100 text-green-800">
                                ✅ Booking Confirmed
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 