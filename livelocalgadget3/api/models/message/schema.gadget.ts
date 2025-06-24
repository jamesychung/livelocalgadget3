import type { GadgetModel } from "gadget-server";

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "message",
  fields: {
    content: {
      type: "string",
      storageKey: "message_content",
    },
    attachments: {
      type: "json",
      storageKey: "message_attachments",
      default: [],
    },
    isRead: {
      type: "boolean",
      storageKey: "message_is_read",
      default: false,
    },
    messageType: {
      type: "string",
      storageKey: "message_type",
      default: "text",
    },
    booking: {
      type: "belongsTo",
      parent: { model: "booking" },
      storageKey: "message_booking",
    },
    sender: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "message_sender",
    },
    recipient: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "message_recipient",
    },
    isActive: {
      type: "boolean",
      storageKey: "message_is_active",
      default: true,
    },
  },
}; 