import { buildModelManager } from "../builder.js";
const DefaultReviewSelection = {
  __typename: true,
  id: true,
  comment: true,
  createdAt: true,
  eventId: true,
  isActive: true,
  isVerified: true,
  musicianId: true,
  rating: true,
  reviewType: true,
  reviewerId: true,
  updatedAt: true,
  venueId: true
};
const modelApiIdentifier = "review";
const pluralModelApiIdentifier = "reviews";
;
;
;
;
;
const ReviewManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultReviewSelection,
  [
    {
      type: "findOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: "findMany",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: "findFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: "maybeFindFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: "findOne",
      operationName: pluralModelApiIdentifier,
      functionName: "findById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: pluralModelApiIdentifier,
      functionName: "maybeFindById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: "computedView",
      operationName: "view",
      functionName: "view",
      gqlFieldName: "reviewGellyView",
      namespace: null,
      variables: {
        query: { type: "String", required: true },
        args: { type: "JSONObject" }
      }
    }
  ]
);
export {
  DefaultReviewSelection,
  ReviewManager
};
//# sourceMappingURL=Review.js.map
