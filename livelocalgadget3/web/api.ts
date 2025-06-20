// Sets up the API client for interacting with your backend.
// For your API reference, visit: https://docs.gadget.dev/api/livelocalgadget3
import { Client } from "@gadget-client/livelocalgadget3";

// Create the API client with configuration for local development
export const api = new Client({
  environment: "development",
  // Use browserSession authentication mode for proper session handling
  authenticationMode: { browserSession: true },
  // If you're running the Gadget dev server on a different port, specify it here
  // endpoint: "http://localhost:3000"
});

// Add debugging to see what's available
console.log("API client initialized");
console.log("API client configuration:", {
  environment: api.environment,
  authenticationMode: api.authenticationMode,
  isAuthenticated: api.isAuthenticated,
  endpoint: api.connection.endpoint,
});

console.log("Available API models:", Object.keys(api));

// Debug musician API specifically
if (api.musician) {
  console.log("Musician API methods:", Object.keys(api.musician));
  console.log("Musician create method:", typeof api.musician.create);
  
  // Test if we can access the create method
  if (typeof api.musician.create === 'function') {
    console.log("Musician create method is available and callable");
  } else {
    console.log("Musician create method is not callable");
  }
} else {
  console.log("Musician API not available");
}

// Debug user API
if (api.user) {
  console.log("User API methods:", Object.keys(api.user));
} else {
  console.log("User API not available");
}

// Export a function to check API health
export const checkApiHealth = async () => {
  try {
    console.log("Checking API health...");
    console.log("Authentication status:", api.isAuthenticated);
    console.log("Current user:", api.currentUser);
    console.log("API endpoint:", api.connection.endpoint);
    
    // Try a simple API call to test connection
    if (api.user) {
      const users = await api.user.findMany({ first: 1 });
      console.log("API health check successful:", users);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error("API health check failed:", error);
    return false;
  }
};

// Export a function to wait for authentication
export const waitForAuthentication = async (timeout = 5000): Promise<boolean> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (api.isAuthenticated) {
      console.log("Authentication detected after waiting");
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.error("Authentication timeout - API client not authenticated after", timeout, "ms");
  return false;
};