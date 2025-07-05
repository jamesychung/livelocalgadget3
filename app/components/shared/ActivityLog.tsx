import { format } from "date-fns";

export interface ActivityItem {
  timestamp: Date;
  action: string;
  actor: string;
  details?: string;
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sortedActivities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium">Date & Time</th>
              <th className="text-left p-2 font-medium">Action</th>
              <th className="text-left p-2 font-medium">By</th>
              <th className="text-left p-2 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedActivities.map((activity, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-2 text-sm">
                  {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </td>
                <td className="p-2 text-sm font-medium">{activity.action}</td>
                <td className="p-2 text-sm">{activity.actor}</td>
                <td className="p-2 text-sm text-gray-600">{activity.details || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Utility function to generate activity items from booking data
export function generateBookingActivityItems(booking: any): ActivityItem[] {
  const activities: ActivityItem[] = [];

  // Event creation
  if (booking.event?.created_at) {
    activities.push({
      timestamp: new Date(booking.event.created_at),
      action: "Event Created",
      actor: "Venue",
      details: `Event "${booking.event.title}" was created`
    });
  }

  // Application submitted
  if (booking.applied_at || booking.status === 'applied') {
    // Use applied_at if available, otherwise fall back to created_at for applied bookings
    const timestamp = booking.applied_at ? new Date(booking.applied_at) : new Date(booking.created_at);
    activities.push({
      timestamp,
      action: "Application Submitted",
      actor: "Musician",
      details: booking.musician_pitch ? `Pitch: ${booking.musician_pitch}` : undefined
    });
  }

  // Musician selected
  if (booking.selected_at) {
    activities.push({
      timestamp: new Date(booking.selected_at),
      action: "Musician Selected",
      actor: "Venue",
      details: booking.proposed_rate ? `Proposed rate: $${booking.proposed_rate}` : undefined
    });
  }

  // Booking confirmed
  if (booking.confirmed_at) {
    activities.push({
      timestamp: new Date(booking.confirmed_at),
      action: "Booking Confirmed",
      actor: "Musician",
      details: "Musician accepted the booking"
    });
  }

  // Cancellation requested
  if (booking.cancel_requested_at) {
    const actor = booking.cancel_requested_by_role === 'venue' ? 'Venue' : 'Musician';
    activities.push({
      timestamp: new Date(booking.cancel_requested_at),
      action: "Cancellation Requested",
      actor,
      details: booking.cancellation_reason || undefined
    });
  }

  // Booking cancelled
  if (booking.cancelled_at) {
    const actor = booking.cancel_confirmed_by_role === 'venue' ? 'Venue' : 'Musician';
    activities.push({
      timestamp: new Date(booking.cancelled_at),
      action: "Booking Cancelled",
      actor,
      details: booking.cancellation_reason || undefined
    });
  }

  // Booking completed
  if (booking.completed_at) {
    const actor = booking.completed_by_role === 'venue' ? 'Venue' : 'Musician';
    activities.push({
      timestamp: new Date(booking.completed_at),
      action: "Booking Completed",
      actor,
      details: "Event successfully completed"
    });
  }

  return activities;
}

// Utility function to generate activity items from multiple applications
export function generateApplicationsActivityItems(applications: any[]): ActivityItem[] {
  const activities: ActivityItem[] = [];

  applications.forEach(booking => {
    const musicianStageName = booking.musician?.stage_name || booking.musician?.name;
    
    // Application submitted
    if (booking.applied_at || booking.status === 'applied') {
      // Use applied_at if available, otherwise fall back to created_at for applied bookings
      const timestamp = booking.applied_at ? new Date(booking.applied_at) : new Date(booking.created_at);
      activities.push({
        timestamp,
        action: "Application Submitted",
        actor: "Musician",
        details: musicianStageName ? `${musicianStageName}${booking.musician_pitch ? ` - Pitch: ${booking.musician_pitch}` : ''}` : (booking.musician_pitch ? `Pitch: ${booking.musician_pitch}` : undefined)
      });
    }

    // Musician selected
    if (booking.selected_at) {
      activities.push({
        timestamp: new Date(booking.selected_at),
        action: "Musician Selected",
        actor: "Venue",
        details: `Selected ${musicianStageName || 'musician'}${booking.proposed_rate ? ` - Rate: $${booking.proposed_rate}` : ''}`
      });
    }

    // Booking confirmed
    if (booking.confirmed_at) {
      activities.push({
        timestamp: new Date(booking.confirmed_at),
        action: "Booking Confirmed",
        actor: "Musician",
        details: musicianStageName ? `${musicianStageName} accepted the booking` : "Musician accepted the booking"
      });
    }

    // Cancellation requested
    if (booking.cancel_requested_at) {
      const actor = booking.cancel_requested_by_role === 'venue' ? 'Venue' : 'Musician';
      const details = booking.cancellation_reason || undefined;
      const actorDetails = booking.cancel_requested_by_role !== 'venue' && musicianStageName ? `${musicianStageName}${details ? ` - ${details}` : ''}` : details;
      activities.push({
        timestamp: new Date(booking.cancel_requested_at),
        action: "Cancellation Requested",
        actor,
        details: actorDetails
      });
    }

    // Booking cancelled
    if (booking.cancelled_at) {
      const actor = booking.cancel_confirmed_by_role === 'venue' ? 'Venue' : 'Musician';
      const details = booking.cancellation_reason || undefined;
      const actorDetails = booking.cancel_confirmed_by_role !== 'venue' && musicianStageName ? `${musicianStageName}${details ? ` - ${details}` : ''}` : details;
      activities.push({
        timestamp: new Date(booking.cancelled_at),
        action: "Booking Cancelled",
        actor,
        details: actorDetails
      });
    }

    // Booking completed
    if (booking.completed_at) {
      const actor = booking.completed_by_role === 'venue' ? 'Venue' : 'Musician';
      activities.push({
        timestamp: new Date(booking.completed_at),
        action: "Booking Completed",
        actor,
        details: booking.completed_by_role !== 'venue' && musicianStageName ? `${musicianStageName} completed the event` : "Event successfully completed"
      });
    }
  });

  return activities;
}

// Utility function to generate activity items for event-focused view
export function generateEventActivityItems(event: any, applications: any[]): ActivityItem[] {
  const activities: ActivityItem[] = [];

  // Event creation
  if (event.created_at) {
    activities.push({
      timestamp: new Date(event.created_at),
      action: "Event Created",
      actor: "Venue",
      details: `Event "${event.title}" was created`
    });
  }

  // Add all application activities
  const applicationActivities = generateApplicationsActivityItems(applications);
  activities.push(...applicationActivities);

  return activities;
} 