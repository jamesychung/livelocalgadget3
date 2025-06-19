export const run = async (params: any, record: any, context: any) => {
  try {
    // This action will be run from the web interface
    // We'll return instructions for manual data creation
    return {
      success: true,
      message: "Seeding action completed. Please create data manually through the Gadget.dev dashboard:",
      instructions: [
        "1. Go to the Users section and create users manually",
        "2. Go to the Venues section and create venues manually", 
        "3. Go to the Musicians section and create musicians manually",
        "4. Go to the Events section and create events manually",
        "5. Go to the Reviews section and create reviews manually"
      ],
      sampleData: {
        users: [
          {
            email: "sarah.johnson@example.com",
            firstName: "Sarah",
            lastName: "Johnson", 
            role: "musician",
            profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "A passionate jazz musician with over 10 years of experience performing in venues across the country.",
            location: "New York, NY",
            isVerified: true,
            isActive: true
          },
          {
            email: "bluenote@example.com",
            firstName: "Blue",
            lastName: "Note",
            role: "venue", 
            profilePicture: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            bio: "A legendary jazz venue in Greenwich Village, Blue Note Lounge has been hosting world-class musicians since 1981.",
            location: "New York, NY",
            isVerified: true,
            isActive: true
          }
        ],
        venues: [
          {
            name: "Blue Note Lounge",
            type: "Jazz Club",
            description: "A legendary jazz venue in Greenwich Village, Blue Note Lounge has been hosting world-class musicians since 1981.",
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
            rating: 4.8
          }
        ],
        musicians: [
          {
            name: "Sarah Johnson",
            stageName: "Sarah Johnson Trio",
            genre: "Jazz",
            genres: ["Jazz", "Blues", "Soul"],
            bio: "A passionate jazz musician with over 10 years of experience performing in venues across the country.",
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
            isVerified: true,
            isActive: true,
            rating: 4.8,
            totalGigs: 127
          }
        ],
        events: [
          {
            title: "Jazz Night at Blue Note",
            description: "An evening of smooth jazz featuring the Sarah Johnson Trio.",
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
            isPublic: true,
            isActive: true
          }
        ]
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

export const options = {
  actionType: "custom"
}; 