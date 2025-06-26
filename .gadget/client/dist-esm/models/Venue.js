import { buildModelManager } from "../builder.js";
const DefaultVenueSelection = {
  __typename: true,
  id: true,
  additionalPictures: true,
  address: true,
  amenities: true,
  capacity: true,
  city: true,
  country: true,
  createdAt: true,
  email: true,
  genres: true,
  hours: true,
  isVerified: true,
  name: true,
  ownerId: true,
  priceRange: true,
  profilePicture: true,
  rating: true,
  type: true,
  updatedAt: true,
  state: true,
  description: true,
  isActive: true,
  phone: true,
  socialLinks: true,
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
;
;
;
const VenueManager = buildModelManager(
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
      type: "action",
      operationName: "createVenue",
      operationReturnType: "CreateVenue",
      functionName: "create",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { venue: { required: false, type: "CreateVenueInput" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultVenueSelection
    },
    {
      type: "action",
      operationName: "bulkCreateVenues",
      functionName: "bulkCreate",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: true,
      operatesWithRecordIdentity: false,
      singleActionFunctionName: "create",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: "[BulkCreateVenuesInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultVenueSelection
    },
    {
      type: "action",
      operationName: "updateVenue",
      operationReturnType: "UpdateVenue",
      functionName: "update",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        id: { required: true, type: "GadgetID" },
        venue: { required: false, type: "UpdateVenueInput" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultVenueSelection
    },
    {
      type: "action",
      operationName: "bulkUpdateVenues",
      functionName: "bulkUpdate",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: true,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "update",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: "[BulkUpdateVenuesInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultVenueSelection
    },
    {
      type: "action",
      operationName: "findFirstVenue",
      operationReturnType: "FindFirstVenue",
      functionName: "findFirst",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { id: { required: true, type: "GadgetID" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultVenueSelection
    },
    {
      type: "action",
      operationName: "bulkFindFirstVenues",
      functionName: "bulkFindFirst",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "findFirst",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { ids: { required: true, type: "[GadgetID!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultVenueSelection
    },
    {
      type: "action",
      operationName: "upsertVenue",
      operationReturnType: "UpsertVenue",
      functionName: "upsert",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        on: { required: false, type: "[String!]" },
        venue: { required: false, type: "UpsertVenueInput" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: ["on"],
      hasReturnType: {
        "... on CreateVenueResult": { hasReturnType: true },
        "... on UpdateVenueResult": { hasReturnType: true }
      },
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultVenueSelection
    },
    {
      type: "action",
      operationName: "bulkUpsertVenues",
      functionName: "bulkUpsert",
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: true,
      operatesWithRecordIdentity: false,
      singleActionFunctionName: "upsert",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: "[BulkUpsertVenuesInput!]" } },
      paramOnlyVariables: ["on"],
      defaultSelection: DefaultVenueSelection
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
export {
  DefaultVenueSelection,
  VenueManager
};
//# sourceMappingURL=Venue.js.map
