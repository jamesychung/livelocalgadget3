export const run = async (params: any, record: any, context: any) => {
  if (!context?.api) {
    return {
      success: false,
      error: "API context not available. Please run this action from the Gadget dashboard."
    };
  }

  const { api, logger } = context;
  
  try {
    logger?.info("Starting quick data seeding...");

    // Create a test user
    const testUser = await api.user.create({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "musician",
      isVerified: true,
      isActive: true
    });

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

    logger?.info("Created test venue:", testVenue.id);

    return {
      success: true,
      message: "Quick seeding completed successfully!",
      created: {
        user: testUser.id,
        venue: testVenue.id
      }
    };

  } catch (error) {
    logger?.error("Error in quick seeding:", error);
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