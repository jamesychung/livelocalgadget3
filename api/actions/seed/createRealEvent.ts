import { ActionOptions } from "gadget-server";

/**
 * Create a real event using existing venue and musician data
 */
export const run = async (ctx: any) => {
  console.log('=== CREATING REAL EVENT WITH EXISTING DATA ===');

  try {
    // Get existing venue
    const venues = await ctx.api.venue.findMany({
      first: 1
    });
    
    if (venues.length === 0) {
      throw new Error("No venues found in database. Please create a venue first.");
    }
    
    const venue = venues[0];
    console.log(`✅ Using existing venue: ${venue.name} (ID: ${venue.id})`);

    // Get existing musician
    const musicians = await ctx.api.musician.findMany({
      first: 1
    });
    
    if (musicians.length === 0) {
      throw new Error("No musicians found in database. Please create a musician first.");
    }
    
    const musician = musicians[0];
    console.log(`✅ Using existing musician: ${musician.stageName} (ID: ${musician.id})`);

    // Create a real event
    const event = await ctx.api.event.create({
      title: "Live Music Night",
      description: "An evening of live music featuring local talent. Perfect for date night or corporate events.",
      date: "2024-03-15T19:00:00Z",
      startTime: "19:00",
      endTime: "23:00",
      ticketPrice: 35,
      totalCapacity: 150,
      availableTickets: 120,
      status: "open",
      venue: {
        _link: venue.id
      }
    });
    
    console.log(`✅ Created real event: ${event.title} (ID: ${event.id})`);

    // Create a real booking
    const booking = await ctx.api.booking.create({
      status: "applied",
      proposedRate: musician.hourlyRate || 100,
      musicianPitch: `Hi! I'm ${musician.stageName}, a ${musician.genre} musician from ${musician.city}, ${musician.state}. I'm very interested in performing at your venue and would love to discuss the opportunity.`,
      musician: {
        _link: musician.id
      },
      event: {
        _link: event.id
      },
      venue: {
        _link: venue.id
      },
      date: "2024-03-15T19:00:00Z",
      startTime: "19:00",
      endTime: "23:00"
    });
    
    console.log(`✅ Created real booking: ${booking.id} for ${musician.stageName}`);

    console.log('=== REAL EVENT CREATION COMPLETE ===');
    console.log(`Event ID: ${event.id}`);
    console.log(`Booking ID: ${booking.id}`);
    console.log(`Venue ID: ${venue.id}`);
    console.log(`Musician ID: ${musician.id}`);

    return {
      success: true,
      eventId: event.id,
      bookingId: booking.id,
      venueId: venue.id,
      musicianId: musician.id,
      eventTitle: event.title,
      musicianName: musician.stageName,
      venueName: venue.name
    };

  } catch (error) {
    console.error('❌ Failed to create real event:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const options = {
  actionType: "run",
  triggers: {
    onSuccess: true
  }
} satisfies ActionOptions; 