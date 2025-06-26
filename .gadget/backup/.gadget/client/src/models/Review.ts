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
  Review,
  AvailableReviewSelection,
  ReviewSort,
  ReviewFilter
} from "../types.js";

import { buildModelManager } from "../builder.js";
import { AvailableSelection, AllFieldsSelected, DefaultSelection, Select, DeepFilterNever } from "../utils.js";

/**
* A type that holds only the selected fields (and nested fields) of review. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedReviewOrDefault<Options extends Selectable<AvailableReviewSelection>> = DeepFilterNever<
    Select<
      Review,
      DefaultSelection<
        AvailableReviewSelection,
        Options,
        typeof DefaultReviewSelection
      >
    >
  >;

/**
 * A type that represents a `GadgetRecord` type for review.
 * It selects all fields of the model by default. If you want to represent a record type with a subset of fields, you could pass in an object in the `Selection` type parameter.
 *
 * @example
 * ```ts
 * const someFunction = (record: ReviewRecord, recordWithName: ReviewRecord<{ select: { name: true; } }>) => {
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
export type ReviewRecord<Selection extends AvailableReviewSelection | undefined = typeof DefaultReviewSelection> = DeepFilterNever<
  GadgetRecord<
    SelectedReviewOrDefault<{
      select: Selection;
    }>
  >
>;

export const DefaultReviewSelection = {
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
   } as const;
const modelApiIdentifier = "review" as const;
const pluralModelApiIdentifier = "reviews" as const;
/** Options that can be passed to the `ReviewManager#findOne` method */
 export interface FindOneReviewOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableReviewSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
/** Options that can be passed to the `ReviewManager#maybeFindOne` method */
 export interface MaybeFindOneReviewOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableReviewSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
/** Options that can be passed to the `ReviewManager#findMany` method */
 export interface FindManyReviewsOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableReviewSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: ReviewSort | ReviewSort[] | null;
  /** Only return records matching these filters. */
  filter?: ReviewFilter | ReviewFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
};
/** Options that can be passed to the `ReviewManager#findFirst` method */
 export interface FindFirstReviewOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableReviewSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: ReviewSort | ReviewSort[] | null;
  /** Only return records matching these filters. */
  filter?: ReviewFilter | ReviewFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
};
/** Options that can be passed to the `ReviewManager#maybeFindFirst` method */
 export interface MaybeFindFirstReviewOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableReviewSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: ReviewSort | ReviewSort[] | null;
  /** Only return records matching these filters. */
  filter?: ReviewFilter | ReviewFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
};

/**
 * A manager for the review model with all the available operations for reading and writing to it.*/
export type ReviewManager = {
  readonly connection: GadgetConnection;

  findOne: {
      /**
       * Finds one review by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
       **/
      <Options extends FindOneReviewOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneReviewOptions>): PromiseOrLiveIterator<Options,ReviewRecord<Options["select"]>>;
      type: 'findOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultReviewSelection;
      namespace: null;
      optionsType: FindOneReviewOptions;
      selectionType: AvailableReviewSelection;
      schemaType: Query["review"];
    }
  maybeFindOne: {
      /**
       * Finds one review by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
       **/
      <Options extends MaybeFindOneReviewOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneReviewOptions>): PromiseOrLiveIterator<Options,ReviewRecord<Options["select"]> | null>;
      type: 'maybeFindOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: MaybeFindOneReviewOptions;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultReviewSelection;
      namespace: null;
      selectionType: AvailableReviewSelection;
      schemaType: Query["review"];
    }
  findMany: {
      /**
       * Finds many review. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindManyReviewsOptions>(options?: LimitToKnownKeys<Options, FindManyReviewsOptions>): PromiseOrLiveIterator<Options,GadgetRecordList<ReviewRecord<Options["select"]>>>;
      type: 'findMany';
      operationName: typeof pluralModelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: FindManyReviewsOptions;
      defaultSelection: typeof DefaultReviewSelection;
      namespace: null;
      selectionType: AvailableReviewSelection;
      schemaType: Query["review"];
    }
  findFirst: {
      /**
       * Finds the first matching review. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindFirstReviewOptions>(options?: LimitToKnownKeys<Options, FindFirstReviewOptions>): PromiseOrLiveIterator<Options,ReviewRecord<Options["select"]>>;
      type: 'findFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: FindFirstReviewOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultReviewSelection;
      namespace: null;
      selectionType: AvailableReviewSelection;
      schemaType: Query["review"];
    }
  maybeFindFirst: {
      /**
       * Finds the first matching review. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
       **/
      <Options extends MaybeFindFirstReviewOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstReviewOptions>): PromiseOrLiveIterator<Options,ReviewRecord<Options["select"]> | null>;
      type: 'maybeFindFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: MaybeFindFirstReviewOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultReviewSelection;
      namespace: null;
      selectionType: AvailableReviewSelection;
      schemaType: Query["review"];
    }
  findById: {
      /**
      * Finds one review by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
      **/
      <Options extends FindOneReviewOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneReviewOptions>): PromiseOrLiveIterator<Options,ReviewRecord<Options["select"]>>;
      type: 'findOne';
      operationName: typeof pluralModelApiIdentifier;
      findByField: 'id';
      findByVariableName: 'id';
      optionsType: FindOneReviewOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultReviewSelection;
      namespace: null;
      selectionType: AvailableReviewSelection;
      schemaType: Query["review"];
    }
  maybeFindById: {
      /**
      * Finds one review by its id. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
      **/
      <Options extends FindOneReviewOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneReviewOptions>): Promise<ReviewRecord<Options["select"]> | null>;
      type: 'maybeFindOne';
      operationName: typeof pluralModelApiIdentifier;
      findByField: 'id';
      findByVariableName: 'id';
      optionsType: FindOneReviewOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultReviewSelection;
      namespace: null;
      selectionType: AvailableReviewSelection;
      schemaType: Query["review"];
    }
  view: {
      (query: string, variables?: Record<string, unknown>): Promise<unknown>
      type: 'computedView';
      operationName: 'view';
      gqlFieldName: 'reviewGellyView';
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
 * A manager for the review model with all the available operations for reading and writing to it.*/
export const ReviewManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultReviewSelection,
  [
    {
      type: 'findOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: 'findMany',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: 'findFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: 'maybeFindFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: 'findOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'findById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'maybeFindById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultReviewSelection,
      namespace: null
    },
    {
      type: 'computedView',
      operationName: 'view',
      functionName: 'view',
      gqlFieldName: 'reviewGellyView',
      namespace: null,
      variables: {
        query: { type: 'String', required: true },
        args: { type: 'JSONObject' }
      }
    }
  ] as const
) as unknown as {
  // Gadget generates these model manager classes at runtime dynamically, which means there is no source code for the class. This is done to make the bundle size of the client as small as possible, avoiding a bunch of repeated source code in favour of one small builder function. The TypeScript types above document the exact interface of the constructed class.
  new(connection: GadgetConnection): ReviewManager;
};