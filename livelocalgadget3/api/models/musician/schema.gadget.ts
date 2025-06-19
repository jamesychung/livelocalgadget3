import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "musician" model, go to https://livelocalbeatsgg2.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "musician",
  fields: {
    availability: {
      type: "json",
      storageKey: "musician_availability",
    },
    bio: { type: "string", storageKey: "musician_bio" },
    bookings: {
      type: "hasMany",
      children: { model: "booking", belongsToField: "musician" },
      storageKey: "Y3jBwjULMzuB",
    },
    city: { type: "string", storageKey: "musician_city" },
    country: { type: "string", storageKey: "musician_country" },
    email: { type: "email", storageKey: "musician_email" },
    events: {
      type: "hasMany",
      children: { model: "event", belongsToField: "musician" },
      storageKey: "jawn9_r4eFvs",
    },
    experience: { type: "string", storageKey: "musician_experience" },
    genre: { type: "string", storageKey: "musician_genre" },
    genres: { type: "json", storageKey: "musician_genres" },
    hourlyRate: {
      type: "number",
      storageKey: "musician_hourly_rate",
    },
    instruments: { type: "json", storageKey: "musician_instruments" },
    isActive: { type: "boolean", storageKey: "musician_is_active" },
    isVerified: {
      type: "boolean",
      storageKey: "musician_is_verified",
    },
    location: { type: "string", storageKey: "musician_location" },
    name: { type: "string", storageKey: "musician_name" },
    phone: { type: "string", storageKey: "musician_phone" },
    profilePicture: {
      type: "url",
      storageKey: "musician_profile_picture",
    },
    rating: { type: "number", storageKey: "musician_rating" },
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "musician" },
      storageKey: "6uB2lE7KF-aQ",
    },
    socialLinks: {
      type: "json",
      storageKey: "musician_social_links",
    },
    stageName: { type: "string", storageKey: "musician_stage_name" },
    state: { type: "string", storageKey: "musician_state" },
    totalGigs: { type: "number", storageKey: "musician_total_gigs" },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "musician_user",
    },
    website: { type: "url", storageKey: "musician_website" },
    yearsExperience: {
      type: "number",
      storageKey: "musician_years_experience",
    },
  },
};
