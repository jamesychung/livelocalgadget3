import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { Clock } from "lucide-react";
import { FormSectionProps } from "./EventFormTypes";

export const DateTimeSection: React.FC<FormSectionProps> = ({ 
  eventForm, 
  handleInputChange,
  handleRecurringDayChange,
  handleRecurringToggle,
  timeOptions = []
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Date & Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="date">Event Date *</Label>
          <Input
            id="date"
            type="date"
            value={eventForm.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Select value={eventForm.startTime} onValueChange={(value) => handleInputChange("startTime", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Select value={eventForm.endTime} onValueChange={(value) => handleInputChange("endTime", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recurring Event Options */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Recurring Event</Label>
              <p className="text-sm text-muted-foreground">
                Make this event repeat on a schedule
              </p>
              <p className="text-xs text-blue-600">
                Current state: {eventForm.isRecurring ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring-toggle"
                checked={eventForm.isRecurring}
                onCheckedChange={handleRecurringToggle}
              />
              <Label htmlFor="recurring-toggle" className="text-sm">
                Enable recurring
              </Label>
            </div>
          </div>

          {eventForm.isRecurring && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recurringPattern">Repeat Pattern</Label>
                  <Select 
                    value={eventForm.recurringPattern} 
                    onValueChange={(value) => handleInputChange("recurringPattern", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Weekly Pattern - Day Selection */}
              {eventForm.recurringPattern === 'weekly' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Repeat on Days</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={eventForm.recurringDays.includes(day)}
                          onCheckedChange={(checked) => handleRecurringDayChange && handleRecurringDayChange(day, checked as boolean)}
                        />
                        <Label 
                          htmlFor={`day-${day}`} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {day.slice(0, 3)}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Select which days of the week to repeat
                  </p>
                </div>
              )}

              {/* Bi-weekly Pattern - Every 2 weeks */}
              {eventForm.recurringPattern === 'bi-weekly' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Bi-weekly Schedule</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      Event will repeat every 2 weeks on the same day of the week.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Example: If your event is on Monday, it will repeat every other Monday.
                    </p>
                  </div>
                </div>
              )}

              {/* Monthly Pattern - Calendar Selection */}
              {eventForm.recurringPattern === 'monthly' && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Repeat on Day of Month</Label>
                  <div className="grid grid-cols-7 gap-1 max-h-48 overflow-y-auto border rounded-md p-3">
                    {Array.from({length: 31}, (_, i) => i + 1).map((day) => (
                      <div key={day} className="flex items-center space-x-1">
                        <Checkbox
                          id={`monthday-${day}`}
                          checked={eventForm.recurringDays.includes(day.toString())}
                          onCheckedChange={(checked) => handleRecurringDayChange && handleRecurringDayChange(day.toString(), checked as boolean)}
                        />
                        <Label 
                          htmlFor={`monthday-${day}`} 
                          className="text-xs font-normal cursor-pointer"
                        >
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Select which day(s) of the month to repeat (e.g., 15th = 15th of every month)
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="recurringEndDate">End Date (Optional)</Label>
                <Input
                  id="recurringEndDate"
                  type="date"
                  value={eventForm.recurringEndDate}
                  onChange={(e) => handleInputChange("recurringEndDate", e.target.value)}
                  placeholder="Leave empty for no end date"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty if the event should continue indefinitely
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 