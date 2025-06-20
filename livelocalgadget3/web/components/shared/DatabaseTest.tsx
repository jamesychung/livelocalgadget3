import { useState } from 'react';
import { api } from '../../api';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

export default function DatabaseTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testDatabaseConnection = async () => {
    setIsTesting(true);
    setError('');
    setResults(null);

    try {
      const testResults: any = {};

      // Test 1: Check if we can connect to the API
      console.log('Testing API connection...');
      testResults.apiConnection = 'Testing...';

      // Test 2: Try to fetch users
      try {
        console.log('Testing user model...');
        const users = await api.user.findMany({
          first: 5
        });
        testResults.users = {
          success: true,
          count: users.length,
          data: users
        };
      } catch (err: any) {
        testResults.users = {
          success: false,
          error: err.message
        };
      }

      // Test 3: Try to fetch venues
      try {
        console.log('Testing venue model...');
        const venues = await api.venue.findMany({
          first: 5
        });
        testResults.venues = {
          success: true,
          count: venues.length,
          data: venues
        };
      } catch (err: any) {
        testResults.venues = {
          success: false,
          error: err.message
        };
      }

      // Test 4: Try to fetch musicians
      try {
        console.log('Testing musician model...');
        const musicians = await api.musician.findMany({
          first: 5
        });
        testResults.musicians = {
          success: true,
          count: musicians.length,
          data: musicians
        };
      } catch (err: any) {
        testResults.musicians = {
          success: false,
          error: err.message
        };
      }

      // Test 5: Try to fetch events
      try {
        console.log('Testing event model...');
        const events = await api.event.findMany({
          first: 5
        });
        testResults.events = {
          success: true,
          count: events.length,
          data: events
        };
      } catch (err: any) {
        testResults.events = {
          success: false,
          error: err.message
        };
      }

      // Test 6: Try to fetch bookings
      try {
        console.log('Testing booking model...');
        const bookings = await api.booking.findMany({
          first: 5
        });
        testResults.bookings = {
          success: true,
          count: bookings.length,
          data: bookings
        };
      } catch (err: any) {
        testResults.bookings = {
          success: false,
          error: err.message
        };
      }

      // Test 7: Try to fetch reviews
      try {
        console.log('Testing review model...');
        const reviews = await api.review.findMany({
          first: 5
        });
        testResults.reviews = {
          success: true,
          count: reviews.length,
          data: reviews
        };
      } catch (err: any) {
        testResults.reviews = {
          success: false,
          error: err.message
        };
      }

      testResults.apiConnection = 'Connected successfully';
      setResults(testResults);

    } catch (err: any) {
      console.error('Database test error:', err);
      setError(err.message || 'Failed to test database connection');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
          <CardDescription>
            Test your Gadget database connection and model structure
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={testDatabaseConnection}
              disabled={isTesting}
              variant="default"
            >
              {isTesting ? 'Testing...' : 'Test Database Connection'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-4">
              <h3 className="font-semibold">Test Results:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results).map(([key, result]: [string, any]) => (
                  <div key={key} className="p-3 border rounded">
                    <h4 className="font-medium capitalize">{key}</h4>
                    {result.success ? (
                      <div className="text-green-600">
                        ✅ Success - {result.count || 'Connected'} items
                      </div>
                    ) : result.error ? (
                      <div className="text-red-600">
                        ❌ Error: {result.error}
                      </div>
                    ) : (
                      <div className="text-blue-600">
                        ℹ️ {result}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 