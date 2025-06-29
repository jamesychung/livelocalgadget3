import { ActionOptions } from "gadget-server";

/**
 * Quick seed function to create test data for status system testing
 */
export const run = async (ctx: any) => {
  console.log('=== QUICK TEST DATA SEED ===');

  try {
    // Create test musicians
    const musicians = [];
    const musicianData = [
      {
        stageName: "Jazz Master Mike",
        genre: "Jazz",
        city: "Austin",
        state: "TX",
        email: "mike@test.com",
        hourlyRate: 140,
        bio: "Versatile jazz guitarist with 10+ years experience"
      },
      {
        stageName: "Sarah Keys",
        genre: "Classical",
        city: "Houston",
        state: "TX",
        email: "sarah@test.com",
        hourlyRate: 175,
        bio: "Classical pianist with formal training"
      },
      {
        stageName: "Cowboy Chris",
        genre: "Country",
        city: "Dallas",
        state: "TX",
        email: "chris@test.com",
        hourlyRate: 110,
        bio: "Country singer-songwriter with original material"
      }
    ];

    for (const data of musicianData) {
      try {
        const musician = await ctx.api.musician.create(data);
        musicians.push(musician);
        console.log(`✅ Created musician: ${musician.stageName} (ID: ${musician.id})`);
      } catch (error) {
        console.error(`❌ Error creating musician ${data.stageName}:`, error);
      }
    }

    // Create test venue
    let venue;
    try {
      venue = await ctx.api.venue.create({
        name: "The Grand Hall",
        address: "123 Main Street",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        phone: "(512) 555-0123",
        email: "info@grandhall.com",
        website: "https://grandhall.com",
        description: "Elegant venue perfect for live music events",
        capacity: 200,
        type: "Concert Hall"
      });
      console.log(`✅ Created venue: ${venue.name} (ID: ${venue.id})`);
    } catch (error) {
      console.error(`❌ Error creating venue:`, error);
    }

    // Create test event
    let event;
    if (venue) {
      try {
        event = await ctx.api.event.create({
          title: "Jazz Night at The Grand Hall",
          description: "An evening of smooth jazz featuring local and regional talent",
          date: "2024-02-15T19:00:00Z",
          startTime: "19:00",
          endTime: "23:00",
          ticketPrice: 45,
          totalCapacity: 200,
          availableTickets: 150,
          status: "open",
          venue: {
            _link: venue.id
          }
        });
        console.log(`✅ Created event: ${event.title} (ID: ${event.id})`);
      } catch (error) {
        console.error(`❌ Error creating event:`, error);
      }
    }

    // Create test bookings
    if (event && musicians.length > 0) {
      const bookingData = [
        {
          status: "applied",
          proposedRate: 150,
          musicianPitch: "I'm a versatile jazz guitarist with 10+ years of experience performing at venues like yours.",
          musician: { _link: musicians[0].id },
          event: { _link: event.id },
          venue: { _link: venue.id }
        },
        {
          status: "applied",
          proposedRate: 180,
          musicianPitch: "Classical pianist with formal training. Perfect for elegant events.",
          musician: { _link: musicians[1].id },
          event: { _link: event.id },
          venue: { _link: venue.id }
        },
        {
          status: "applied",
          proposedRate: 120,
          musicianPitch: "Country singer-songwriter with original material and covers.",
          musician: { _link: musicians[2].id },
          event: { _link: event.id },
          venue: { _link: venue.id }
        }
      ];

      for (const data of bookingData) {
        try {
          const booking = await ctx.api.booking.create(data);
          console.log(`✅ Created booking: ${booking.id} for ${data.musician._link}`);
        } catch (error) {
          console.error(`❌ Error creating booking:`, error);
        }
      }
    }

    console.log('=== SEED COMPLETE ===');
    console.log('You can now test the status system with real data!');
    console.log(`Event ID: ${event?.id}`);
    console.log('Musician IDs:', musicians.map(m => m.id));

    return {
      success: true,
      eventId: event?.id,
      musicianIds: musicians.map(m => m.id),
      venueId: venue?.id
    };

  } catch (error) {
    console.error('❌ Seed failed:', error);
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