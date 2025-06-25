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
    logger.info("Starting review data seeding...");

    // Get existing events and users
    const events = await api.event.findMany();
    const users = await api.user.findMany();

    if (events.length === 0) {
      return {
        success: false,
        error: "No events found. Please run createEvents action first."
      };
    }

    if (users.length === 0) {
      return {
        success: false,
        error: "No users found. Please run createUsers action first."
      };
    }

    // Create sample reviews
    const reviews = await Promise.all([
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
      }),
      api.review.create({
        rating: 5,
        comment: "Incredible rock show! Thunder Road brought the house down with their high-energy performance.",
        isVerified: true,
        isActive: true,
        reviewType: "event",
        event: events[1].id,
        reviewer: users[2].id
      }),
      api.review.create({
        rating: 4,
        comment: "The Basement is a great venue for rock shows. Good sound system and intimate atmosphere.",
        isVerified: true,
        isActive: true,
        reviewType: "event",
        event: events[1].id,
        reviewer: users[3].id
      }),
      api.review.create({
        rating: 5,
        comment: "Exquisite classical performance. The quartet's interpretation of Mozart was simply breathtaking.",
        isVerified: true,
        isActive: true,
        reviewType: "event",
        event: events[2].id,
        reviewer: users[0].id
      }),
      api.review.create({
        rating: 5,
        comment: "The Grand Hall is a beautiful venue for classical music. Perfect acoustics and elegant setting.",
        isVerified: true,
        isActive: true,
        reviewType: "event",
        event: events[2].id,
        reviewer: users[1].id
      })
    ]);

    logger.info("Review data seeding completed successfully!");
    return {
      success: true,
      reviews: reviews.length,
      reviewIds: reviews.map(review => review.id)
    };

  } catch (error) {
    logger.error("Error seeding review data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during review seeding"
    };
  }
};

export const options: ActionOptions = {
  actionType: "custom"
}; 