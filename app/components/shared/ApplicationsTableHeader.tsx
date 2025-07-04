import React from "react";
import { TableHead, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

interface ApplicationsTableHeaderProps {
  onSort: (field: 'date' | 'title' | 'applications' | 'status') => void;
  sortField: 'date' | 'title' | 'applications' | 'status';
  sortDirection: 'asc' | 'desc';
}

export const ApplicationsTableHeader: React.FC<ApplicationsTableHeaderProps> = ({
  onSort,
  sortField,
  sortDirection
}) => {
  return (
    <TableRow>
      <TableHead>
        <Button 
          variant="ghost" 
          onClick={() => onSort('title')}
          className="h-auto p-0 font-semibold"
        >
          Event Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead>
        <Button 
          variant="ghost" 
          onClick={() => onSort('date')}
          className="h-auto p-0 font-semibold"
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead>
        <Button 
          variant="ghost" 
          onClick={() => onSort('applications')}
          className="h-auto p-0 font-semibold"
        >
          Applications
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead>
        <Button 
          variant="ghost" 
          onClick={() => onSort('status')}
          className="h-auto p-0 font-semibold"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  );
}; 