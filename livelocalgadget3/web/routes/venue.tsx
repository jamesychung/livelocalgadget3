import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowLeft, ArrowRight, Search, MapPin, Users, Star } from "lucide-react";
import { Link } from "react-router";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

export default function PublicVenueLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="flex justify-center mb-6">
            <Building2 className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Venues</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find the perfect venue for your next live music event. From intimate coffee shops to large concert halls, 
            discover venues that match your style and audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/venues">
                <Search className="mr-2 h-5 w-5" />
                Browse All Venues
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Find Your Perfect Venue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Search by location, capacity, venue type, and more to find venues that match your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Local Venues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover venues in your area and connect with local music communities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Connect & Book</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contact venue owners directly and book your next performance or event.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Venue?</h2>
            <p className="text-xl mb-6 opacity-90">
              Start exploring venues in your area and connect with the local music scene.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/venues">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Browsing Venues
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
} 