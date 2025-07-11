import { useState } from 'react';

export default function SeedDataButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const seedData = async () => {
    setIsSeeding(true);
    setMessage('Preparing seeding instructions...');

    try {
      // Since API endpoints might not be available, we'll provide manual instructions
      const sampleData = {
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
      };

      // Copy sample data to clipboard
      await navigator.clipboard.writeText(JSON.stringify(sampleData, null, 2));
      
      setMessage(`
        ✅ Sample data copied to clipboard!
        
        📋 Next steps:
        1. Go to your Gadget.dev dashboard
        2. Click on "API Explorer" in the sidebar
        3. Use the sample data to create records manually
        
        💡 Quick GraphQL mutation for creating a user:
        mutation CreateUser {
          createUser(
            user: {
              email: "sarah.johnson@example.com"
              firstName: "Sarah"
              lastName: "Johnson"
              role: "musician"
              profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              bio: "A passionate jazz musician with over 10 years of experience performing in venues across the country."
              location: "New York, NY"
              isVerified: true
              isActive: true
            }
          ) {
            success
            user {
              id
              email
              firstName
              lastName
            }
          }
        }
      `);

    } catch (error) {
      console.error('Seeding error:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <button
        onClick={seedData}
        disabled={isSeeding}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isSeeding ? 'Preparing...' : 'Get Sample Data'}
      </button>
      {message && (
        <div className="mt-4 p-3 bg-white border rounded text-sm text-gray-700 whitespace-pre-line">
          {message}
        </div>
      )}
    </div>
  );
} 