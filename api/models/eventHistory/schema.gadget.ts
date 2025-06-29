import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "eventHistory" model
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "eventHistory",
  fields: {
    // The event this history entry belongs to
    event: {
      type: "belongsTo",
      parent: { model: "event" },
      storageKey: "eventHistory_event",
    },
    // The booking this history entry belongs to (optional, for booking-specific changes)
    booking: {
      type: "belongsTo",
      parent: { model: "booking" },
      storageKey: "eventHistory_booking",
    },
    // The user who made the change
    changedBy: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "eventHistory_changed_by",
    },
    // Type of change (event_status, booking_status, event_created, booking_created, etc.)
    changeType: {
      type: "string",
      storageKey: "eventHistory_change_type",
    },
    // Previous value
    previousValue: {
      type: "string",
      storageKey: "eventHistory_previous_value",
    },
    // New value
    newValue: {
      type: "string",
      storageKey: "eventHistory_new_value",
    },
    // Detailed description of what happened
    description: {
      type: "string",
      storageKey: "eventHistory_description",
    },
    // Additional context data (JSON)
    context: {
      type: "json",
      storageKey: "eventHistory_context",
      default: {},
    },
    // IP address or other metadata
    metadata: {
      type: "json",
      storageKey: "eventHistory_metadata",
      default: {},
    },
  },
}; 