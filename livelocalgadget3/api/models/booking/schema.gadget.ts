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
    bookingType: {
      type: "string",
      storageKey: "booking_type",
      default: "direct_invitation",
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
    equipmentProvided: {
      type: "json",
      storageKey: "booking_equipment_provided",
      default: [],
    },
    fullPaymentPaid: {
      type: "boolean",
      storageKey: "booking_full_payment_paid",
    },
    isActive: { type: "boolean", storageKey: "booking_is_active" },
    event: {
      type: "belongsTo",
      parent: { model: "event" },
      storageKey: "booking_event",
    },
    musician: {
      type: "belongsTo",
      parent: { model: "musician" },
      storageKey: "booking_musician",
    },
    musicianPitch: {
      type: "string",
      storageKey: "booking_musician_pitch",
    },
    notes: { type: "string", storageKey: "booking_notes" },
    proposedRate: {
      type: "number",
      storageKey: "booking_proposed_rate",
    },
    responseDeadline: {
      type: "dateTime",
      storageKey: "booking_response_deadline",
    },
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
