import React from "react";
import { Table, TableBody, TableHeader } from "../ui/table";
import { ApplicationsTableHeader } from "./ApplicationsTableHeader";
import { ApplicationTableRow } from "./ApplicationTableRow";

interface ApplicationsTableProps {
  events: any[];
  getEventApplications: (eventId: string) => any[];
  getPendingApplications: (eventId: string) => any[];
  onSort: (field: 'date' | 'title' | 'applications' | 'status') => void;
  sortField: 'date' | 'title' | 'applications' | 'status';
  sortDirection: 'asc' | 'desc';
  onReview: (event: any) => void;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  events,
  getEventApplications,
  getPendingApplications,
  onSort,
  sortField,
  sortDirection,
  onReview
}) => {
  return (
    <Table>
      <TableHeader>
        <ApplicationsTableHeader
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </TableHeader>
      <TableBody>
        {events.map((event) => {
          const applications = getEventApplications(event.id);
          const pendingApplications = getPendingApplications(event.id);
          
          return (
            <ApplicationTableRow
              key={event.id}
              event={event}
              applications={applications}
              pendingApplications={pendingApplications}
              onReview={onReview}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}; 