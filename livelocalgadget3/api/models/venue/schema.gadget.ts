import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "venue" model, go to https://livelocalbeatsgg2.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "venue",
  fields: {
    address: { type: "string", storageKey: "venue_address" },
    amenities: { type: "json", storageKey: "venue_amenities", default: [] },
    additionalPictures: {
      type: "json",
      storageKey: "venue_additional_pictures",
      default: [],
    },
    bookings: {
      type: "hasMany",
      children: { model: "booking", belongsToField: "venue" },
      storageKey: "CPUtVsuDAxMs",
    },
    capacity: { type: "number", storageKey: "venue_capacity" },
    city: { type: "string", storageKey: "venue_city" },
    country: { type: "string", storageKey: "venue_country" },
    description: { type: "string", storageKey: "venue_description" },
    email: { type: "email", storageKey: "venue_email" },
    events: {
      type: "hasMany",
      children: { model: "event", belongsToField: "venue" },
      storageKey: "96QMhngDjRWZ",
    },
    genres: { type: "json", storageKey: "venue_genres", default: [] },
    hours: { type: "json", storageKey: "venue_hours" },
    isActive: { type: "boolean", storageKey: "venue_is_active" },
    isVerified: { type: "boolean", storageKey: "venue_is_verified" },
    name: { type: "string", storageKey: "venue_name" },
    owner: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "venue_owner",
    },
    phone: { type: "string", storageKey: "venue_phone" },
    priceRange: { type: "string", storageKey: "venue_price_range" },
    profilePicture: {
      type: "string",
      storageKey: "venue_profile_picture",
    },
    rating: { type: "number", storageKey: "venue_rating" },
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "event" },
      storageKey: "yvkkZs3qTqKx",
    },
    socialLinks: { type: "json", storageKey: "venue_social_links", default: [] },
    state: { type: "string", storageKey: "venue_state" },
    type: { type: "string", storageKey: "venue_type" },
    website: { type: "url", storageKey: "venue_website" },
    zipCode: { type: "string", storageKey: "venue_zip_code" },
  },
};
