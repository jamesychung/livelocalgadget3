import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

export default function PublicVenueLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-xl w-full text-center bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Building2 className="h-10 w-10 text-blue-600" />
              Welcome to LiveLocal Venues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Discover, explore, and connect with the best live music venues in your area. Whether you're a fan, musician, or event organizer, find the perfect spot for your next unforgettable experience.
            </p>
            <Button asChild size="lg" className="mt-2">
              <Link to="/venues">
                Browse All Venues
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <div className="pt-4">
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
} 