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
      default: {},
    },
    bio: { 
      type: "string", 
      storageKey: "musician_bio",
      default: "",
    },
    bookings: {
      type: "hasMany",
      children: { model: "booking", belongsToField: "musician" },
      storageKey: "Y3jBwjULMzuB",
    },
    city: { 
      type: "string", 
      storageKey: "musician_city",
      default: "",
    },
    country: { 
      type: "string", 
      storageKey: "musician_country",
      default: "",
    },
    email: { 
      type: "email", 
      storageKey: "musician_email",
    },
    events: {
      type: "hasMany",
      children: { model: "event", belongsToField: "musician" },
      storageKey: "jawn9_r4eFvs",
    },
    experience: { 
      type: "string", 
      storageKey: "musician_experience",
      default: "",
    },
    genre: { 
      type: "string", 
      storageKey: "musician_genre",
      default: "",
    },
    genres: { 
      type: "json", 
      storageKey: "musician_genres",
      default: [],
    },
    hourlyRate: {
      type: "number",
      storageKey: "musician_hourly_rate",
      default: 0,
    },
    instruments: { 
      type: "json", 
      storageKey: "musician_instruments",
      default: [],
    },
    isActive: { 
      type: "boolean", 
      storageKey: "musician_is_active",
      default: true,
    },
    isVerified: {
      type: "boolean",
      storageKey: "musician_is_verified",
      default: false,
    },
    location: { 
      type: "string", 
      storageKey: "musician_location",
      default: "",
    },
    name: { 
      type: "string", 
      storageKey: "musician_name",
    },
    phone: { 
      type: "string", 
      storageKey: "musician_phone",
      default: "",
    },
    profilePicture: {
      type: "url",
      storageKey: "musician_profile_picture",
    },
    rating: { 
      type: "number", 
      storageKey: "musician_rating",
      default: 0,
    },
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "musician" },
      storageKey: "6uB2lE7KF-aQ",
    },
    socialLinks: {
      type: "json",
      storageKey: "musician_social_links",
      default: [],
    },
    stageName: { 
      type: "string", 
      storageKey: "musician_stage_name",
      default: "",
    },
    state: { 
      type: "string", 
      storageKey: "musician_state",
      default: "",
    },
    totalGigs: { 
      type: "number", 
      storageKey: "musician_total_gigs",
      default: 0,
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "musician_user",
    },
    website: { 
      type: "url", 
      storageKey: "musician_website",
    },
    yearsExperience: {
      type: "number",
      storageKey: "musician_years_experience",
      default: 0,
    },
  },
};
