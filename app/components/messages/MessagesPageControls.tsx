import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar, List, Filter } from "lucide-react";

interface MessagesPageControlsProps {
  viewMode: "calendar" | "list";
  setViewMode: (mode: "calendar" | "list") => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
}

export function MessagesPageControls({ 
  viewMode, 
  setViewMode, 
  statusFilter, 
  setStatusFilter 
}: MessagesPageControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list")}>
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="with_messages">With Messages</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="selected">Selected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 