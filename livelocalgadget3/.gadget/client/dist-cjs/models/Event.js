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
var Event_exports = {};
__export(Event_exports, {
  DefaultEventSelection: () => DefaultEventSelection,
  EventManager: () => EventManager
});
module.exports = __toCommonJS(Event_exports);
var import_builder = require("../builder.js");
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
  image: true,
  isActive: true,
  isPublic: true,
  musicianId: true,
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
const EventManager = (0, import_builder.buildModelManager)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultEventSelection,
  EventManager
});
//# sourceMappingURL=Event.js.map
