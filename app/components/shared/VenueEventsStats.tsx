import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Users, Clock, TrendingUp, Music } from "lucide-react";

interface VenueEventsStatsProps {
    totalEvents: number;
    eventsWithApplications: number;
    totalApplications: number;
    pendingApplications: number;
    eventsThisMonth: number;
}

export const VenueEventsStats: React.FC<VenueEventsStatsProps> = ({
    totalEvents,
    eventsWithApplications,
    totalApplications,
    pendingApplications,
    eventsThisMonth,
}) => {
    const stats = [
        {
            title: "Total Events",
            value: totalEvents,
            icon: Calendar,
            description: "All events created",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Events with Applications",
            value: eventsWithApplications,
            icon: Music,
            description: "Events receiving interest",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Total Applications",
            value: totalApplications,
            icon: Users,
            description: "All musician applications",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Pending Applications",
            value: pendingApplications,
            icon: Clock,
            description: "Awaiting your review",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Events This Month",
            value: eventsThisMonth,
            icon: TrendingUp,
            description: "Current month events",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <IconComponent className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
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
