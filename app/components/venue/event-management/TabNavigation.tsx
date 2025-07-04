import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingsCount: number;
  children: ReactNode;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  bookingsCount,
  children
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Event Details</TabsTrigger>
        <TabsTrigger value="bookings">Event Activity ({bookingsCount})</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="history">Event History</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}; 