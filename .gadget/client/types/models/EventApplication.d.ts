import { GadgetConnection, GadgetRecord, GadgetRecordList, LimitToKnownKeys, Selectable } from "@gadgetinc/api-client-core";
import { Query, IDsList, PromiseOrLiveIterator, EventApplication, AvailableEventApplicationSelection, EventApplicationSort, EventApplicationFilter } from "../types.js";
import { DefaultSelection, Select, DeepFilterNever } from "../utils.js";
/**
* A type that holds only the selected fields (and nested fields) of eventApplication. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedEventApplicationOrDefault<Options extends Selectable<AvailableEventApplicationSelection>> = DeepFilterNever<Select<EventApplication, DefaultSelection<AvailableEventApplicationSelection, Options, typeof DefaultEventApplicationSelection>>>;
/**
 * A type that represents a `GadgetRecord` type for eventApplication.
 * It selects all fields of the model by default. If you want to represent a record type with a subset of fields, you could pass in an object in the `Selection` type parameter.
 *
 * @example
 * ```ts
 * const someFunction = (record: EventApplicationRecord, recordWithName: EventApplicationRecord<{ select: { name: true; } }>) => {
 *   // The type of the `record` variable will include all fields of the model.
 *   const name = record.name;
 *   const otherField = record.otherField;
 *
 *   // The type of the `recordWithName` variable will only include the selected fields.
 *   const name = recordWithName.name;
 *   const otherField = recordWithName.otherField; // Type error: Property 'otherField' does not exist on type 'GadgetRecord<{ name: true; }>'.
 * }
 * ```
 */
export type EventApplicationRecord<Selection extends AvailableEventApplicationSelection | undefined = typeof DefaultEventApplicationSelection> = DeepFilterNever<GadgetRecord<SelectedEventApplicationOrDefault<{
    select: Selection;
}>>>;
export declare const DefaultEventApplicationSelection: {
    readonly __typename: true;
    readonly id: true;
    readonly appliedAt: true;
    readonly createdAt: true;
    readonly eventId: true;
    readonly message: true;
    readonly musicianId: true;
    readonly reviewedAt: true;
    readonly reviewedById: true;
    readonly status: true;
    readonly updatedAt: true;
    readonly venueId: true;
};
declare const modelApiIdentifier: "eventApplication";
declare const pluralModelApiIdentifier: "eventApplications";
/** Options that can be passed to the `EventApplicationManager#findOne` method */
export interface FindOneEventApplicationOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventApplicationSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `EventApplicationManager#maybeFindOne` method */
export interface MaybeFindOneEventApplicationOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventApplicationSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `EventApplicationManager#findMany` method */
export interface FindManyEventApplicationsOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventApplicationSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: EventApplicationSort | EventApplicationSort[] | null;
    /** Only return records matching these filters. */
    filter?: EventApplicationFilter | EventApplicationFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
    first?: number | null;
    last?: number | null;
    after?: string | null;
    before?: string | null;
}
/** Options that can be passed to the `EventApplicationManager#findFirst` method */
export interface FindFirstEventApplicationOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventApplicationSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: EventApplicationSort | EventApplicationSort[] | null;
    /** Only return records matching these filters. */
    filter?: EventApplicationFilter | EventApplicationFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
/** Options that can be passed to the `EventApplicationManager#maybeFindFirst` method */
export interface MaybeFindFirstEventApplicationOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventApplicationSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: EventApplicationSort | EventApplicationSort[] | null;
    /** Only return records matching these filters. */
    filter?: EventApplicationFilter | EventApplicationFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
export interface CreateEventApplicationOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventApplicationSelection;
}
/**
 * The return value from executing create on eventApplication
 * Is a GadgetRecord of the model's type.
 **/
export type CreateEventApplicationResult<Options extends CreateEventApplicationOptions> = SelectedEventApplicationOrDefault<Options> extends void ? void : GadgetRecord<SelectedEventApplicationOrDefault<Options>>;
/**
 * A manager for the eventApplication model with all the available operations for reading and writing to it.*/
export type EventApplicationManager = {
    readonly connection: GadgetConnection;
    findOne: {
        /**
         * Finds one eventApplication by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
         **/
        <Options extends FindOneEventApplicationOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneEventApplicationOptions>): PromiseOrLiveIterator<Options, EventApplicationRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultEventApplicationSelection;
        namespace: null;
        optionsType: FindOneEventApplicationOptions;
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
    };
    maybeFindOne: {
        /**
         * Finds one eventApplication by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
         **/
        <Options extends MaybeFindOneEventApplicationOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneEventApplicationOptions>): PromiseOrLiveIterator<Options, EventApplicationRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: MaybeFindOneEventApplicationOptions;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultEventApplicationSelection;
        namespace: null;
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
    };
    findMany: {
        /**
         * Finds many eventApplication. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindManyEventApplicationsOptions>(options?: LimitToKnownKeys<Options, FindManyEventApplicationsOptions>): PromiseOrLiveIterator<Options, GadgetRecordList<EventApplicationRecord<Options["select"]>>>;
        type: 'findMany';
        operationName: typeof pluralModelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: FindManyEventApplicationsOptions;
        defaultSelection: typeof DefaultEventApplicationSelection;
        namespace: null;
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
    };
    findFirst: {
        /**
         * Finds the first matching eventApplication. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindFirstEventApplicationOptions>(options?: LimitToKnownKeys<Options, FindFirstEventApplicationOptions>): PromiseOrLiveIterator<Options, EventApplicationRecord<Options["select"]>>;
        type: 'findFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: FindFirstEventApplicationOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultEventApplicationSelection;
        namespace: null;
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
    };
    maybeFindFirst: {
        /**
         * Finds the first matching eventApplication. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
         **/
        <Options extends MaybeFindFirstEventApplicationOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstEventApplicationOptions>): PromiseOrLiveIterator<Options, EventApplicationRecord<Options["select"]> | null>;
        type: 'maybeFindFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: MaybeFindFirstEventApplicationOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultEventApplicationSelection;
        namespace: null;
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
    };
    findById: {
        /**
        * Finds one eventApplication by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
        **/
        <Options extends FindOneEventApplicationOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneEventApplicationOptions>): PromiseOrLiveIterator<Options, EventApplicationRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneEventApplicationOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultEventApplicationSelection;
        namespace: null;
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
    };
    maybeFindById: {
        /**
        * Finds one eventApplication by its id. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
        **/
        <Options extends FindOneEventApplicationOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneEventApplicationOptions>): Promise<EventApplicationRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneEventApplicationOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultEventApplicationSelection;
        namespace: null;
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
    };
    create: {
        /**
         * Executes the create actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const eventApplicationRecord = await api.eventApplication.create("1");
        **/
        <Options extends CreateEventApplicationOptions>(id: string, options?: LimitToKnownKeys<Options, CreateEventApplicationOptions>): Promise<CreateEventApplicationResult<Options>>;
        type: 'action';
        operationName: 'createEventApplication';
        operationReturnType: 'CreateEventApplication';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: true;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            id: {
                required: true;
                type: 'GadgetID';
            };
        };
        variablesType: ({
            id: string;
        });
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: false;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: [];
        optionsType: CreateEventApplicationOptions;
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
        defaultSelection: typeof DefaultEventApplicationSelection;
    };
    bulkCreate: {
        /**
          * Executes the bulkCreate action with the given inputs.
          */
        <Options extends CreateEventApplicationOptions>(ids: string[], options?: LimitToKnownKeys<Options, CreateEventApplicationOptions>): Promise<CreateEventApplicationResult<Options>[]>;
        type: 'action';
        operationName: 'bulkCreateEventApplications';
        isBulk: true;
        isDeleter: false;
        hasReturnType: false;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'create';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: CreateEventApplicationOptions;
        namespace: null;
        variables: {
            ids: {
                required: true;
                type: '[GadgetID!]';
            };
        };
        variablesType: IDsList | undefined;
        paramOnlyVariables: [];
        selectionType: AvailableEventApplicationSelection;
        schemaType: Query["eventApplication"];
        defaultSelection: typeof DefaultEventApplicationSelection;
    };
    view: {
        (query: string, variables?: Record<string, unknown>): Promise<unknown>;
        type: 'computedView';
        operationName: 'view';
        gqlFieldName: 'eventApplicationGellyView';
        namespace: null;
        imports: [];
        variables: {
            query: {
                type: 'String';
                required: true;
            };
            args: {
                type: 'JSONObject';
            };
        };
        variablesType: Record<string, unknown>;
        resultType: Promise<unknown>;
        plan: never;
    };
};
/**
 * A manager for the eventApplication model with all the available operations for reading and writing to it.*/
export declare const EventApplicationManager: {
    new (connection: GadgetConnection): EventApplicationManager;
};
export {};
