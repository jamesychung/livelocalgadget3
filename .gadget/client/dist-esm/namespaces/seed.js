import { buildGlobalAction } from "./../builder.js";
import { buildInlineComputedView } from "./../builder.js";
class SeedNamespace {
  constructor(clientOrParent) {
    this.clientOrParent = clientOrParent;
    /** Executes the createEvents global action. */
    this.createEvents = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "createEvents",
      operationName: "createEvents",
      operationReturnType: "SeedCreateEvents",
      namespace: "seed",
      variables: {}
    });
    /** Executes the createMusicians global action. */
    this.createMusicians = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "createMusicians",
      operationName: "createMusicians",
      operationReturnType: "SeedCreateMusicians",
      namespace: "seed",
      variables: {}
    });
    /** Executes the createReviews global action. */
    this.createReviews = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "createReviews",
      operationName: "createReviews",
      operationReturnType: "SeedCreateReviews",
      namespace: "seed",
      variables: {}
    });
    /** Executes the createUsers global action. */
    this.createUsers = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "createUsers",
      operationName: "createUsers",
      operationReturnType: "SeedCreateUsers",
      namespace: "seed",
      variables: {}
    });
    /** Executes the createVenues global action. */
    this.createVenues = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "createVenues",
      operationName: "createVenues",
      operationReturnType: "SeedCreateVenues",
      namespace: "seed",
      variables: {}
    });
    /** Executes the quickSeed global action. */
    this.quickSeed = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "quickSeed",
      operationName: "quickSeed",
      operationReturnType: "SeedQuickSeed",
      namespace: "seed",
      variables: {}
    });
    /** Executes the seedAllData global action. */
    this.seedAllData = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "seedAllData",
      operationName: "seedAllData",
      operationReturnType: "SeedSeedAllData",
      namespace: "seed",
      variables: {}
    });
    /** Executes the seedData global action. */
    this.seedData = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "seedData",
      operationName: "seedData",
      operationReturnType: "SeedSeedData",
      namespace: "seed",
      variables: {}
    });
    /** Executes the simpleSeed global action. */
    this.simpleSeed = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "simpleSeed",
      operationName: "simpleSeed",
      operationReturnType: "SeedSimpleSeed",
      namespace: "seed",
      variables: {}
    });
    /** Executes an inline computed view. */
    this.view = buildInlineComputedView(this, {
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
export {
  SeedNamespace
};
//# sourceMappingURL=seed.js.map
