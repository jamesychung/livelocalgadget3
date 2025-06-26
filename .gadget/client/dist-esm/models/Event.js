import { buildModelManager } from "../builder.js";
const DefaultEventSelection = {
  __typename: true,
  id: true,
  availableTickets: true,
  category: true,
  createdAt: true,
  createdById: true,
  date: true,
  description: true,
  endTime: true,
  equipment: true,
  genres: true,
  image: true,
  isActive: true,
  isPublic: true,
  isRecurring: true,
  musicianId: true,
  recurringDays: true,
  recurringEndDate: true,
  recurringInterval: true,
  recurringPattern: true,
  setlist: true,
  startTime: true,
  status: true,
  ticketPrice: true,
  ticketType: true,
  title: true,
  totalCapacity: true,
  updatedAt: true,
  venueId: true
};
const modelApiIdentifier = "event";
const pluralModelApiIdentifier = "events";
;
;
;
;
;
;
;
;
const EventManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultEventSelection,
  [
    {
      type: "findOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: "findMany",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: "findFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: "maybeFindFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: "findOne",
      operationName: pluralModelApiIdentifier,
      functionName: "findById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: pluralModelApiIdentifier,
      functionName: "maybeFindById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: "action",
      operationName: "createEvent",
      operationReturnType: "CreateEvent",
      functionName: "create",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { event: { required: false, type: "CreateEventInput" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultEventSelection
    },
    {
      type: "action",
      operationName: "bulkCreateEvents",
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
      variables: { inputs: { required: true, type: "[BulkCreateEventsInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultEventSelection
    },
    {
      type: "action",
      operationName: "updateEvent",
      operationReturnType: "UpdateEvent",
      functionName: "update",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        id: { required: true, type: "GadgetID" },
        event: { required: false, type: "UpdateEventInput" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultEventSelection
    },
    {
      type: "action",
      operationName: "bulkUpdateEvents",
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
      variables: { inputs: { required: true, type: "[BulkUpdateEventsInput!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultEventSelection
    },
    {
      type: "action",
      operationName: "findFirstEvent",
      operationReturnType: "FindFirstEvent",
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
      defaultSelection: DefaultEventSelection
    },
    {
      type: "action",
      operationName: "bulkFindFirstEvents",
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
      defaultSelection: DefaultEventSelection
    },
    {
      type: "action",
      operationName: "upsertEvent",
      operationReturnType: "UpsertEvent",
      functionName: "upsert",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        on: { required: false, type: "[String!]" },
        event: { required: false, type: "UpsertEventInput" }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: ["on"],
      hasReturnType: {
        "... on CreateEventResult": { hasReturnType: true },
        "... on UpdateEventResult": { hasReturnType: true }
      },
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultEventSelection
    },
    {
      type: "action",
      operationName: "bulkUpsertEvents",
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
      variables: { inputs: { required: true, type: "[BulkUpsertEventsInput!]" } },
      paramOnlyVariables: ["on"],
      defaultSelection: DefaultEventSelection
    },
    {
      type: "computedView",
      operationName: "view",
      functionName: "view",
      gqlFieldName: "eventGellyView",
      namespace: null,
      variables: {
        query: { type: "String", required: true },
        args: { type: "JSONObject" }
      }
    }
  ]
);
export {
  DefaultEventSelection,
  EventManager
};
//# sourceMappingURL=Event.js.map
