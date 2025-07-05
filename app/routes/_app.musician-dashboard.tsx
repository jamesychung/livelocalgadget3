import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { MusicianDashboard } from '../components/musician/dashboard/MusicianDashboard';
import type { AuthOutletContext } from "./_app";

export default function MusicianDashboardRoute() {
  const context = useOutletContext<AuthOutletContext>();
  const user = context?.user;

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access your musician dashboard.</p>
        </div>
      </div>
    );
  }

  return <MusicianDashboard />;
} 
