export const run = async (params: any, record: any, context: any) => {
  console.log("SimpleSeed action started");
  console.log("Context received:", !!context);
  console.log("API available:", !!context?.api);
  
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
  
  try {
    console.log("Starting simple data seeding...");
    logger?.info("Starting simple data seeding...");

    // Create a test user first
    const testUser = await api.user.create({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "musician",
      isVerified: true,
      isActive: true
    });

    console.log("Created test user:", testUser.id);
    logger?.info("Created test user:", testUser.id);

    // Create a test venue
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

    console.log("Created test venue:", testVenue.id);
    logger?.info("Created test venue:", testVenue.id);

    // Create a test musician
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

    console.log("Created test musician:", testMusician.id);
    logger?.info("Created test musician:", testMusician.id);

    // Create a test event
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

    console.log("Created test event:", testEvent.id);
    logger?.info("Created test event:", testEvent.id);

    const result = {
      success: true,
      message: "Simple seeding completed successfully!",
      created: {
        user: testUser.id,
        venue: testVenue.id,
        musician: testMusician.id,
        event: testEvent.id
      }
    };

    console.log("Seeding completed successfully:", result);
    return result;

  } catch (error) {
    console.error("Error in simple seeding:", error);
    logger?.error("Error in simple seeding:", error);
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