import React from "react";
import { Button } from "../ui/button";
import { Link } from 'react-router-dom';

interface VenueProfilePromptProps {
    onCreateProfile: () => void;
}

export function VenueProfilePrompt({ onCreateProfile }: VenueProfilePromptProps) {
    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Venue Events Management</h1>
                    <p className="text-muted-foreground mb-6">
                        It looks like you haven't created your venue profile yet. Create your profile to start managing your events and bookings.
                    </p>
                    <Button asChild>
                        <Link to="/venue-profile/create" onClick={onCreateProfile}>
                            Create Venue Profile
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
} 