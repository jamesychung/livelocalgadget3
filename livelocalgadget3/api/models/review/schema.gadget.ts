import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "review" model, go to https://livelocalbeatsgg2.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "review",
  fields: {
    comment: { type: "string", storageKey: "review_comment" },
    event: {
      type: "belongsTo",
      parent: { model: "venue" },
      storageKey: "review_event",
    },
    isActive: { type: "boolean", storageKey: "review_is_active" },
    isVerified: { type: "boolean", storageKey: "review_is_verified" },
    musician: {
      type: "belongsTo",
      parent: { model: "musician" },
      storageKey: "review_musician",
    },
    rating: { type: "number", storageKey: "review_rating" },
    reviewType: { type: "string", storageKey: "review_type" },
    reviewer: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "review_reviewer",
    },
    venue: {
      type: "belongsTo",
      parent: { model: "venue" },
      storageKey: "review_venue",
    },
  },
};
