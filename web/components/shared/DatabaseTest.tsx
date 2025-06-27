import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { api } from "../../api";

export const DatabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testGenreSaving = async () => {
    setLoading(true);
    setTestResult("Testing genre saving...");

    try {
      // Test creating a musician with multiple genres
      const testMusician = await api.musician.create({
        stageName: "Test Artist",
        email: "test@example.com",
        genre: "Jazz",
        genres: ["Jazz", "Blues", "Soul"],
        bio: "Test bio",
        city: "Test City",
        state: "TS",
        country: "Test Country",
      });

      setTestResult(`Created test musician with ID: ${testMusician.id}\nGenres: ${JSON.stringify(testMusician.genres)}`);

      // Test retrieving the musician
      const retrievedMusician = await api.musician.findOne(testMusician.id);
      setTestResult(prev => prev + `\n\nRetrieved musician:\nGenres: ${JSON.stringify(retrievedMusician.genres)}`);

      // Test updating genres
      const updatedMusician = await api.musician.update(testMusician.id, {
        genres: ["Rock", "Alternative", "Pop"]
      });

      setTestResult(prev => prev + `\n\nUpdated musician:\nGenres: ${JSON.stringify(updatedMusician.genres)}`);

      // Clean up - delete the test musician
      await api.musician.delete(testMusician.id);
      setTestResult(prev => prev + `\n\nTest completed successfully! Test musician deleted.`);

    } catch (error) {
      console.error("Test error:", error);
      setTestResult(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Database Genre Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testGenreSaving} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test Genre Saving"}
        </Button>
        
        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 