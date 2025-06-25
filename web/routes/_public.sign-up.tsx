import React from "react";
import { Link } from "react-router";
import Header from "../components/shared/Header";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex justify-center items-center min-h-screen py-12">
        <div className="w-[420px]">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight text-center">Create Account</h1>
                <p className="text-center text-gray-600">
                  Join Live Local Beats to discover amazing music
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <input
                      type="password"
                      placeholder="Create a password"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">I am a...</label>
                    <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select your role</option>
                      <option value="musician">Musician</option>
                      <option value="venue">Venue Owner</option>
                      <option value="organizer">Event Organizer</option>
                      <option value="fan">Music Fan</option>
                    </select>
                  </div>

                  <button 
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Create Account
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link to="/sign-in" className="text-blue-600 hover:underline font-medium">
                        Sign in →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 