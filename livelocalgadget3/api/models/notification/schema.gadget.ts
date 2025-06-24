import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "notification",
  fields: {
    type: {
      type: "string",
      storageKey: "notification_type",
    },
    title: {
      type: "string",
      storageKey: "notification_title",
    },
    content: {
      type: "string",
      storageKey: "notification_content",
    },
    isRead: {
      type: "boolean",
      storageKey: "notification_is_read",
      default: false,
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "notification_user",
    },
    booking: {
      type: "belongsTo",
      parent: { model: "booking" },
      storageKey: "notification_booking",
    },
    event: {
      type: "belongsTo",
      parent: { model: "event" },
      storageKey: "notification_event",
    },
    musician: {
      type: "belongsTo",
      parent: { model: "musician" },
      storageKey: "notification_musician",
    },
    venue: {
      type: "belongsTo",
      parent: { model: "venue" },
      storageKey: "notification_venue",
    },
    isActive: {
      type: "boolean",
      storageKey: "notification_is_active",
      default: true,
    },
  },
}; 