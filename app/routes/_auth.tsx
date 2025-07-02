// --------------------------------------------------------------------------------------
// Auth Layout (Logged Out Pages)
// --------------------------------------------------------------------------------------
// This file defines the layout for all authentication-related routes that are accessible to logged out users.
// Typical pages using this layout include sign in, sign up, forgot password, and other authentication tasks.
// Structure:
//   - Header with navigation
//   - Centered content area for auth forms and flows (via <Outlet />)
//   - Handles redirecting signed-in users to logged in routes
// To extend: update the layout or add additional context as needed for your app's auth flows.
// --------------------------------------------------------------------------------------

import { Outlet } from "react-router-dom";
import Header from "../components/shared/Header";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-full h-full grid place-items-center pt-20">
        <Outlet />
      </div>
    </div>
  );
}
