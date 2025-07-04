import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Checkbox } from "../../ui/checkbox";
import { Settings } from "lucide-react";
import { FormSectionProps } from "./EventFormTypes";

export const EquipmentSection: React.FC<FormSectionProps> = ({ 
  eventForm, 
  handleEquipmentChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Equipment & Supplies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Check who will provide each item for this event
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Item</TableHead>
                <TableHead className="w-[120px] text-center">Venue Provides</TableHead>
                <TableHead className="w-[120px] text-center">Musician Provides</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventForm.equipment.map((equipment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{equipment.item}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={equipment.venueProvides}
                      onCheckedChange={(checked) => handleEquipmentChange && handleEquipmentChange(index, 'venueProvides', checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={equipment.musicianProvides}
                      onCheckedChange={(checked) => handleEquipmentChange && handleEquipmentChange(index, 'musicianProvides', checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {equipment.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}; 