import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader2, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/api";

export const SeedDataButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runSeed = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      console.log("🌱 Running seed function...");
      
      // Call the seed action
      const seedResult = await api.quickTestData.run();
      
      console.log("🌱 Seed result:", seedResult);
      
      if (seedResult.success) {
        setResult(seedResult);
        console.log("✅ Seed completed successfully!");
        console.log(`Event ID: ${seedResult.eventId}`);
        console.log(`Musician IDs: ${seedResult.musicianIds.join(', ')}`);
      } else {
        setError(seedResult.error || "Seed failed");
      }
    } catch (err) {
      console.error("❌ Seed error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Quick Test Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Create test musicians, venues, events, and bookings for testing the status system.
        </p>
        
        <Button 
          onClick={runSeed} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Test Data...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Create Test Data
            </>
          )}
        </Button>

        {result && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Test data created successfully!</span>
            </div>
            <div className="mt-2 text-sm text-green-700">
              <p><strong>Event ID:</strong> {result.eventId}</p>
              <p><strong>Musician IDs:</strong> {result.musicianIds?.join(', ')}</p>
              <p><strong>Venue ID:</strong> {result.venueId}</p>
            </div>
            <p className="mt-2 text-xs text-green-600">
              You can now test the status system with real data!
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">Error creating test data</span>
            </div>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 