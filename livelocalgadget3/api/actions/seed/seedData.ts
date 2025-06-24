import { ActionOptions } from "gadget-server";

export const run = async (params: any, record: any, context: any) => {
  // If context is not provided, we can't proceed
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
    logger.info("Starting data seeding...");

    // Create sample users
    const users = await Promise.all([
      api.user.create({
        email: "sarah.johnson@example.com",
        firstName: "Sarah",
        lastName: "Johnson",
        primaryRole: "musician",
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        bio: "A passionate jazz musician with over 10 years of experience performing in venues across the country.",
        location: "New York, NY",
        isVerified: true,
        isActive: true
      }),
      api.user.create({
        email: "bluenote@example.com",
        firstName: "Blue",
        lastName: "Note",
        primaryRole: "venue",
        profilePicture: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        bio: "A legendary jazz venue in Greenwich Village, Blue Note Lounge has been hosting world-class musicians since 1981.",
        location: "New York, NY",
        isVerified: true,
        isActive: true
      }),
      api.user.create({
        email: "thunder.road@example.com",
        firstName: "Thunder",
        lastName: "Road",
        primaryRole: "musician",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        bio: "High-energy rock band bringing the thunder to every performance.",
        location: "Los Angeles, CA",
        isVerified: true,
        isActive: true
      })
    ]);

    // Create sample venues
    const venues = await Promise.all([
      api.venue.create({
        name: "Blue Note Lounge",
        type: "Jazz Club",
        description: "A legendary jazz venue in Greenwich Village, Blue Note Lounge has been hosting world-class musicians since 1981. Known for its intimate atmosphere and exceptional acoustics.",
        address: "131 W 3rd St",
        city: "New York",
        state: "NY",
        zipCode: "10012",
        country: "USA",
        phone: "(212) 475-8592",
        email: "info@bluenotelounge.com",
        website: "https://www.bluenotelounge.com",
        profilePicture: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        capacity: 150,
        priceRange: "$$",
        genres: ["Jazz", "Blues", "Soul", "Fusion"],
        amenities: ["Full Bar", "Food Service", "VIP Seating", "Sound System", "Parking"],
        hours: {
          monday: "Closed",
          tuesday: "6:00 PM - 2:00 AM",
          wednesday: "6:00 PM - 2:00 AM",
          thursday: "6:00 PM - 2:00 AM",
          friday: "6:00 PM - 2:00 AM",
          saturday: "6:00 PM - 2:00 AM",
          sunday: "6:00 PM - 12:00 AM"
        },
        socialLinks: {
          instagram: "@bluenotelounge",
          facebook: "Blue Note Lounge NYC",
          twitter: "@BlueNoteNYC"
        },
        isVerified: true,
        isActive: true,
        rating: 4.8,
        owner: users[1].id
      }),
      api.venue.create({
        name: "The Basement",
        type: "Rock Venue",
        description: "Underground rock venue with state-of-the-art sound system and intimate atmosphere.",
        address: "1234 Sunset Blvd",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90026",
        country: "USA",
        phone: "(323) 555-0123",
        email: "info@thebasement.com",
        website: "https://www.thebasement.com",
        profilePicture: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        capacity: 300,
        priceRange: "$$$",
        genres: ["Rock", "Alternative", "Metal", "Punk"],
        amenities: ["Full Bar", "VIP Areas", "Sound System", "Lighting", "Parking"],
        isVerified: true,
        isActive: true,
        rating: 4.7,
        owner: users[1].id
      })
    ]);

    // Create sample musicians
    const musicians = await Promise.all([
      api.musician.create({
        name: "Sarah Johnson",
        stageName: "Sarah Johnson Trio",
        genre: "Jazz",
        genres: ["Jazz", "Blues", "Soul"],
        bio: "A passionate jazz musician with over 10 years of experience performing in venues across the country. Specializing in smooth jazz and contemporary jazz fusion.",
        location: "New York, NY",
        city: "New York",
        state: "NY",
        country: "USA",
        phone: "(212) 555-0123",
        email: "sarah@example.com",
        website: "https://www.sarahjohnson.com",
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        hourlyRate: 150,
        instruments: ["Saxophone", "Piano", "Bass"],
        experience: "Professional jazz musician with extensive performance experience",
        yearsExperience: 10,
        socialLinks: {
          instagram: "@sarahjohnsonjazz",
          facebook: "Sarah Johnson Jazz",
          youtube: "Sarah Johnson Music"
        },
        audioFiles: [],
        additionalPictures: [],
        isVerified: true,
        isActive: true,
        rating: 4.8,
        totalGigs: 127,
        user: users[0].id
      }),
      api.musician.create({
        name: "Thunder Road",
        stageName: "Thunder Road",
        genre: "Rock",
        genres: ["Rock", "Alternative", "Hard Rock"],
        bio: "High-energy rock band bringing the thunder to every performance. Known for electrifying live shows and powerful stage presence.",
        location: "Los Angeles, CA",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        phone: "(323) 555-0456",
        email: "thunder@example.com",
        website: "https://www.thunderroad.com",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        hourlyRate: 200,
        instruments: ["Guitar", "Bass", "Drums", "Vocals"],
        experience: "Professional rock band with national touring experience",
        yearsExperience: 8,
        socialLinks: {
          instagram: "@thunderroadband",
          facebook: "Thunder Road Band",
          youtube: "Thunder Road Official"
        },
        audioFiles: [],
        additionalPictures: [],
        isVerified: true,
        isActive: true,
        rating: 4.9,
        totalGigs: 89,
        user: users[2].id
      })
    ]);

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
        createdBy: users[1].id
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
        createdBy: users[2].id
      })
    ]);

    // Create sample reviews
    await Promise.all([
      api.review.create({
        rating: 5,
        comment: "Amazing performance! Sarah's saxophone playing was absolutely mesmerizing. The venue acoustics were perfect.",
        isVerified: true,
        isActive: true,
        reviewType: "event",
        event: events[0].id,
        reviewer: users[0].id
      }),
      api.review.create({
        rating: 4,
        comment: "Great evening of jazz. The trio was tight and the atmosphere was perfect. Would definitely come back!",
        isVerified: true,
        isActive: true,
        reviewType: "event",
        event: events[0].id,
        reviewer: users[1].id
      })
    ]);

    logger.info("Data seeding completed successfully!");
    return {
      success: true,
      users: users.length,
      venues: venues.length,
      musicians: musicians.length,
      events: events.length
    };

  } catch (error) {
    logger.error("Error seeding data:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred during seeding"
    };
  }
};

export const options: ActionOptions = {
  actionType: "custom"
}; 