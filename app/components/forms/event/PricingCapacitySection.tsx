import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { DollarSign } from "lucide-react";
import { FormSectionProps } from "./EventFormTypes";

export const PricingCapacitySection: React.FC<FormSectionProps> = ({ 
  eventForm, 
  handleInputChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pricing & Capacity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
          <Input
            id="ticketPrice"
            type="number"
            min="0"
            step="0.01"
            value={eventForm.ticketPrice}
            onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
            placeholder="0.00"
          />
        </div>
        
        <div>
          <Label htmlFor="ticketType">Ticket Type</Label>
          <Select value={eventForm.ticketType} onValueChange={(value) => handleInputChange("ticketType", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Admission</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="reserved">Reserved Seating</SelectItem>
              <SelectItem value="standing">Standing Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="totalCapacity">Total Capacity</Label>
          <Input
            id="totalCapacity"
            type="number"
            min="1"
            value={eventForm.totalCapacity}
            onChange={(e) => handleInputChange("totalCapacity", e.target.value)}
            placeholder="100"
          />
        </div>
      </CardContent>
    </Card>
  );
}; 