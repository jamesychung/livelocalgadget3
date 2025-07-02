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
  BookingFilter,
  Scalars,
  UpsertBookingInput
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
     eventId: true,
     fullPaymentPaid: true,
     isActive: true,
     musicianId: true,
     musicianPitch: true,
     notes: true,
     proposedRate: true,
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
export interface CreateBookingOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableBookingSelection;
};
export interface UpdateBookingOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableBookingSelection;
};
export interface UpsertBookingOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableBookingSelection;
};
/**
 * The return value from executing create on booking
 * Is a GadgetRecord of the model's type.
 **/
export type CreateBookingResult<Options extends CreateBookingOptions> = SelectedBookingOrDefault<Options> extends void ?
      void :
      GadgetRecord<SelectedBookingOrDefault<Options>>;
/**
 * The return value from executing update on booking
 * Is a GadgetRecord of the model's type.
 **/
export type UpdateBookingResult<Options extends UpdateBookingOptions> = SelectedBookingOrDefault<Options> extends void ?
      void :
      GadgetRecord<SelectedBookingOrDefault<Options>>;
/**
 * The fully-qualified, expanded form of the inputs for executing the upsert action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpsertBookingVariables = {
  on?: ((Scalars['String'] | null))[];
  booking?: UpsertBookingInput;
}
/**
 * The inputs for executing upsert on booking.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpsertBookingVariables = Omit<
     UpsertBookingInput,
     "on"
   > & {
     on?: ((Scalars['String'] | null))[];
   };
/**
 * The return value from executing upsert on booking
 *
 **/
export type UpsertBookingResult<Options extends UpsertBookingOptions> = SelectedBookingOrDefault<Options> extends void ?
      void :
      GadgetRecord<SelectedBookingOrDefault<Options>>;

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
  create: {
      /**
       * Executes the create actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const bookingRecord = await api.booking.create("1");
      **/
      <Options extends CreateBookingOptions>(
        id: string,
      
        options?: LimitToKnownKeys<Options, CreateBookingOptions>
      ): Promise<CreateBookingResult<Options>>;
      type: 'action';
      operationName: 'createBooking';
      operationReturnType: 'CreateBooking';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: true;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: { id: { required: true, type: 'GadgetID' } };
      variablesType: (
              { id: string }
              
            );
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [];
      hasReturnType: false;
      acceptsModelInput: false;
      hasCreateOrUpdateEffect: false;
      imports: [];
      optionsType: CreateBookingOptions;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
      defaultSelection: typeof DefaultBookingSelection;
    }
  bulkCreate: {
      /**
        * Executes the bulkCreate action with the given inputs.
        */
       <Options extends CreateBookingOptions>(
          ids: string[],
          options?: LimitToKnownKeys<Options, CreateBookingOptions>
       ): Promise<CreateBookingResult<Options>[]>
      type: 'action';
      operationName: 'bulkCreateBookings';
      isBulk: true;
      isDeleter: false;
      hasReturnType: false;
      acceptsModelInput: false;
      operatesWithRecordIdentity: true;
      singleActionFunctionName: 'create';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: CreateBookingOptions;
      namespace: null;
      variables: { ids: { required: true, type: '[GadgetID!]' } };
      variablesType: IDsList | undefined;
      paramOnlyVariables: [];
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
      defaultSelection: typeof DefaultBookingSelection;
    }
  update: {
      /**
       * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const bookingRecord = await api.booking.update("1");
      **/
      <Options extends UpdateBookingOptions>(
        id: string,
      
        options?: LimitToKnownKeys<Options, UpdateBookingOptions>
      ): Promise<UpdateBookingResult<Options>>;
      type: 'action';
      operationName: 'updateBooking';
      operationReturnType: 'UpdateBooking';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: true;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: { id: { required: true, type: 'GadgetID' } };
      variablesType: (
              { id: string }
              
            );
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [];
      hasReturnType: false;
      acceptsModelInput: false;
      hasCreateOrUpdateEffect: false;
      imports: [];
      optionsType: UpdateBookingOptions;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
      defaultSelection: typeof DefaultBookingSelection;
    }
  bulkUpdate: {
      /**
        * Executes the bulkUpdate action with the given inputs.
        */
       <Options extends UpdateBookingOptions>(
          ids: string[],
          options?: LimitToKnownKeys<Options, UpdateBookingOptions>
       ): Promise<UpdateBookingResult<Options>[]>
      type: 'action';
      operationName: 'bulkUpdateBookings';
      isBulk: true;
      isDeleter: false;
      hasReturnType: false;
      acceptsModelInput: false;
      operatesWithRecordIdentity: true;
      singleActionFunctionName: 'update';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: UpdateBookingOptions;
      namespace: null;
      variables: { ids: { required: true, type: '[GadgetID!]' } };
      variablesType: IDsList | undefined;
      paramOnlyVariables: [];
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
      defaultSelection: typeof DefaultBookingSelection;
    }
  upsert: {
      /**
       * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the flat style, all-params-together overload that most use cases should use.
      *
      * @example
      * * const result = await api.booking.upsert({
        *   bookedBy: {
        *     _link: "1",
        *   },
        *   date: "2025-07-01T00:00:00.000+00:00",
        *   depositAmount: 123,
        *   depositPaid: true,
        *   id: "1",
        * });
      **/
      <Options extends UpsertBookingOptions>(
      
        variables: UpsertBookingVariables,
        options?: LimitToKnownKeys<Options, UpsertBookingOptions>
      ): Promise<UpsertBookingResult<Options>>;
      /**
       * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.booking.upsert({
        *   booking: {
        *     bookedBy: {
        *       _link: "1",
        *     },
        *     date: "2025-07-01T00:00:00.000+00:00",
        *     depositAmount: 123,
        *     depositPaid: true,
        *     id: "1",
        *   },
        * });
      **/
      <Options extends UpsertBookingOptions>(
      
        variables: FullyQualifiedUpsertBookingVariables,
        options?: LimitToKnownKeys<Options, UpsertBookingOptions>
      ): Promise<UpsertBookingResult<Options>>;
      type: 'action';
      operationName: 'upsertBooking';
      operationReturnType: 'UpsertBooking';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: false;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: {
          on: { required: false, type: '[String!]' },
          booking: { required: false, type: 'UpsertBookingInput' }
        };
      variablesType: ((
               
               & (FullyQualifiedUpsertBookingVariables | UpsertBookingVariables)
             ) | undefined);
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [ 'on' ];
      hasReturnType: {
          '... on CreateBookingResult': { hasReturnType: false },
          '... on UpdateBookingResult': { hasReturnType: false }
        };
      acceptsModelInput: true;
      hasCreateOrUpdateEffect: true;
      imports: [ 'Scalars', 'UpsertBookingInput' ];
      optionsType: UpsertBookingOptions;
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
      defaultSelection: typeof DefaultBookingSelection;
    }
  bulkUpsert: {
      /**
        * Executes the bulkUpsert action with the given inputs.
        */
       <Options extends UpsertBookingOptions>(
          inputs: (FullyQualifiedUpsertBookingVariables | UpsertBookingVariables)[],
          options?: LimitToKnownKeys<Options, UpsertBookingOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkUpsertBookings';
      isBulk: true;
      isDeleter: false;
      hasReturnType: false;
      acceptsModelInput: true;
      operatesWithRecordIdentity: false;
      singleActionFunctionName: 'upsert';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: UpsertBookingOptions;
      namespace: null;
      variables: { inputs: { required: true, type: '[BulkUpsertBookingsInput!]' } };
      variablesType: (FullyQualifiedUpsertBookingVariables | UpsertBookingVariables)[];
      paramOnlyVariables: [ 'on' ];
      selectionType: AvailableBookingSelection;
      schemaType: Query["booking"];
      defaultSelection: typeof DefaultBookingSelection;
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
      type: 'action',
      operationName: 'createBooking',
      operationReturnType: 'CreateBooking',
      functionName: 'create',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { id: { required: true, type: 'GadgetID' } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultBookingSelection
    },
    {
      type: 'action',
      operationName: 'bulkCreateBookings',
      functionName: 'bulkCreate',
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: 'create',
      modelApiIdentifier: modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { ids: { required: true, type: '[GadgetID!]' } },
      paramOnlyVariables: [],
      defaultSelection: DefaultBookingSelection
    },
    {
      type: 'action',
      operationName: 'updateBooking',
      operationReturnType: 'UpdateBooking',
      functionName: 'update',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { id: { required: true, type: 'GadgetID' } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultBookingSelection
    },
    {
      type: 'action',
      operationName: 'bulkUpdateBookings',
      functionName: 'bulkUpdate',
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: 'update',
      modelApiIdentifier: modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { ids: { required: true, type: '[GadgetID!]' } },
      paramOnlyVariables: [],
      defaultSelection: DefaultBookingSelection
    },
    {
      type: 'action',
      operationName: 'upsertBooking',
      operationReturnType: 'UpsertBooking',
      functionName: 'upsert',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        on: { required: false, type: '[String!]' },
        booking: { required: false, type: 'UpsertBookingInput' }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [ 'on' ],
      hasReturnType: {
        '... on CreateBookingResult': { hasReturnType: false },
        '... on UpdateBookingResult': { hasReturnType: false }
      },
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultBookingSelection
    },
    {
      type: 'action',
      operationName: 'bulkUpsertBookings',
      functionName: 'bulkUpsert',
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: true,
      operatesWithRecordIdentity: false,
      singleActionFunctionName: 'upsert',
      modelApiIdentifier: modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: '[BulkUpsertBookingsInput!]' } },
      paramOnlyVariables: [ 'on' ],
      defaultSelection: DefaultBookingSelection
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