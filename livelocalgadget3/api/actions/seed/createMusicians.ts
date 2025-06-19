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
    logger.info("Starting musician data seeding...");

    // Get existing users to use as musician users
    const users = await api.user.findMany({
      filter: {
        role: { equals: "musician" }
      }
    });

    if (users.length === 0) {
      return {
        success: false,
        error: "No musician users found. Please run createUsers action first."
      };
    }

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
        isVerified: true,
        isActive: true,
        rating: 4.9,
        totalGigs: 89,
        user: users[1].id
      }),
      api.musician.create({
        name: "The Classical Quartet",
        stageName: "The Classical Quartet",
        genre: "Classical",
        genres: ["Classical", "Chamber Music", "Symphony"],
        bio: "Professional string quartet performing classical masterpieces and contemporary compositions.",
        location: "Chicago, IL",
        city: "Chicago",
        state: "IL",
        country: "USA",
        phone: "(312) 555-0789",
        email: "classical@example.com",
        website: "https://www.classicalquartet.com",
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        hourlyRate: 300,
        instruments: ["Violin", "Viola", "Cello"],
        experience: "Professional classical musicians with conservatory training",
        yearsExperience: 15,
        socialLinks: {
          instagram: "@classicalquartet",
          facebook: "The Classical Quartet",
          youtube: "Classical Quartet Official"
        },
        isVerified: true,
        isActive: true,
        rating: 4.9,
        totalGigs: 45,
        user: users[0].id // Using the same user for demo purposes
      })
    ]);

    logger.info("Musician data seeding completed successfully!");
    return {
      success: true,
      musicians: musicians.length,
      musicianIds: musicians.map(musician => musician.id)
    };

  } catch (error) {
    logger.error("Error seeding musician data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during musician seeding"
    };
  }
};

export const options: ActionOptions = {
  actionType: "custom"
}; 