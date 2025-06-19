export const run = async (params: any, record: any, context: any) => {
  if (!context?.api) {
    return {
      success: false,
      error: "API context not available. Please run this action from the Gadget dashboard."
    };
  }

  const { api, logger } = context;
  
  try {
    logger?.info("Starting debug data seeding...");
    console.log("Starting debug data seeding...");

    // Step 1: Create a test user
    logger?.info("Creating test user...");
    console.log("Creating test user...");
    
    const testUser = await api.user.create({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "musician",
      isVerified: true,
      isActive: true
    });

    logger?.info("Test user created:", testUser.id);
    console.log("Test user created:", testUser.id);

    // Step 2: Create a test venue
    logger?.info("Creating test venue...");
    console.log("Creating test venue...");
    
    const testVenue = await api.venue.create({
      name: "Test Venue",
      type: "Jazz Club",
      description: "A test venue for development",
      address: "123 Test St",
      city: "Test City",
      state: "TS",
      zipCode: "12345",
      country: "USA",
      phone: "(555) 123-4567",
      email: "test@venue.com",
      capacity: 100,
      priceRange: "$$",
      isVerified: true,
      isActive: true,
      rating: 4.5,
      owner: testUser.id
    });

    logger?.info("Test venue created:", testVenue.id);
    console.log("Test venue created:", testVenue.id);

    // Step 3: Create a test musician
    logger?.info("Creating test musician...");
    console.log("Creating test musician...");
    
    const testMusician = await api.musician.create({
      name: "Test Musician",
      stageName: "Test Band",
      genre: "Jazz",
      bio: "A test musician for development",
      location: "Test City, TS",
      city: "Test City",
      state: "TS",
      country: "USA",
      phone: "(555) 987-6543",
      email: "test@musician.com",
      hourlyRate: 100,
      instruments: ["Guitar", "Piano"],
      experience: "Test experience",
      yearsExperience: 5,
      isVerified: true,
      isActive: true,
      rating: 4.5,
      totalGigs: 10,
      user: testUser.id
    });

    logger?.info("Test musician created:", testMusician.id);
    console.log("Test musician created:", testMusician.id);

    // Step 4: Create a test event
    logger?.info("Creating test event...");
    console.log("Creating test event...");
    
    const testEvent = await api.event.create({
      title: "Test Event",
      description: "A test event for development",
      category: "Jazz",
      date: "2025-01-15",
      startTime: "8:00 PM",
      endTime: "11:00 PM",
      ticketPrice: 20,
      ticketType: "General Admission",
      totalCapacity: 100,
      availableTickets: 50,
      status: "confirmed",
      isPublic: true,
      isActive: true,
      venue: testVenue.id,
      musician: testMusician.id,
      createdBy: testUser.id
    });

    logger?.info("Test event created:", testEvent.id);
    console.log("Test event created:", testEvent.id);

    const result = {
      success: true,
      message: "Debug seeding completed successfully!",
      created: {
        user: testUser.id,
        venue: testVenue.id,
        musician: testMusician.id,
        event: testEvent.id
      }
    };

    logger?.info("Debug seeding completed successfully:", result);
    console.log("Debug seeding completed successfully:", result);
    return result;

  } catch (error) {
    logger?.error("Error in debug seeding:", error);
    console.error("Error in debug seeding:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      details: error instanceof Error ? error.stack : undefined
    };
  }
};

export const options = {
  actionType: "custom"
}; 