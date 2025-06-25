import {
  GadgetConnection,
  GadgetRecord,
  GadgetRecordImplementation,
  GadgetRecordList,
  GadgetNonUniqueDataError,
  actionRunner,
  findManyRunner,
  findOneRunner,
  findOneByFieldRunner,
  FieldSelection,
  LimitToKnownKeys,
  Selectable
} from "@gadgetinc/api-client-core";

import {
  Query,
  ExplicitNestingRequired,

  IDsList,
  PromiseOrLiveIterator,
  Venue,
  AvailableVenueSelection,
  VenueSort,
  VenueFilter
} from "../types.js";

import { buildModelManager } from "../builder.js";
import { AvailableSelection, AllFieldsSelected, DefaultSelection, Select, DeepFilterNever } from "../utils.js";

/**
* A type that holds only the selected fields (and nested fields) of venue. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedVenueOrDefault<Options extends Selectable<AvailableVenueSelection>> = DeepFilterNever<
    Select<
      Venue,
      DefaultSelection<
        AvailableVenueSelection,
        Options,
        typeof DefaultVenueSelection
      >
    >
  >;

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
export type VenueRecord<Selection extends AvailableVenueSelection | undefined = typeof DefaultVenueSelection> = DeepFilterNever<
  GadgetRecord<
    SelectedVenueOrDefault<{
      select: Selection;
    }>
  >
>;

export const DefaultVenueSelection = {
     __typename: true,
     id: true,
     address: true,
     amenities: true,
     capacity: true,
     city: true,
     country: true,
     createdAt: true,
     description: true,
     genres: true,
     hours: true,
     isActive: true,
     name: true,
     ownerId: true,
     phone: true,
     profilePicture: true,
     rating: true,
     socialLinks: true,
     updatedAt: true,
     state: true,
     email: true,
     isVerified: true,
     priceRange: true,
     type: true,
     website: true,
     zipCode: true
   } as const;
const modelApiIdentifier = "venue" as const;
const pluralModelApiIdentifier = "venues" as const;
/** Options that can be passed to the `VenueManager#findOne` method */
 export interface FindOneVenueOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableVenueSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
/** Options that can be passed to the `VenueManager#maybeFindOne` method */
 export interface MaybeFindOneVenueOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableVenueSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
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
};
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
};
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
};

/**
 * A manager for the venue model with all the available operations for reading and writing to it.*/
export type VenueManager = {
  readonly connection: GadgetConnection;

  findOne: {
      /**
       * Finds one venue by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
       **/
      <Options extends FindOneVenueOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneVenueOptions>): PromiseOrLiveIterator<Options,VenueRecord<Options["select"]>>;
      type: 'findOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultVenueSelection;
      namespace: null;
      optionsType: FindOneVenueOptions;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
    }
  maybeFindOne: {
      /**
       * Finds one venue by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
       **/
      <Options extends MaybeFindOneVenueOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneVenueOptions>): PromiseOrLiveIterator<Options,VenueRecord<Options["select"]> | null>;
      type: 'maybeFindOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: MaybeFindOneVenueOptions;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultVenueSelection;
      namespace: null;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
    }
  findMany: {
      /**
       * Finds many venue. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindManyVenuesOptions>(options?: LimitToKnownKeys<Options, FindManyVenuesOptions>): PromiseOrLiveIterator<Options,GadgetRecordList<VenueRecord<Options["select"]>>>;
      type: 'findMany';
      operationName: typeof pluralModelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: FindManyVenuesOptions;
      defaultSelection: typeof DefaultVenueSelection;
      namespace: null;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
    }
  findFirst: {
      /**
       * Finds the first matching venue. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindFirstVenueOptions>(options?: LimitToKnownKeys<Options, FindFirstVenueOptions>): PromiseOrLiveIterator<Options,VenueRecord<Options["select"]>>;
      type: 'findFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: FindFirstVenueOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultVenueSelection;
      namespace: null;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
    }
  maybeFindFirst: {
      /**
       * Finds the first matching venue. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
       **/
      <Options extends MaybeFindFirstVenueOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstVenueOptions>): PromiseOrLiveIterator<Options,VenueRecord<Options["select"]> | null>;
      type: 'maybeFindFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: MaybeFindFirstVenueOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultVenueSelection;
      namespace: null;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
    }
  findById: {
      /**
      * Finds one venue by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
      **/
      <Options extends FindOneVenueOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneVenueOptions>): PromiseOrLiveIterator<Options,VenueRecord<Options["select"]>>;
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
    }
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
    }
  view: {
      (query: string, variables?: Record<string, unknown>): Promise<unknown>
      type: 'computedView';
      operationName: 'view';
      gqlFieldName: 'venueGellyView';
      namespace: null;
      imports: [];
      variables: {
          query: { type: 'String', required: true },
          args: { type: 'JSONObject' }
        };
      variablesType: Record<string, unknown>;
      resultType: Promise<unknown>;
      plan: never;
    }
};

/**
 * A manager for the venue model with all the available operations for reading and writing to it.*/
export const VenueManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultVenueSelection,
  [
    {
      type: 'findOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: 'findMany',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: 'findFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: 'maybeFindFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: 'findOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'findById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'maybeFindById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultVenueSelection,
      namespace: null
    },
    {
      type: 'computedView',
      operationName: 'view',
      functionName: 'view',
      gqlFieldName: 'venueGellyView',
      namespace: null,
      variables: {
        query: { type: 'String', required: true },
        args: { type: 'JSONObject' }
      }
    }
  ] as const
) as unknown as {
  // Gadget generates these model manager classes at runtime dynamically, which means there is no source code for the class. This is done to make the bundle size of the client as small as possible, avoiding a bunch of repeated source code in favour of one small builder function. The TypeScript types above document the exact interface of the constructed class.
  new(connection: GadgetConnection): VenueManager;
};