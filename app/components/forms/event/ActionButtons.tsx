import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Save, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  isSubmitting: boolean;
  cancelPath?: string;
  submitLabel?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  isSubmitting,
  cancelPath = "/venue-events",
  submitLabel = "Create Event"
}) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(cancelPath)}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? `${submitLabel}...` : submitLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 