import React from "react";
import { TableRow, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Users, Eye } from "lucide-react";

interface ApplicationTableRowProps {
  event: any;
  applications: any[];
  pendingApplications: any[];
  onReview: (event: any) => void;
}

export const ApplicationTableRow: React.FC<ApplicationTableRowProps> = ({
  event,
  applications,
  pendingApplications,
  onReview
}) => {
  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onReview(event)}
    >
      <TableCell>
        <div>
          <div className="font-medium">{event.title}</div>
          <div className="text-sm text-muted-foreground">
            {event.venue?.name}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm">
              {new Date(event.date).toLocaleDateString()}
            </div>
            {event.startTime && event.endTime && (
              <div className="text-xs text-muted-foreground">
                {event.startTime} - {event.endTime}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{applications.length}</div>
            <div className="text-xs text-muted-foreground">
              {pendingApplications.length} pending
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={event.eventStatus === 'open' ? 'default' : 'secondary'}>
          {event.eventStatus}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Review
        </Button>
      </TableCell>
    </TableRow>
  );
}; 