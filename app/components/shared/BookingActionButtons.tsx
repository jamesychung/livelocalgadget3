import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { 
  canTransitionTo, 
  getNextPossibleStatuses, 
  BookingStatus, 
  BOOKING_STATUSES,
  CANCELLATION_REASONS,
  CANCELLATION_REASON_LABELS,
  CancellationReason
} from '../../lib/utils';
import { supabase } from '../../lib/supabase';

interface BookingActionButtonsProps {
  booking: any;
  currentUser: any;
  onStatusUpdate: (updatedBooking: any) => void;
  className?: string;
}

export const BookingActionButtons: React.FC<BookingActionButtonsProps> = ({
  booking,
  currentUser,
  onStatusUpdate,
  className = ''
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [cancellationReason, setCancellationReason] = useState<CancellationReason | ''>('');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentStatus = booking.status as BookingStatus;
  const nextPossibleStatuses = getNextPossibleStatuses(currentStatus);
  
  // Determine user role
  const isVenue = currentUser?.venue?.id === booking.venue_id;
  const isMusician = currentUser?.musician?.id === booking.musician_id;
  const userRole = isVenue ? 'venue' : isMusician ? 'musician' : null;

  // Filter actions based on user role and current status
  const getAvailableActions = () => {
    const actions = [];
    
    if (currentStatus === BOOKING_STATUSES.APPLIED && isVenue) {
      actions.push({ value: BOOKING_STATUSES.BOOKED, label: 'Select This Musician' });
    }
    
    if (currentStatus === BOOKING_STATUSES.BOOKED && isMusician) {
      actions.push({ value: BOOKING_STATUSES.CONFIRMED, label: 'Confirm Booking' });
    }
    
    if (currentStatus === BOOKING_STATUSES.CONFIRMED && (isVenue || isMusician)) {
      actions.push({ value: BOOKING_STATUSES.COMPLETED, label: 'Mark as Completed' });
    }
    
    // Cancellation is always available unless already cancelled or completed
    if (currentStatus !== BOOKING_STATUSES.CANCELLED && currentStatus !== BOOKING_STATUSES.COMPLETED) {
      actions.push({ value: BOOKING_STATUSES.CANCELLED, label: 'Cancel Booking' });
    }
    
    return actions;
  };

  const availableActions = getAvailableActions();

  const handleAction = async () => {
    if (!selectedAction) return;
    
    setIsLoading(true);
    
    try {
      const updateData: any = {
        status: selectedAction,
        updated_at: new Date().toISOString()
      };

      // Add cancellation tracking if cancelling
      if (selectedAction === BOOKING_STATUSES.CANCELLED) {
        updateData.cancelled_by = currentUser.id;
        updateData.cancelled_at = new Date().toISOString();
        updateData.cancelled_by_role = userRole;
        updateData.cancellation_reason = cancellationReason === CANCELLATION_REASONS.OTHER 
          ? customReason 
          : cancellationReason;
      }

      const { data: updatedBooking, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', booking.id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update booking:', error);
        alert('Failed to update booking status. Please try again.');
        return;
      }

      onStatusUpdate(updatedBooking);
      setIsDialogOpen(false);
      setSelectedAction('');
      setCancellationReason('');
      setCustomReason('');
      
      // Show success message
      const actionLabels: Record<string, string> = {
        [BOOKING_STATUSES.BOOKED]: 'Musician selected successfully!',
        [BOOKING_STATUSES.CONFIRMED]: 'Booking confirmed!',
        [BOOKING_STATUSES.COMPLETED]: 'Event marked as completed!',
        [BOOKING_STATUSES.CANCELLED]: 'Booking cancelled successfully.'
      };
      
      alert(actionLabels[selectedAction] || 'Status updated successfully!');
      
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('An error occurred while updating the booking.');
    } finally {
      setIsLoading(false);
    }
  };

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {availableActions.map(action => (
        <Button
          key={action.value}
          variant={action.value === BOOKING_STATUSES.CANCELLED ? 'destructive' : 'default'}
          size="sm"
          onClick={() => {
            setSelectedAction(action.value);
            setIsDialogOpen(true);
          }}
        >
          {action.label}
        </Button>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction === BOOKING_STATUSES.CANCELLED 
                ? 'Cancel Booking' 
                : 'Update Booking Status'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedAction === BOOKING_STATUSES.CANCELLED ? (
              <>
                <div>
                  <Label htmlFor="cancellation-reason">Cancellation Reason</Label>
                  <Select 
                    value={cancellationReason} 
                    onValueChange={(value) => setCancellationReason(value as CancellationReason)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CANCELLATION_REASON_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {cancellationReason === CANCELLATION_REASONS.OTHER && (
                  <div>
                    <Label htmlFor="custom-reason">Please specify reason</Label>
                    <Textarea
                      id="custom-reason"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Please provide details about the cancellation..."
                    />
                  </div>
                )}
              </>
            ) : (
              <p>
                Are you sure you want to {selectedAction === BOOKING_STATUSES.BOOKED ? 'select this musician' :
                  selectedAction === BOOKING_STATUSES.CONFIRMED ? 'confirm this booking' :
                  selectedAction === BOOKING_STATUSES.COMPLETED ? 'mark this event as completed' : 
                  'update this booking'}?
              </p>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAction}
                disabled={isLoading || (selectedAction === BOOKING_STATUSES.CANCELLED && !cancellationReason)}
              >
                {isLoading ? 'Updating...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 