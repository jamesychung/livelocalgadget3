import React from "react";
import { Badge } from "../../ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
    case "communicating":
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Communicating</Badge>;
    case "applied":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Applied</Badge>;
    case "invited":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Invited</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
}; 