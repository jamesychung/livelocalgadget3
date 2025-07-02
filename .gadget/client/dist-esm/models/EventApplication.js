import { buildModelManager } from "../builder.js";
const DefaultEventApplicationSelection = {
  __typename: true,
  id: true,
  appliedAt: true,
  createdAt: true,
  eventId: true,
  message: true,
  musicianId: true,
  reviewedAt: true,
  reviewedById: true,
  status: true,
  updatedAt: true,
  venueId: true
};
const modelApiIdentifier = "eventApplication";
const pluralModelApiIdentifier = "eventApplications";
;
;
;
;
;
;
const EventApplicationManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultEventApplicationSelection,
  [
    {
      type: "findOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultEventApplicationSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultEventApplicationSelection,
      namespace: null
    },
    {
      type: "findMany",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultEventApplicationSelection,
      namespace: null
    },
    {
      type: "findFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultEventApplicationSelection,
      namespace: null
    },
    {
      type: "maybeFindFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultEventApplicationSelection,
      namespace: null
    },
    {
      type: "findOne",
      operationName: pluralModelApiIdentifier,
      functionName: "findById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultEventApplicationSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: pluralModelApiIdentifier,
      functionName: "maybeFindById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultEventApplicationSelection,
      namespace: null
    },
    {
      type: "action",
      operationName: "createEventApplication",
      operationReturnType: "CreateEventApplication",
      functionName: "create",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { id: { required: true, type: "GadgetID" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultEventApplicationSelection
    },
    {
      type: "action",
      operationName: "bulkCreateEventApplications",
      functionName: "bulkCreate",
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "create",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { ids: { required: true, type: "[GadgetID!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultEventApplicationSelection
    },
    {
      type: "computedView",
      operationName: "view",
      functionName: "view",
      gqlFieldName: "eventApplicationGellyView",
      namespace: null,
      variables: {
        query: { type: "String", required: true },
        args: { type: "JSONObject" }
      }
    }
  ]
);
export {
  DefaultEventApplicationSelection,
  EventApplicationManager
};
//# sourceMappingURL=EventApplication.js.map
