import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Edit } from "lucide-react";
import { ProfileTabProps } from './types';

export const ProfileTab: React.FC<ProfileTabProps> = ({
  musician
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Musician Profile</CardTitle>
        <CardDescription>Your public profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {musician.profile_picture && (
            <div className="flex justify-center">
              <img 
                src={musician.profile_picture} 
                alt={musician.stage_name} 
                className="h-40 w-40 object-cover rounded-full"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium">About</h3>
            <p className="text-muted-foreground mt-2">
              {musician.bio || "No bio provided yet."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Details</h4>
              <ul className="mt-2 space-y-2">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Stage Name:</span>
                  <span>{musician.stage_name}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Genres:</span>
                  <span>{musician.genres?.join(', ') || 'Not specified'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{[musician.city, musician.state].filter(Boolean).join(', ') || 'Not specified'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Experience:</span>
                  <span>{musician.years_experience ? `${musician.years_experience} years` : 'Not specified'}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium">Contact & Booking</h4>
              <ul className="mt-2 space-y-2">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{musician.email}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{musician.phone || 'Not provided'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Hourly Rate:</span>
                  <span>${musician.hourly_rate || 'Not set'}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button asChild>
              <Link to="/musician-profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 