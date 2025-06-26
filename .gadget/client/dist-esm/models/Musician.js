import { buildModelManager } from "../builder.js";
const DefaultMusicianSelection = {
  __typename: true,
  id: true,
  additionalPictures: true,
  audio: true,
  audioFiles: true,
  availability: true,
  bio: true,
  city: true,
  country: true,
  createdAt: true,
  email: true,
  experience: true,
  genres: true,
  hourlyRate: true,
  instruments: true,
  isVerified: true,
  location: true,
  name: true,
  profilePicture: true,
  rating: true,
  stageName: true,
  updatedAt: true,
  state: true,
  genre: true,
  isActive: true,
  phone: true,
  socialLinks: true,
  totalGigs: true,
  userId: true,
  website: true,
  yearsExperience: true
};
const modelApiIdentifier = "musician";
const pluralModelApiIdentifier = "musicians";
;
;
;
;
;
;
;
;
const MusicianManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultMusicianSelection,
  [
    {
      type: "findOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultMusicianSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultMusicianSelection,
      namespace: null
    },
    {
      type: "findMany",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultMusicianSelection,
      namespace: null
    },
    {
      type: "findFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultMusicianSelection,
      namespace: null
    },
    {
      type: "maybeFindFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultMusicianSelection,
      namespace: null
    },
    {
      type: "findOne",
      operationName: pluralModelApiIdentifier,
      functionName: "findById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultMusicianSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: pluralModelApiIdentifier,
      functionName: "maybeFindById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultMusicianSelection,
      namespace: null
    },
    {
      type: "action",
      operationName: "createMusician",
      operationReturnType: "CreateMusician",
      functionName: "create",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { musician: { required: false, type: "CreateMusicianInput" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultMusicianSelection
    },
    {
      type: "action",
      operationName: "bulkCreateMusicians",
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
      variables: { inputs: { required: true, type: "[BulkCreateMusiciansInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultMusicianSelection
    },
    {
      type: "action",
      operationName: "updateMusician",
      operationReturnType: "UpdateMusician",
      functionName: "update",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        id: { required: true, type: "GadgetID" },
        musician: { required: false, type: "UpdateMusicianInput" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultMusicianSelection
    },
    {
      type: "action",
      operationName: "bulkUpdateMusicians",
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
      variables: { inputs: { required: true, type: "[BulkUpdateMusiciansInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultMusicianSelection
    },
    {
      type: "action",
      operationName: "findFirstMusician",
      operationReturnType: "FindFirstMusician",
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
      defaultSelection: DefaultMusicianSelection
    },
    {
      type: "action",
      operationName: "bulkFindFirstMusicians",
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
      defaultSelection: DefaultMusicianSelection
    },
    {
      type: "action",
      operationName: "upsertMusician",
      operationReturnType: "UpsertMusician",
      functionName: "upsert",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        on: { required: false, type: "[String!]" },
        musician: { required: false, type: "UpsertMusicianInput" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: ["on"],
      hasReturnType: {
        "... on CreateMusicianResult": { hasReturnType: true },
        "... on UpdateMusicianResult": { hasReturnType: true }
      },
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultMusicianSelection
    },
    {
      type: "action",
      operationName: "bulkUpsertMusicians",
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
      variables: { inputs: { required: true, type: "[BulkUpsertMusiciansInput!]" } },
      paramOnlyVariables: ["on"],
      defaultSelection: DefaultMusicianSelection
    },
    {
      type: "computedView",
      operationName: "view",
      functionName: "view",
      gqlFieldName: "musicianGellyView",
      namespace: null,
      variables: {
        query: { type: "String", required: true },
        args: { type: "JSONObject" }
      }
    }
  ]
);
export {
  DefaultMusicianSelection,
  MusicianManager
};
//# sourceMappingURL=Musician.js.map
