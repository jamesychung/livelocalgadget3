import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://livelocalgadget3.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-AppAuth-User",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "DhYcbbdlexJj",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "pFI7enn1TLXO",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "qaEpz10ulfbF",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "D75SjSfqmF94",
    },
    firstName: { 
      type: "string", 
      storageKey: "JWeQ4gUpBOTF"
    },
    googleImageUrl: { type: "url", storageKey: "fx3a6keRJRYu" },
    googleProfileId: { type: "string", storageKey: "xr9MpoALyAQ_" },
    lastName: { 
      type: "string", 
      storageKey: "w2TbVlRQ9wZh"
    },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "H3z_0o7Ns7Yz",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "CAFK1LkLo96L",
    },
    profilePicture: {
      type: "file",
      allowPublicAccess: true,
      storageKey: "qlFA-JK8Ag_Y",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "s0iVP9EfFp0",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "qlgBpfZ1B8sk",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "YZoQg8wSA07s",
    },
  },
};
