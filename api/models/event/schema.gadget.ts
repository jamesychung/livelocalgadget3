import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "event" model, go to https://livelocalbeatsgg2.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "event",
  fields: {
    availableTickets: {
      type: "number",
      storageKey: "event_available_tickets",
    },
    category: { type: "string", storageKey: "event_category" },
    createdBy: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "event_created_by",
    },
    date: {
      type: "dateTime",
      includeTime: true,
      storageKey: "event_date",
    },
    description: { type: "string", storageKey: "event_description" },
    endTime: { type: "string", storageKey: "event_end_time" },
    equipment: { 
      type: "json", 
      storageKey: "event_equipment",
      default: [],
    },
    genres: { 
      type: "json", 
      storageKey: "event_genres",
      default: [],
    },
    image: { type: "url", storageKey: "event_image" },
    isActive: { type: "boolean", storageKey: "event_is_active" },
    isPublic: { type: "boolean", storageKey: "event_is_public" },
    isRecurring: { 
      type: "boolean", 
      storageKey: "event_is_recurring",
      default: false,
    },
    musician: {
      type: "belongsTo",
      parent: { model: "musician" },
      storageKey: "event_musician",
    },
    recurringDays: { 
      type: "json", 
      storageKey: "event_recurring_days",
      default: [],
    },
    recurringEndDate: { 
      type: "dateTime", 
      storageKey: "event_recurring_end_date",
    },
    recurringInterval: { 
      type: "number", 
      storageKey: "event_recurring_interval",
      default: 1,
    },
    recurringPattern: { 
      type: "string", 
      storageKey: "event_recurring_pattern",
      default: "weekly",
    },
    rate: { 
      type: "number", 
      storageKey: "event_rate",
      description: "How much the venue is willing to pay musicians"
    },
    setlist: { type: "json", storageKey: "event_setlist" },
    startTime: { type: "string", storageKey: "event_start_time" },
    status: { type: "string", storageKey: "event_status" },
    ticketPrice: { type: "number", storageKey: "event_ticket_price" },
    ticketType: { type: "string", storageKey: "event_ticket_type" },
    title: { type: "string", storageKey: "event_title" },
    totalCapacity: {
      type: "number",
      storageKey: "event_total_capacity",
    },
    venue: {
      type: "belongsTo",
      parent: { model: "venue" },
      storageKey: "event_venue",
    },
  },
};
