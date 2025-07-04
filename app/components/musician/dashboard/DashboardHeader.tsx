import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../../ui/button";
import { RefreshCw, Calendar, Edit } from "lucide-react";
import { DashboardHeaderProps } from './types';

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  musician,
  user,
  lastRefreshTime,
  bookingsNeedingAttention,
  isRefreshing,
  refreshBookings
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Musician Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {musician.stage_name || user?.first_name}!
        </p>
        <p className="text-xs text-muted-foreground">
          Last updated: {lastRefreshTime.toLocaleTimeString()}
          {bookingsNeedingAttention > 0 && (
            <span className="ml-2 text-orange-600 font-medium">
              • {bookingsNeedingAttention} booking{bookingsNeedingAttention > 1 ? 's' : ''} need{bookingsNeedingAttention > 1 ? '' : 's'} your attention
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2 self-start">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshBookings}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/availability">
            <Calendar className="mr-2 h-4 w-4" />
            Manage Availability
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={`/musician-profile/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}; 