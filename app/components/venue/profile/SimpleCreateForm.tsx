import React from "react";
import { Button } from "../../../components/ui/button";
import { SimpleCreateFormProps } from "./types";

export const SimpleCreateForm: React.FC<SimpleCreateFormProps> = ({ saving, onSubmit }) => {
  return (
    <>
      <p className="mb-4">Click the button below to create a simple venue profile:</p>
      <Button 
        onClick={onSubmit}
        disabled={saving}
        className="w-full"
      >
        {saving ? "Creating..." : "Create Venue Profile"}
      </Button>
    </>
  );
}; 