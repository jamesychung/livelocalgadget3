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
    logger.info("Starting user data seeding...");

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
      }),
      api.user.create({
        email: "jazz.fan@example.com",
        firstName: "Jazz",
        lastName: "Fan",
        primaryRole: "user",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        bio: "Passionate jazz enthusiast and live music lover.",
        location: "New York, NY",
        isVerified: true,
        isActive: true
      })
    ]);

    logger.info("User data seeding completed successfully!");
    return {
      success: true,
      users: users.length,
      userIds: users.map(user => user.id)
    };

  } catch (error) {
    logger.error("Error seeding user data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during user seeding"
    };
  }
};

export const options: ActionOptions = {
  actionType: "custom"
}; 