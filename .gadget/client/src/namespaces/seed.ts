import { GadgetConnection } from "@gadgetinc/api-client-core";
import { buildGlobalAction } from "./../builder.js";
import { buildInlineComputedView } from "./../builder.js";

/**
 * Function type for the inline view execution function.
 * Includes overloads for all known instances collected from call sites.
 **/
type InlineViewFunction = {
  (query: string, variables?: Record<string, unknown>): Promise<unknown>
}

/** The seed namespace */
export class SeedNamespace {
  /** Executes the createEvents global action. */
  createEvents = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'createEvents',
                       operationName: 'createEvents',
                       operationReturnType: 'SeedCreateEvents',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'createEvents';
                     operationReturnType: 'SeedCreateEvents';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the createMusicians global action. */
  createMusicians = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'createMusicians',
                       operationName: 'createMusicians',
                       operationReturnType: 'SeedCreateMusicians',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'createMusicians';
                     operationReturnType: 'SeedCreateMusicians';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the createReviews global action. */
  createReviews = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'createReviews',
                       operationName: 'createReviews',
                       operationReturnType: 'SeedCreateReviews',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'createReviews';
                     operationReturnType: 'SeedCreateReviews';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the createUsers global action. */
  createUsers = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'createUsers',
                       operationName: 'createUsers',
                       operationReturnType: 'SeedCreateUsers',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'createUsers';
                     operationReturnType: 'SeedCreateUsers';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the createVenues global action. */
  createVenues = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'createVenues',
                       operationName: 'createVenues',
                       operationReturnType: 'SeedCreateVenues',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'createVenues';
                     operationReturnType: 'SeedCreateVenues';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the debugSeed global action. */
  debugSeed = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'debugSeed',
                       operationName: 'debugSeed',
                       operationReturnType: 'SeedDebugSeed',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'debugSeed';
                     operationReturnType: 'SeedDebugSeed';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the quickSeed global action. */
  quickSeed = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'quickSeed',
                       operationName: 'quickSeed',
                       operationReturnType: 'SeedQuickSeed',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'quickSeed';
                     operationReturnType: 'SeedQuickSeed';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the seedAllData global action. */
  seedAllData = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'seedAllData',
                       operationName: 'seedAllData',
                       operationReturnType: 'SeedSeedAllData',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'seedAllData';
                     operationReturnType: 'SeedSeedAllData';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the seedData global action. */
  seedData = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'seedData',
                       operationName: 'seedData',
                       operationReturnType: 'SeedSeedData',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'seedData';
                     operationReturnType: 'SeedSeedData';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the simpleSeed global action. */
  simpleSeed = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'simpleSeed',
                       operationName: 'simpleSeed',
                       operationReturnType: 'SeedSimpleSeed',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'simpleSeed';
                     operationReturnType: 'SeedSimpleSeed';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes the testContext global action. */
  testContext = buildGlobalAction(this, {
                       type: 'globalAction',
                       functionName: 'testContext',
                       operationName: 'testContext',
                       operationReturnType: 'SeedTestContext',
                       namespace: 'seed',
                       variables: {}
                     } as const) as unknown as {
                     (): Promise<any>;
                     type: 'globalAction';
                     operationName: 'testContext';
                     operationReturnType: 'SeedTestContext';
                     namespace: 'seed';
                     typesImports: [];
                     variables: {};
                     variablesType: Record<string, never>;
                   };
  /** Executes an inline computed view. */
  view: InlineViewFunction = buildInlineComputedView(this, {
                             type: 'computedView',
                             operationName: 'gellyView',
                             functionName: 'view',
                             gqlFieldName: 'gellyView',
                             namespace: 'seed',
                             variables: {
                               query: { type: 'String', required: true },
                               args: { type: 'JSONObject' }
                             }
                           } as const);

  connection: GadgetConnection;
  constructor(readonly clientOrParent: { connection: GadgetConnection }) {
    this.connection = this.clientOrParent.connection as GadgetConnection;
    
  }
}