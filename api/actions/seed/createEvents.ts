import { ActionOptions } from "gadget-server";

export const run = async (params: any, record: any, context: any) => {
  if (!context) {
    return {
      success: false,
      error: "Context is required but was not provided. This action must be run from the backend."
    };
  }
  
  const { api, logger } = context;
  
  if (!api) {
    return {
      success: false,
      error: "API is required but was not provided in context"
    };
  }
  
  if (!logger) {
    return {
      success: false,
      error: "Logger is required but was not provided in context"
    };
  }
  
  try {
    logger.info("Starting event data seeding...");

    // Get existing venues and musicians
    const venues = await api.venue.findMany();
    const musicians = await api.musician.findMany();
    const users = await api.user.findMany();

    if (venues.length === 0) {
      return {
        success: false,
        error: "No venues found. Please run createVenues action first."
      };
    }

    if (musicians.length === 0) {
      return {
        success: false,
        error: "No musicians found. Please run createMusicians action first."
      };
    }

    if (users.length === 0) {
      return {
        success: false,
        error: "No users found. Please run createUsers action first."
      };
    }

    // Create sample events
    const events = await Promise.all([
      api.event.create({
        title: "Jazz Night at Blue Note",
        description: "An evening of smooth jazz featuring the Sarah Johnson Trio. Experience the magic of live jazz in an intimate setting with exceptional acoustics.",
        category: "Jazz",
        date: "2025-06-25",
        startTime: "8:00 PM",
        endTime: "11:00 PM",
        ticketPrice: 25,
        ticketType: "General Admission",
        totalCapacity: 150,
        availableTickets: 45,
        status: "confirmed",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        setlist: [
          "Take Five (Dave Brubeck)",
          "So What (Miles Davis)",
          "Midnight Dreams (Original)",
          "Autumn Leaves (Jazz Standard)",
          "Blue in Green (Miles Davis)",
          "Smooth Operator (Original)"
        ],
        isPublic: true,
        isActive: true,
        venue: venues[0].id,
        musician: musicians[0].id,
        createdBy: users[0].id
      }),
      api.event.create({
        title: "Rock Revolution",
        description: "High-energy rock performance by Thunder Road. Get ready for an electrifying night of rock music.",
        category: "Rock",
        date: "2025-06-28",
        startTime: "9:30 PM",
        endTime: "1:00 AM",
        ticketPrice: 30,
        ticketType: "General Admission",
        totalCapacity: 300,
        availableTickets: 120,
        status: "confirmed",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        setlist: [
          "Thunderstruck (AC/DC)",
          "Sweet Child O' Mine (Guns N' Roses)",
          "Original Song 1",
          "Original Song 2",
          "Highway to Hell (AC/DC)",
          "Original Song 3"
        ],
        isPublic: true,
        isActive: true,
        venue: venues[1].id,
        musician: musicians[1].id,
        createdBy: users[1].id
      }),
      api.event.create({
        title: "Classical Evening",
        description: "An elegant evening of classical music featuring The Classical Quartet performing masterpieces by Mozart, Beethoven, and contemporary composers.",
        category: "Classical",
        date: "2025-07-02",
        startTime: "7:30 PM",
        endTime: "10:00 PM",
        ticketPrice: 45,
        ticketType: "Reserved Seating",
        totalCapacity: 500,
        availableTickets: 200,
        status: "confirmed",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        setlist: [
          "String Quartet No. 14 in C minor (Mozart)",
          "String Quartet No. 7 in F major (Beethoven)",
          "Contemporary Piece (Original)",
          "String Quartet No. 8 in E minor (Mendelssohn)"
        ],
        isPublic: true,
        isActive: true,
        venue: venues[2].id,
        musician: musicians[2].id,
        createdBy: users[0].id
      })
    ]);

    logger.info("Event data seeding completed successfully!");
    return {
      success: true,
      events: events.length,
      eventIds: events.map(event => event.id)
    };

  } catch (error) {
    logger.error("Error seeding event data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during event seeding"
    };
  }
};

export const options: ActionOptions = {
  actionType: "custom"
}; 