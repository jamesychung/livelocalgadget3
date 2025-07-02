import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search } from "lucide-react";

interface EventSearchFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
}

export function EventSearchFilter({ 
    searchTerm, 
    setSearchTerm, 
    statusFilter, 
    setStatusFilter 
}: EventSearchFilterProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Search & Filter Events</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search events, venues, or descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="invited">Invited</option>
                        </select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 
