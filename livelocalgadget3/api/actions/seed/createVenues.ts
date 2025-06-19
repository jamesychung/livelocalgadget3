import { ActionOptions } from "gadget-server";

export const run = async (params: any, record: any, context: any) => {
  console.log("CreateVenues action started");
  console.log("Context received:", !!context);
  console.log("API available:", !!context?.api);
  
  // Try to get API from context, but don't fail if not available
  const api = context?.api;
  const logger = context?.logger;
  
  if (!api) {
    console.log("No API available in context, returning instructions");
    return {
      success: false,
      error: "API not available. This action needs to be run with proper backend context.",
      instructions: "Please run this action from the Gadget dashboard or API Explorer with proper authentication."
    };
  }
  
  try {
    console.log("Starting venue data seeding...");
    logger?.info("Starting venue data seeding...");

    // Get existing users to use as owners
    console.log("Looking for venue users...");
    const users = await api.user.findMany({
      filter: {
        role: { equals: "venue" }
      }
    });

    console.log("Found users:", users.length);

    if (users.length === 0) {
      console.log("No venue users found, creating a test venue user first");
      
      // Create a test venue user first
      const testUser = await api.user.create({
        email: "venue@example.com",
        firstName: "Venue",
        lastName: "Owner",
        role: "venue",
        isVerified: true,
        isActive: true
      });
      
      console.log("Created test venue user:", testUser.id);
      
      // Use the new user as owner
      const ownerId = testUser.id;
      
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
          isVerified: true,
          isActive: true,
          rating: 4.8,
          owner: ownerId
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
          owner: ownerId
        })
      ]);

      console.log("Venue data seeding completed successfully!");
      logger?.info("Venue data seeding completed successfully!");
      return {
        success: true,
        venues: venues.length,
        venueIds: venues.map(venue => venue.id),
        message: "Created venues with a new venue owner user"
      };
    } else {
      // Use existing users
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
          isVerified: true,
          isActive: true,
          rating: 4.8,
          owner: users[0].id
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
          owner: users[0].id
        })
      ]);

      console.log("Venue data seeding completed successfully!");
      logger?.info("Venue data seeding completed successfully!");
      return {
        success: true,
        venues: venues.length,
        venueIds: venues.map(venue => venue.id)
      };
    }

  } catch (error) {
    console.error("Error seeding venue data:", error);
    logger?.error("Error seeding venue data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during venue seeding",
      details: error instanceof Error ? error.stack : undefined
    };
  }
};

export const options: ActionOptions = {
  actionType: "custom"
}; 