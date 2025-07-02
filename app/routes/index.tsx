import React from "react";
import { Link } from 'react-router-dom';
import Header from "../components/shared/Header";
import HeroSection from "../components/shared/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        
        {/* Events Section */}
        <section id="events" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-lg text-gray-600">Discover amazing live music in your area</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No events available at the moment
              </div>
              <p className="text-gray-400">
                Check back soon for upcoming live music events
              </p>
            </div>
          </div>
        </section>

        {/* Musicians Section */}
        <section id="musicians" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Musicians</h2>
              <p className="text-lg text-gray-600">Connect with talented local artists</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No musicians available at the moment
              </div>
              <p className="text-gray-400">
                Check back soon for featured local musicians
              </p>
            </div>
          </div>
        </section>

        {/* Venues Section */}
        <section id="venues" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Venues</h2>
              <p className="text-lg text-gray-600">Find the perfect place for your next event</p>
            </div>
            
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No venues available at the moment
              </div>
              <p className="text-gray-400">
                Check back soon for popular local venues
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join Live Local Beats and connect with your local music community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/sign-up"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Create Account
              </Link>
              <Link 
                to="/sign-in"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 
