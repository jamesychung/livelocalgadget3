import React from "react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";

interface ActionButtonsProps {
  selectedMusicians: string[];
  selectedEvents: string[];
  isSubmitting: boolean;
  handleSendInvitations: () => Promise<void>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedMusicians,
  selectedEvents,
  isSubmitting,
  handleSendInvitations
}) => {
  const invitationCount = selectedMusicians.length * selectedEvents.length;
  
  return (
    <div className="flex justify-end gap-4">
      <Button asChild variant="outline">
        <Link to="/venue-events">Cancel</Link>
      </Button>
      <Button 
        onClick={handleSendInvitations}
        disabled={selectedMusicians.length === 0 || selectedEvents.length === 0 || isSubmitting}
        className="flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? 'Sending...' : `Send ${invitationCount} Invitation(s)`}
      </Button>
    </div>
  );
}; 