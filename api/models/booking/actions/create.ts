/**
 * Action to create booking records when musicians apply to events
 */
export const run = async (ctx: any) => {
  console.log('=== BOOKING CREATE ACTION ===');
  console.log('Record:', ctx.record);
  console.log('Changes:', ctx.changes);
  console.log('=== END BOOKING CREATE ===');

  const booking = ctx.record;
  
  // Set default values if not provided
  if (!booking.status) {
    booking.status = "applied";
  }

  if (!booking.isActive) {
    booking.isActive = true;
  }

  // Validate required fields
  if (!booking.eventId) {
    throw new Error("Event ID is required");
  }

  if (!booking.musicianId) {
    throw new Error("Musician ID is required");
  }

  if (!booking.bookedById) {
    throw new Error("Booked by user ID is required");
  }

  // Log the booking creation
  console.log(`🎵 Booking Record Created:`, {
    id: booking.id,
    eventId: booking.eventId,
    musicianId: booking.musicianId,
    bookedById: booking.bookedById,
    status: booking.status,
    proposedRate: booking.proposedRate,
    musicianPitch: booking.musicianPitch,
    timestamp: booking.createdAt
  });

  return booking;
};

export const options = {
  actionType: "create",
  triggers: {
    onSuccess: true
  }
}; 