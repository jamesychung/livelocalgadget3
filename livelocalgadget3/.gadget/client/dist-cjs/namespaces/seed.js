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
var seed_exports = {};
__export(seed_exports, {
  SeedNamespace: () => SeedNamespace
});
module.exports = __toCommonJS(seed_exports);
var import_builder = require("./../builder.js");
var import_builder2 = require("./../builder.js");
class SeedNamespace {
  constructor(clientOrParent) {
    this.clientOrParent = clientOrParent;
    /** Executes the createEvents global action. */
    this.createEvents = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "createEvents",
      operationName: "createEvents",
      operationReturnType: "SeedCreateEvents",
      namespace: "seed",
      variables: {}
    });
    /** Executes the createMusicians global action. */
    this.createMusicians = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "createMusicians",
      operationName: "createMusicians",
      operationReturnType: "SeedCreateMusicians",
      namespace: "seed",
      variables: {}
    });
    /** Executes the createReviews global action. */
    this.createReviews = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "createReviews",
      operationName: "createReviews",
      operationReturnType: "SeedCreateReviews",
      namespace: "seed",
      variables: {}
    });
    /** Executes the createUsers global action. */
    this.createUsers = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "createUsers",
      operationName: "createUsers",
      operationReturnType: "SeedCreateUsers",
      namespace: "seed",
      variables: {}
    });
    /** Executes the createVenues global action. */
    this.createVenues = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "createVenues",
      operationName: "createVenues",
      operationReturnType: "SeedCreateVenues",
      namespace: "seed",
      variables: {}
    });
    /** Executes the debugSeed global action. */
    this.debugSeed = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "debugSeed",
      operationName: "debugSeed",
      operationReturnType: "SeedDebugSeed",
      namespace: "seed",
      variables: {}
    });
    /** Executes the quickSeed global action. */
    this.quickSeed = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "quickSeed",
      operationName: "quickSeed",
      operationReturnType: "SeedQuickSeed",
      namespace: "seed",
      variables: {}
    });
    /** Executes the seedAllData global action. */
    this.seedAllData = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "seedAllData",
      operationName: "seedAllData",
      operationReturnType: "SeedSeedAllData",
      namespace: "seed",
      variables: {}
    });
    /** Executes the seedData global action. */
    this.seedData = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "seedData",
      operationName: "seedData",
      operationReturnType: "SeedSeedData",
      namespace: "seed",
      variables: {}
    });
    /** Executes the simpleSeed global action. */
    this.simpleSeed = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "simpleSeed",
      operationName: "simpleSeed",
      operationReturnType: "SeedSimpleSeed",
      namespace: "seed",
      variables: {}
    });
    /** Executes the testContext global action. */
    this.testContext = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "testContext",
      operationName: "testContext",
      operationReturnType: "SeedTestContext",
      namespace: "seed",
      variables: {}
    });
    /** Executes an inline computed view. */
    this.view = (0, import_builder2.buildInlineComputedView)(this, {
      type: "computedView",
      operationName: "gellyView",
      functionName: "view",
      gqlFieldName: "gellyView",
      namespace: "seed",
      variables: {
        query: { type: "String", required: true },
        args: { type: "JSONObject" }
      }
    });
    this.connection = this.clientOrParent.connection;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SeedNamespace
});
//# sourceMappingURL=seed.js.map
