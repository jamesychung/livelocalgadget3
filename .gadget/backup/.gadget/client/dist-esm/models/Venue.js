import { buildModelManager } from "../builder.js";
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
