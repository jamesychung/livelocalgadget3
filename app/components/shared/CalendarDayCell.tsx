import React from "react";
import { Badge } from "../ui/badge";
import { CalendarEventItem } from "./CalendarEventItem";

interface CalendarDayCellProps {
  date: Date;
  dayEvents: any[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onEventClick?: (event: any) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  dayEvents,
  isToday,
  isCurrentMonth,
  onEventClick
}) => {
  return (
    <div
      className={`
        min-h-[100px] p-2 border rounded-lg transition-colors
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${isToday ? 'ring-2 ring-blue-500' : ''}
        ${dayEvents.length > 0 ? 'bg-blue-50 border-blue-200' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`
          text-sm font-medium
          ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
          ${isToday ? 'text-blue-600 font-bold' : ''}
        `}>
          {date.getDate()}
        </span>
        {dayEvents.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {dayEvents.length}
          </Badge>
        )}
      </div>
      {dayEvents.length > 0 && (
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map(event => (
            <CalendarEventItem key={event.id} event={event} onClick={onEventClick} />
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-muted-foreground text-center">
              +{dayEvents.length - 2} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 