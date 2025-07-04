import React from "react";
import { DashboardHeaderProps } from "./types";
import { formatDate } from "./utils";

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ venue, user, stats }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{venue?.name || "Venue Dashboard"}</h1>
          <p className="text-gray-500">
            Welcome back, {user?.email}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last login</p>
          <p className="font-medium">{formatDate(new Date())}</p>
        </div>
      </div>
    </div>
  );
};