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
  Booking,
  AvailableBookingSelection,
  BookingSort,
  BookingFilter
} from "../types.js";

import { buildModelManager } from "../builder.js";
import { AvailableSelection, AllFieldsSelected, DefaultSelection, Select, DeepFilterNever } from "../utils.js";

/**
* A type that holds only the selected fields (and nested fields) of booking. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedBookingOrDefault<Options extends Selectable<AvailableBookingSelection>> = DeepFilterNever<
    Select<
      Booking,
      DefaultSelection<
        AvailableBookingSelection,
        Options,
        typeof DefaultBookingSelection
      >
    >
  >;

/**
 * A type that represents a `GadgetRecord` type for booking.
 * It selects all fields of the model by default. If you want to represent a record type with a subset of fields, you could pass in an object in the `Selection` type parameter.
 *
 * @example
 * ```ts
 * const someFunction = (record: BookingRecord, recordWithName: BookingRecord<{ select: { name: true; } }>) => {
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
export type BookingRecord<Selection extends AvailableBookingSelection | undefined = typeof DefaultBookingSelection> = DeepFilterNever<
  GadgetRecord<
    SelectedBookingOrDefault<{
      select: Selection;
    }>
  >
>;

export const DefaultBookingSelection = {
     __typename: true,
     id: true,
     bookedById: true,
     createdAt: true,
     date: true,
     depositAmount: true,
     depositPaid: true,
     endTime: true,
     fullPaymentPaid: true,
     isActive: true,
     musicianId: true,
     notes: true,
     specialRequirements: true,
     startTime: true,
     status: true,
     totalAmount: true,
     updatedAt: true,
     venueId: true
   } as const;
const modelApiIdentifier = "booking" as const;
const pluralModelApiIdentifier = "bookings" as const;
/** Options that can be passed to the `BookingManager#findOne` method */
 export interface FindOneBookingOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableBookingSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
/** Options that can be passed to the `BookingManager#maybeFindOne` method */
 export interface MaybeFindOneBookingOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableBookingSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
/** Options that can be passed to the `BookingManager#findMany` method */
 export interface FindManyBookingsOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableBookingSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: BookingSort | BookingSort[] | null;
  /** Only return records matching these filters. */
  filter?: BookingFilter | BookingFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
};
/** Options that can be passed to the `BookingManager#findFirst` method */
 export interface FindFirstBookingOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableBookingSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: BookingSort | BookingSort[] | null;
  /** Only return records matching these filters. */
  filter?: BookingFilter | BookingFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
};
/** Options that can be passed to the `BookingManager#maybeFindFirst` method */
 export interface MaybeFindFirstBookingOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableBookingSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: BookingSort | BookingSort[] | null;
  /** Only return records matching these filters. */
  filter?: BookingFilter | BookingFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
};

/**
 * A manager for the booking model with all the available operations for reading and writing to it.*/
export type BookingManager = {
  readonly connection: GadgetConnection;

  findOne: {
      /**
       * Finds one booking by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
       **/
      <Options extends FindOneBookingOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneBookingOptions>): PromiseOrLiveIterator<Options,BookingRecord<Options["select"]>>;
      type: 'findOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultBookingSelection;
      namespace: null;
      optionsType: FindOneBookingOptions;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
    }
  maybeFindOne: {
      /**
       * Finds one booking by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
       **/
      <Options extends MaybeFindOneBookingOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneBookingOptions>): PromiseOrLiveIterator<Options,BookingRecord<Options["select"]> | null>;
      type: 'maybeFindOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: MaybeFindOneBookingOptions;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultBookingSelection;
      namespace: null;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
    }
  findMany: {
      /**
       * Finds many booking. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindManyBookingsOptions>(options?: LimitToKnownKeys<Options, FindManyBookingsOptions>): PromiseOrLiveIterator<Options,GadgetRecordList<BookingRecord<Options["select"]>>>;
      type: 'findMany';
      operationName: typeof pluralModelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: FindManyBookingsOptions;
      defaultSelection: typeof DefaultBookingSelection;
      namespace: null;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
    }
  findFirst: {
      /**
       * Finds the first matching booking. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindFirstBookingOptions>(options?: LimitToKnownKeys<Options, FindFirstBookingOptions>): PromiseOrLiveIterator<Options,BookingRecord<Options["select"]>>;
      type: 'findFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: FindFirstBookingOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultBookingSelection;
      namespace: null;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
    }
  maybeFindFirst: {
      /**
       * Finds the first matching booking. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
       **/
      <Options extends MaybeFindFirstBookingOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstBookingOptions>): PromiseOrLiveIterator<Options,BookingRecord<Options["select"]> | null>;
      type: 'maybeFindFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: MaybeFindFirstBookingOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultBookingSelection;
      namespace: null;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
    }
  findById: {
      /**
      * Finds one booking by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
      **/
      <Options extends FindOneBookingOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneBookingOptions>): PromiseOrLiveIterator<Options,BookingRecord<Options["select"]>>;
      type: 'findOne';
      operationName: typeof pluralModelApiIdentifier;
      findByField: 'id';
      findByVariableName: 'id';
      optionsType: FindOneBookingOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultBookingSelection;
      namespace: null;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
    }
  maybeFindById: {
      /**
      * Finds one booking by its id. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
      **/
      <Options extends FindOneBookingOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneBookingOptions>): Promise<BookingRecord<Options["select"]> | null>;
      type: 'maybeFindOne';
      operationName: typeof pluralModelApiIdentifier;
      findByField: 'id';
      findByVariableName: 'id';
      optionsType: FindOneBookingOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultBookingSelection;
      namespace: null;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
    }
  view: {
      (query: string, variables?: Record<string, unknown>): Promise<unknown>
      type: 'computedView';
      operationName: 'view';
      gqlFieldName: 'bookingGellyView';
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
 * A manager for the booking model with all the available operations for reading and writing to it.*/
export const BookingManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultBookingSelection,
  [
    {
      type: 'findOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: 'findMany',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: 'findFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: 'maybeFindFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: 'findOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'findById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'maybeFindById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: 'computedView',
      operationName: 'view',
      functionName: 'view',
      gqlFieldName: 'bookingGellyView',
      namespace: null,
      variables: {
        query: { type: 'String', required: true },
        args: { type: 'JSONObject' }
      }
    }
  ] as const
) as unknown as {
  // Gadget generates these model manager classes at runtime dynamically, which means there is no source code for the class. This is done to make the bundle size of the client as small as possible, avoiding a bunch of repeated source code in favour of one small builder function. The TypeScript types above document the exact interface of the constructed class.
  new(connection: GadgetConnection): BookingManager;
};