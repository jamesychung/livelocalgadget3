import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Users, Clock, TrendingUp, Star, AlertTriangle, CheckCircle } from "lucide-react";

export interface VenueEventStat {
  id: string;
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  priority?: number; // For sorting when more than 4 stats are provided
}

interface VenueEventsSummaryDashboardProps {
  stats: VenueEventStat[];
  maxStats?: number;
  className?: string;
}

export const VenueEventsSummaryDashboard: React.FC<VenueEventsSummaryDashboardProps> = ({
  stats,
  maxStats = 4,
  className = ""
}) => {
  // Debug logging
  console.log('🔍 Dashboard Component Debug:', {
    statsReceived: stats.length,
    statsData: stats.map(s => ({ id: s.id, title: s.title, value: s.value, type: typeof s.value })),
    maxStats
  });

  // Sort by priority if provided, then take the first maxStats
  const displayStats = stats
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, maxStats);

  console.log('🔍 Display Stats:', displayStats.map(s => ({ id: s.id, title: s.title, value: s.value })));
  
  // Log each stat individually to see the actual values
  displayStats.forEach((stat, index) => {
    console.log(`🔍 Stat ${index + 1}:`, stat.id, stat.title, stat.value, typeof stat.value);
  });

      return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {displayStats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={stat.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.id === "pendingReviews" && stat.value > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {stat.value} new
                  </Badge>
                )}
                {stat.id === "cancelRequests" && stat.value > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {stat.value} pending
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 