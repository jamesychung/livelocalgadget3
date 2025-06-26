import { GadgetConnection, GadgetRecord, GadgetRecordList, LimitToKnownKeys, Selectable } from "@gadgetinc/api-client-core";
import { Query, PromiseOrLiveIterator, Event, AvailableEventSelection, EventSort, EventFilter } from "../types.js";
import { DefaultSelection, Select, DeepFilterNever } from "../utils.js";
/**
* A type that holds only the selected fields (and nested fields) of event. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedEventOrDefault<Options extends Selectable<AvailableEventSelection>> = DeepFilterNever<Select<Event, DefaultSelection<AvailableEventSelection, Options, typeof DefaultEventSelection>>>;
/**
 * A type that represents a `GadgetRecord` type for event.
 * It selects all fields of the model by default. If you want to represent a record type with a subset of fields, you could pass in an object in the `Selection` type parameter.
 *
 * @example
 * ```ts
 * const someFunction = (record: EventRecord, recordWithName: EventRecord<{ select: { name: true; } }>) => {
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
export type EventRecord<Selection extends AvailableEventSelection | undefined = typeof DefaultEventSelection> = DeepFilterNever<GadgetRecord<SelectedEventOrDefault<{
    select: Selection;
}>>>;
export declare const DefaultEventSelection: {
    readonly __typename: true;
    readonly id: true;
    readonly availableTickets: true;
    readonly category: true;
    readonly createdAt: true;
    readonly createdById: true;
    readonly date: true;
    readonly description: true;
    readonly endTime: true;
    readonly image: true;
    readonly isActive: true;
    readonly isPublic: true;
    readonly musicianId: true;
    readonly setlist: true;
    readonly startTime: true;
    readonly status: true;
    readonly ticketPrice: true;
    readonly ticketType: true;
    readonly title: true;
    readonly totalCapacity: true;
    readonly updatedAt: true;
    readonly venueId: true;
};
declare const modelApiIdentifier: "event";
declare const pluralModelApiIdentifier: "events";
/** Options that can be passed to the `EventManager#findOne` method */
export interface FindOneEventOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `EventManager#maybeFindOne` method */
export interface MaybeFindOneEventOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `EventManager#findMany` method */
export interface FindManyEventsOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: EventSort | EventSort[] | null;
    /** Only return records matching these filters. */
    filter?: EventFilter | EventFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
    first?: number | null;
    last?: number | null;
    after?: string | null;
    before?: string | null;
}
/** Options that can be passed to the `EventManager#findFirst` method */
export interface FindFirstEventOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: EventSort | EventSort[] | null;
    /** Only return records matching these filters. */
    filter?: EventFilter | EventFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
/** Options that can be passed to the `EventManager#maybeFindFirst` method */
export interface MaybeFindFirstEventOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableEventSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: EventSort | EventSort[] | null;
    /** Only return records matching these filters. */
    filter?: EventFilter | EventFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
/**
 * A manager for the event model with all the available operations for reading and writing to it.*/
export type EventManager = {
    readonly connection: GadgetConnection;
    findOne: {
        /**
         * Finds one event by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
         **/
        <Options extends FindOneEventOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneEventOptions>): PromiseOrLiveIterator<Options, EventRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultEventSelection;
        namespace: null;
        optionsType: FindOneEventOptions;
        selectionType: AvailableEventSelection;
        schemaType: Query["event"];
    };
    maybeFindOne: {
        /**
         * Finds one event by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
         **/
        <Options extends MaybeFindOneEventOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneEventOptions>): PromiseOrLiveIterator<Options, EventRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: MaybeFindOneEventOptions;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultEventSelection;
        namespace: null;
        selectionType: AvailableEventSelection;
        schemaType: Query["event"];
    };
    findMany: {
        /**
         * Finds many event. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindManyEventsOptions>(options?: LimitToKnownKeys<Options, FindManyEventsOptions>): PromiseOrLiveIterator<Options, GadgetRecordList<EventRecord<Options["select"]>>>;
        type: 'findMany';
        operationName: typeof pluralModelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: FindManyEventsOptions;
        defaultSelection: typeof DefaultEventSelection;
        namespace: null;
        selectionType: AvailableEventSelection;
        schemaType: Query["event"];
    };
    findFirst: {
        /**
         * Finds the first matching event. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindFirstEventOptions>(options?: LimitToKnownKeys<Options, FindFirstEventOptions>): PromiseOrLiveIterator<Options, EventRecord<Options["select"]>>;
        type: 'findFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: FindFirstEventOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultEventSelection;
        namespace: null;
        selectionType: AvailableEventSelection;
        schemaType: Query["event"];
    };
    maybeFindFirst: {
        /**
         * Finds the first matching event. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
         **/
        <Options extends MaybeFindFirstEventOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstEventOptions>): PromiseOrLiveIterator<Options, EventRecord<Options["select"]> | null>;
        type: 'maybeFindFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: MaybeFindFirstEventOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultEventSelection;
        namespace: null;
        selectionType: AvailableEventSelection;
        schemaType: Query["event"];
    };
    findById: {
        /**
        * Finds one event by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
        **/
        <Options extends FindOneEventOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneEventOptions>): PromiseOrLiveIterator<Options, EventRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneEventOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultEventSelection;
        namespace: null;
        selectionType: AvailableEventSelection;
        schemaType: Query["event"];
    };
    maybeFindById: {
        /**
        * Finds one event by its id. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
        **/
        <Options extends FindOneEventOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneEventOptions>): Promise<EventRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneEventOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultEventSelection;
        namespace: null;
        selectionType: AvailableEventSelection;
        schemaType: Query["event"];
    };
    view: {
        (query: string, variables?: Record<string, unknown>): Promise<unknown>;
        type: 'computedView';
        operationName: 'view';
        gqlFieldName: 'eventGellyView';
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
 * A manager for the event model with all the available operations for reading and writing to it.*/
export declare const EventManager: {
    new (connection: GadgetConnection): EventManager;
};
export {};
