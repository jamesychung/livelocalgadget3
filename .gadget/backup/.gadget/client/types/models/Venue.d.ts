import { GadgetConnection, GadgetRecord, GadgetRecordList, LimitToKnownKeys, Selectable } from "@gadgetinc/api-client-core";
import { Query, PromiseOrLiveIterator, Venue, AvailableVenueSelection, VenueSort, VenueFilter } from "../types.js";
import { DefaultSelection, Select, DeepFilterNever } from "../utils.js";
/**
* A type that holds only the selected fields (and nested fields) of venue. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedVenueOrDefault<Options extends Selectable<AvailableVenueSelection>> = DeepFilterNever<Select<Venue, DefaultSelection<AvailableVenueSelection, Options, typeof DefaultVenueSelection>>>;
/**
 * A type that represents a `GadgetRecord` type for venue.
 * It selects all fields of the model by default. If you want to represent a record type with a subset of fields, you could pass in an object in the `Selection` type parameter.
 *
 * @example
 * ```ts
 * const someFunction = (record: VenueRecord, recordWithName: VenueRecord<{ select: { name: true; } }>) => {
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
export type VenueRecord<Selection extends AvailableVenueSelection | undefined = typeof DefaultVenueSelection> = DeepFilterNever<GadgetRecord<SelectedVenueOrDefault<{
    select: Selection;
}>>>;
export declare const DefaultVenueSelection: {
    readonly __typename: true;
    readonly id: true;
    readonly address: true;
    readonly amenities: true;
    readonly capacity: true;
    readonly city: true;
    readonly country: true;
    readonly createdAt: true;
    readonly description: true;
    readonly genres: true;
    readonly hours: true;
    readonly isActive: true;
    readonly name: true;
    readonly ownerId: true;
    readonly phone: true;
    readonly profilePicture: true;
    readonly rating: true;
    readonly socialLinks: true;
    readonly updatedAt: true;
    readonly state: true;
    readonly email: true;
    readonly isVerified: true;
    readonly priceRange: true;
    readonly type: true;
    readonly website: true;
    readonly zipCode: true;
};
declare const modelApiIdentifier: "venue";
declare const pluralModelApiIdentifier: "venues";
/** Options that can be passed to the `VenueManager#findOne` method */
export interface FindOneVenueOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableVenueSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `VenueManager#maybeFindOne` method */
export interface MaybeFindOneVenueOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableVenueSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `VenueManager#findMany` method */
export interface FindManyVenuesOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableVenueSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: VenueSort | VenueSort[] | null;
    /** Only return records matching these filters. */
    filter?: VenueFilter | VenueFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
    first?: number | null;
    last?: number | null;
    after?: string | null;
    before?: string | null;
}
/** Options that can be passed to the `VenueManager#findFirst` method */
export interface FindFirstVenueOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableVenueSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: VenueSort | VenueSort[] | null;
    /** Only return records matching these filters. */
    filter?: VenueFilter | VenueFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
/** Options that can be passed to the `VenueManager#maybeFindFirst` method */
export interface MaybeFindFirstVenueOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableVenueSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: VenueSort | VenueSort[] | null;
    /** Only return records matching these filters. */
    filter?: VenueFilter | VenueFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
/**
 * A manager for the venue model with all the available operations for reading and writing to it.*/
export type VenueManager = {
    readonly connection: GadgetConnection;
    findOne: {
        /**
         * Finds one venue by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
         **/
        <Options extends FindOneVenueOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneVenueOptions>): PromiseOrLiveIterator<Options, VenueRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultVenueSelection;
        namespace: null;
        optionsType: FindOneVenueOptions;
        selectionType: AvailableVenueSelection;
        schemaType: Query["venue"];
    };
    maybeFindOne: {
        /**
         * Finds one venue by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
         **/
        <Options extends MaybeFindOneVenueOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneVenueOptions>): PromiseOrLiveIterator<Options, VenueRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: MaybeFindOneVenueOptions;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultVenueSelection;
        namespace: null;
        selectionType: AvailableVenueSelection;
        schemaType: Query["venue"];
    };
    findMany: {
        /**
         * Finds many venue. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindManyVenuesOptions>(options?: LimitToKnownKeys<Options, FindManyVenuesOptions>): PromiseOrLiveIterator<Options, GadgetRecordList<VenueRecord<Options["select"]>>>;
        type: 'findMany';
        operationName: typeof pluralModelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: FindManyVenuesOptions;
        defaultSelection: typeof DefaultVenueSelection;
        namespace: null;
        selectionType: AvailableVenueSelection;
        schemaType: Query["venue"];
    };
    findFirst: {
        /**
         * Finds the first matching venue. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindFirstVenueOptions>(options?: LimitToKnownKeys<Options, FindFirstVenueOptions>): PromiseOrLiveIterator<Options, VenueRecord<Options["select"]>>;
        type: 'findFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: FindFirstVenueOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultVenueSelection;
        namespace: null;
        selectionType: AvailableVenueSelection;
        schemaType: Query["venue"];
    };
    maybeFindFirst: {
        /**
         * Finds the first matching venue. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
         **/
        <Options extends MaybeFindFirstVenueOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstVenueOptions>): PromiseOrLiveIterator<Options, VenueRecord<Options["select"]> | null>;
        type: 'maybeFindFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: MaybeFindFirstVenueOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultVenueSelection;
        namespace: null;
        selectionType: AvailableVenueSelection;
        schemaType: Query["venue"];
    };
    findById: {
        /**
        * Finds one venue by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
        **/
        <Options extends FindOneVenueOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneVenueOptions>): PromiseOrLiveIterator<Options, VenueRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneVenueOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultVenueSelection;
        namespace: null;
        selectionType: AvailableVenueSelection;
        schemaType: Query["venue"];
    };
    maybeFindById: {
        /**
        * Finds one venue by its id. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
        **/
        <Options extends FindOneVenueOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneVenueOptions>): Promise<VenueRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneVenueOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultVenueSelection;
        namespace: null;
        selectionType: AvailableVenueSelection;
        schemaType: Query["venue"];
    };
    view: {
        (query: string, variables?: Record<string, unknown>): Promise<unknown>;
        type: 'computedView';
        operationName: 'view';
        gqlFieldName: 'venueGellyView';
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
 * A manager for the venue model with all the available operations for reading and writing to it.*/
export declare const VenueManager: {
    new (connection: GadgetConnection): VenueManager;
};
export {};
