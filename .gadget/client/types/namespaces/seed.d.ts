import { GadgetConnection } from "@gadgetinc/api-client-core";
/**
 * Function type for the inline view execution function.
 * Includes overloads for all known instances collected from call sites.
 **/
type InlineViewFunction = {
    (query: string, variables?: Record<string, unknown>): Promise<unknown>;
};
/** The seed namespace */
export declare class SeedNamespace {
    readonly clientOrParent: {
        connection: GadgetConnection;
    };
    /** Executes the createEvents global action. */
    createEvents: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "createEvents";
        operationReturnType: "SeedCreateEvents";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the createMusicians global action. */
    createMusicians: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "createMusicians";
        operationReturnType: "SeedCreateMusicians";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the createReviews global action. */
    createReviews: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "createReviews";
        operationReturnType: "SeedCreateReviews";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the createUsers global action. */
    createUsers: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "createUsers";
        operationReturnType: "SeedCreateUsers";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the createVenues global action. */
    createVenues: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "createVenues";
        operationReturnType: "SeedCreateVenues";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the debugSeed global action. */
    debugSeed: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "debugSeed";
        operationReturnType: "SeedDebugSeed";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the quickSeed global action. */
    quickSeed: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "quickSeed";
        operationReturnType: "SeedQuickSeed";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the seedAllData global action. */
    seedAllData: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "seedAllData";
        operationReturnType: "SeedSeedAllData";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the seedData global action. */
    seedData: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "seedData";
        operationReturnType: "SeedSeedData";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the simpleSeed global action. */
    simpleSeed: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "simpleSeed";
        operationReturnType: "SeedSimpleSeed";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the testContext global action. */
    testContext: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "testContext";
        operationReturnType: "SeedTestContext";
        namespace: "seed";
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes an inline computed view. */
    view: InlineViewFunction;
    connection: GadgetConnection;
    constructor(clientOrParent: {
        connection: GadgetConnection;
    });
}
export {};
