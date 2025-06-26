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
var Review_exports = {};
__export(Review_exports, {
  DefaultReviewSelection: () => DefaultReviewSelection,
  ReviewManager: () => ReviewManager
});
module.exports = __toCommonJS(Review_exports);
var import_builder = require("../builder.js");
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
const ReviewManager = (0, import_builder.buildModelManager)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultReviewSelection,
  ReviewManager
});
//# sourceMappingURL=Review.js.map
