import React, { useState } from "react";
import { Button } from "../ui/button";
import { api } from "../../api";

export const CreateRealEventButton: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCreateRealEvent = async () => {
    setIsCreating(true);
    setResult(null);

    try {
      console.log("🚀 Creating real event with existing data...");
      
      const response = await api.createRealEvent.run();
      
      console.log("✅ Create real event response:", response);
      
      if (response.success) {
        setResult({
          type: "success",
          message: `✅ Real event created successfully!`,
          details: {
            eventId: response.eventId,
            eventTitle: response.eventTitle,
            bookingId: response.bookingId,
            venueName: response.venueName,
            musicianName: response.musicianName
          }
        });
        
        // Show success message
        alert(`✅ Real event created successfully!\n\nEvent: ${response.eventTitle}\nEvent ID: ${response.eventId}\nBooking ID: ${response.bookingId}\n\nYou can now navigate to the event page to test the status system!`);
        
      } else {
        setResult({
          type: "error",
          message: `❌ Failed to create real event: ${response.error}`
        });
        alert(`❌ Failed to create real event: ${response.error}`);
      }
      
    } catch (error) {
      console.error("❌ Error creating real event:", error);
      setResult({
        type: "error",
        message: `❌ Error: ${error.message || 'Unknown error occurred'}`
      });
      alert(`❌ Error creating real event: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleCreateRealEvent}
        disabled={isCreating}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isCreating ? "Creating..." : "🎯 Create Real Event"}
      </Button>
      
      {result && (
        <div className={`p-4 rounded-lg border ${
          result.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <h4 className="font-semibold mb-2">{result.message}</h4>
          
          {result.details && (
            <div className="text-sm space-y-1">
              <p><strong>Event:</strong> {result.details.eventTitle}</p>
              <p><strong>Event ID:</strong> {result.details.eventId}</p>
              <p><strong>Booking ID:</strong> {result.details.bookingId}</p>
              <p><strong>Venue:</strong> {result.details.venueName}</p>
              <p><strong>Musician:</strong> {result.details.musicianName}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <p>This will create a real event using your existing venue and musician data.</p>
        <p>Make sure you have at least one venue and one musician in your database.</p>
      </div>
    </div>
  );
}; 