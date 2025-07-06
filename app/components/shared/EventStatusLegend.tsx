import React from "react";
import { StatusDisplay } from "./StatusDisplay";
import { getStatusConfig } from "../../lib/utils";

interface EventStatusLegendProps {
  events: any[];
  className?: string;
  hideCompletedStatuses?: boolean; // For MyEventsTab to hide Cancelled and Completed
}

export const EventStatusLegend: React.FC<EventStatusLegendProps> = ({ 
  events, 
  className = "",
  hideCompletedStatuses = false
}) => {
  // Define the status order for display
  const leftColumnStatuses = ['open', 'invited', 'application_received'];
  const rightColumnStatuses = ['confirmed', 'cancel_requested'];
  
  // Add selected status to appropriate column based on hideCompletedStatuses
  if (hideCompletedStatuses) {
    rightColumnStatuses.unshift('selected'); // Add to beginning of right column
  } else {
    leftColumnStatuses.push('selected'); // Add to end of left column
  }
  
  // Add completed statuses if not hidden
  if (!hideCompletedStatuses) {
    rightColumnStatuses.push('cancelled', 'completed');
  }

  const getEventCount = (status: string) => {
    if (status === 'open') {
      return events.filter(e => e.eventStatus === 'open' || e.eventStatus === 'available').length;
    }
    if (status === 'application_received') {
      return events.filter(e => e.eventStatus === 'application_received' || e.eventStatus === 'applied').length;
    }
    return events.filter(e => e.eventStatus === status).length;
  };

  const renderStatusItem = (status: string) => {
    const count = getEventCount(status);
    const config = getStatusConfig(status);
    return (
      <div key={status} className="flex items-center justify-between">
        <StatusDisplay status={status} variant="legend" />
        <span className={`text-sm font-bold ${config.colors.iconColor}`}>
          {count}
        </span>
      </div>
    );
  };

  return (
    <div className={`mb-6 ${className}`}>
      <div className="grid grid-cols-2 gap-3">
        {/* Left Column */}
        <div className="bg-white rounded-lg border p-4 space-y-3">
          {leftColumnStatuses.map(renderStatusItem)}
        </div>
        
        {/* Right Column */}
        <div className="bg-white rounded-lg border p-4 space-y-3">
          {rightColumnStatuses.map(renderStatusItem)}
        </div>
      </div>
    </div>
  );
}; 