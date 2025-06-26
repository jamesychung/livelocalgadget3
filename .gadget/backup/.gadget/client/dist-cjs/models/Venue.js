"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Venue_exports = {};
__export(Venue_exports, {
  DefaultVenueSelection: () => DefaultVenueSelection,
  VenueManager: () => VenueManager
});
module.exports = __toCommonJS(Venue_exports);
var import_builder = require("../builder.js");
const DefaultVenueSelection = {
  __typename: true,
  id: true,
  address: true,
  amenities: true,
  capacity: true,
  city: true,
  country: true,
  createdAt: true,
  description: true,
  genres: true,
  hours: true,
  isActive: true,
  name: true,
  ownerId: true,
  phone: true,
  profilePicture: true,
  rating: true,
  socialLinks: true,
  updatedAt: true,
  state: true,
  email: true,
  isVerified: true,
  priceRange: true,
  type: true,
  website: true,
  zipCode: true
};
const modelApiIdentifier = "venue";
const pluralModelApiIdentifier = "venues";
;
;
;
;
;
const VenueManager = (0, import_builder.buildModelManager)(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultVenueSelection,
  [
    {
      type: "findOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: "findMany",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: "findFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: "maybeFindFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: "findOne",
      operationName: pluralModelApiIdentifier,
      functionName: "findById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: pluralModelApiIdentifier,
      functionName: "maybeFindById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: "computedView",
      operationName: "view",
      functionName: "view",
      gqlFieldName: "venueGellyView",
      namespace: null,
      variables: {
        query: { type: "String", required: true },
        args: { type: "JSONObject" }
      }
    }
  ]
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultVenueSelection,
  VenueManager
});
//# sourceMappingURL=Venue.js.map
