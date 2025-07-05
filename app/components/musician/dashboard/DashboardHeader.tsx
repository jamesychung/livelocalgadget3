import React from "react";

interface MusicianProfile {
  id: string;
  stage_name: string;
  email: string;
  phone?: string;
  bio?: string;
  genres?: string[];
  city?: string;
  state?: string;
  website?: string;
  profile_picture?: string;
  base_rate?: number;
  travel_radius?: number;
}

interface DashboardHeaderProps {
  musician: MusicianProfile;
  user: any;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ musician, user }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{musician?.stage_name || "Musician Dashboard"}</h1>
          <p className="text-gray-500">
            Welcome back, {user?.email}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="font-medium">{formatDate(new Date())}</p>
        </div>
      </div>
    </div>
  );
}; 