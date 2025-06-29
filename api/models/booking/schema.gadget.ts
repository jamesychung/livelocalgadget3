import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "booking" model, go to https://livelocalbeatsgg2.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "booking",
  fields: {
    bookedBy: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "booking_booked_by",
    },
    date: {
      type: "dateTime",
      includeTime: true,
      storageKey: "booking_date",
    },
    depositAmount: {
      type: "number",
      storageKey: "booking_deposit_amount",
    },
    depositPaid: {
      type: "boolean",
      storageKey: "booking_deposit_paid",
    },
    endTime: { type: "string", storageKey: "booking_end_time" },
    event: {
      type: "belongsTo",
      parent: { model: "event" },
      storageKey: "booking_event",
    },
    fullPaymentPaid: {
      type: "boolean",
      storageKey: "booking_full_payment_paid",
    },
    isActive: { type: "boolean", storageKey: "booking_is_active" },
    musician: {
      type: "belongsTo",
      parent: { model: "musician" },
      storageKey: "booking_musician",
    },
    musicianPitch: { type: "string", storageKey: "booking_musician_pitch" },
    notes: { type: "string", storageKey: "booking_notes" },
    proposedRate: { type: "number", storageKey: "booking_proposed_rate" },
    specialRequirements: {
      type: "string",
      storageKey: "booking_special_requirements",
    },
    startTime: { type: "string", storageKey: "booking_start_time" },
    status: { type: "string", storageKey: "booking_status" },
    totalAmount: {
      type: "number",
      storageKey: "booking_total_amount",
    },
    venue: {
      type: "belongsTo",
      parent: { model: "venue" },
      storageKey: "booking_venue",
    },
  },
};
