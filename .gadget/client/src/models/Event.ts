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
  Event,
  AvailableEventSelection,
  EventSort,
  EventFilter,
  CreateEventInput,
  UpdateEventInput,
  Scalars,
  UpsertEventInput
} from "../types.js";

import { buildModelManager } from "../builder.js";
import { AvailableSelection, AllFieldsSelected, DefaultSelection, Select, DeepFilterNever } from "../utils.js";

/**
* A type that holds only the selected fields (and nested fields) of event. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedEventOrDefault<Options extends Selectable<AvailableEventSelection>> = DeepFilterNever<
    Select<
      Event,
      DefaultSelection<
        AvailableEventSelection,
        Options,
        typeof DefaultEventSelection
      >
    >
  >;

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
export type EventRecord<Selection extends AvailableEventSelection | undefined = typeof DefaultEventSelection> = DeepFilterNever<
  GadgetRecord<
    SelectedEventOrDefault<{
      select: Selection;
    }>
  >
>;

export const DefaultEventSelection = {
     __typename: true,
     id: true,
     availableTickets: true,
     category: true,
     createdAt: true,
     createdById: true,
     date: true,
     description: true,
     endTime: true,
     equipment: true,
     genres: true,
     image: true,
     isActive: true,
     isPublic: true,
     isRecurring: true,
     musicianId: true,
     recurringDays: true,
     recurringEndDate: true,
     recurringInterval: true,
     recurringPattern: true,
     setlist: true,
     startTime: true,
     status: true,
     ticketPrice: true,
     ticketType: true,
     title: true,
     totalCapacity: true,
     updatedAt: true,
     venueId: true
   } as const;
const modelApiIdentifier = "event" as const;
const pluralModelApiIdentifier = "events" as const;
/** Options that can be passed to the `EventManager#findOne` method */
 export interface FindOneEventOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
/** Options that can be passed to the `EventManager#maybeFindOne` method */
 export interface MaybeFindOneEventOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventSelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
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
};
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
};
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
};
export interface CreateEventOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventSelection;
};
export interface UpdateEventOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventSelection;
};
export interface UpsertEventOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventSelection;
};
/**
 * The fully-qualified, expanded form of the inputs for executing the create action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedCreateEventVariables = {
  event?: CreateEventInput;
}
/**
 * The inputs for executing create on event.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type CreateEventVariables = CreateEventInput;
/**
 * The return value from executing create on event
 *
 **/
export type CreateEventResult<Options extends CreateEventOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the update action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpdateEventVariables = {
  event?: UpdateEventInput;
}
/**
 * The inputs for executing update on event.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpdateEventVariables = UpdateEventInput;
/**
 * The return value from executing update on event
 *
 **/
export type UpdateEventResult<Options extends UpdateEventOptions> = any;
/**
 * The return value from executing findFirst on event
 *
 **/
export type FindFirstEventResult<Options extends FindFirstEventOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the upsert action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpsertEventVariables = {
  on?: ((Scalars['String'] | null))[];
  event?: UpsertEventInput;
}
/**
 * The inputs for executing upsert on event.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpsertEventVariables = Omit<
     UpsertEventInput,
     "on"
   > & {
     on?: ((Scalars['String'] | null))[];
   };
/**
 * The return value from executing upsert on event
 *
 **/
export type UpsertEventResult<Options extends UpsertEventOptions> = any;

/**
 * A manager for the event model with all the available operations for reading and writing to it.*/
export type EventManager = {
  readonly connection: GadgetConnection;

  findOne: {
      /**
       * Finds one event by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
       **/
      <Options extends FindOneEventOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneEventOptions>): PromiseOrLiveIterator<Options,EventRecord<Options["select"]>>;
      type: 'findOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultEventSelection;
      namespace: null;
      optionsType: FindOneEventOptions;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
    }
  maybeFindOne: {
      /**
       * Finds one event by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
       **/
      <Options extends MaybeFindOneEventOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneEventOptions>): PromiseOrLiveIterator<Options,EventRecord<Options["select"]> | null>;
      type: 'maybeFindOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: MaybeFindOneEventOptions;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultEventSelection;
      namespace: null;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
    }
  findMany: {
      /**
       * Finds many event. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindManyEventsOptions>(options?: LimitToKnownKeys<Options, FindManyEventsOptions>): PromiseOrLiveIterator<Options,GadgetRecordList<EventRecord<Options["select"]>>>;
      type: 'findMany';
      operationName: typeof pluralModelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: FindManyEventsOptions;
      defaultSelection: typeof DefaultEventSelection;
      namespace: null;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
    }
  findFirst: {
      /**
       * Finds the first matching event. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindFirstEventOptions>(options?: LimitToKnownKeys<Options, FindFirstEventOptions>): PromiseOrLiveIterator<Options,EventRecord<Options["select"]>>;
      type: 'findFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: FindFirstEventOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultEventSelection;
      namespace: null;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
    }
  maybeFindFirst: {
      /**
       * Finds the first matching event. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
       **/
      <Options extends MaybeFindFirstEventOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstEventOptions>): PromiseOrLiveIterator<Options,EventRecord<Options["select"]> | null>;
      type: 'maybeFindFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: MaybeFindFirstEventOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultEventSelection;
      namespace: null;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
    }
  findById: {
      /**
      * Finds one event by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
      **/
      <Options extends FindOneEventOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneEventOptions>): PromiseOrLiveIterator<Options,EventRecord<Options["select"]>>;
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
    }
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
    }
  create: {
      /**
       * Executes the create action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the flat style, all-params-together overload that most use cases should use.
      *
      * @example
      * * const result = await api.event.create({
        *   availableTickets: 123,
        *   category: "example value for category",
        *   createdBy: {
        *     _link: "1",
        *   },
        *   date: "2025-06-01T00:00:00.000+00:00",
        *   description: "example value for description",
        * });
      **/
      <Options extends CreateEventOptions>(
      
        variables: CreateEventVariables,
        options?: LimitToKnownKeys<Options, CreateEventOptions>
      ): Promise<CreateEventResult<Options>>;
      /**
       * Executes the create action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.event.create({
        *   event: {
        *     availableTickets: 123,
        *     category: "example value for category",
        *     createdBy: {
        *       _link: "1",
        *     },
        *     date: "2025-06-01T00:00:00.000+00:00",
        *     description: "example value for description",
        *   },
        * });
      **/
      <Options extends CreateEventOptions>(
      
        variables: FullyQualifiedCreateEventVariables,
        options?: LimitToKnownKeys<Options, CreateEventOptions>
      ): Promise<CreateEventResult<Options>>;
      type: 'action';
      operationName: 'createEvent';
      operationReturnType: 'CreateEvent';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: false;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: { event: { required: false, type: 'CreateEventInput' } };
      variablesType: ((
               
               & (FullyQualifiedCreateEventVariables | CreateEventVariables)
             ) | undefined);
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [];
      hasReturnType: true;
      acceptsModelInput: true;
      hasCreateOrUpdateEffect: true;
      imports: [ 'CreateEventInput' ];
      optionsType: CreateEventOptions;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
      defaultSelection: typeof DefaultEventSelection;
    }
  bulkCreate: {
      /**
        * Executes the bulkCreate action with the given inputs.
        */
       <Options extends CreateEventOptions>(
          inputs: (FullyQualifiedCreateEventVariables | CreateEventVariables)[],
          options?: LimitToKnownKeys<Options, CreateEventOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkCreateEvents';
      isBulk: true;
      isDeleter: false;
      hasReturnType: true;
      acceptsModelInput: true;
      operatesWithRecordIdentity: false;
      singleActionFunctionName: 'create';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: CreateEventOptions;
      namespace: null;
      variables: { inputs: { required: true, type: '[BulkCreateEventsInput!]' } };
      variablesType: (FullyQualifiedCreateEventVariables | CreateEventVariables)[];
      paramOnlyVariables: [];
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
      defaultSelection: typeof DefaultEventSelection;
    }
  update: {
      /**
       * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the flat style, all-params-together overload that most use cases should use.
      *
      * @example
      * * const result = await api.event.update("1", {
        *   availableTickets: 123,
        *   category: "example value for category",
        *   createdBy: {
        *     _link: "1",
        *   },
        *   date: "2025-06-01T00:00:00.000+00:00",
        *   description: "example value for description",
        * });
      **/
      <Options extends UpdateEventOptions>(
        id: string,
        variables: UpdateEventVariables,
        options?: LimitToKnownKeys<Options, UpdateEventOptions>
      ): Promise<UpdateEventResult<Options>>;
      /**
       * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.event.update("1", {
        *   event: {
        *     availableTickets: 123,
        *     category: "example value for category",
        *     createdBy: {
        *       _link: "1",
        *     },
        *     date: "2025-06-01T00:00:00.000+00:00",
        *     description: "example value for description",
        *   },
        * });
      **/
      <Options extends UpdateEventOptions>(
        id: string,
        variables: FullyQualifiedUpdateEventVariables,
        options?: LimitToKnownKeys<Options, UpdateEventOptions>
      ): Promise<UpdateEventResult<Options>>;
      type: 'action';
      operationName: 'updateEvent';
      operationReturnType: 'UpdateEvent';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: true;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: {
          id: { required: true, type: 'GadgetID' },
          event: { required: false, type: 'UpdateEventInput' }
        };
      variablesType: (
              { id: string }
              & (FullyQualifiedUpdateEventVariables | UpdateEventVariables)
            );
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [];
      hasReturnType: true;
      acceptsModelInput: true;
      hasCreateOrUpdateEffect: true;
      imports: [ 'UpdateEventInput' ];
      optionsType: UpdateEventOptions;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
      defaultSelection: typeof DefaultEventSelection;
    }
  bulkUpdate: {
      /**
        * Executes the bulkUpdate action with the given inputs.
        */
       <Options extends UpdateEventOptions>(
          inputs: (FullyQualifiedUpdateEventVariables | UpdateEventVariables & { id: string })[],
          options?: LimitToKnownKeys<Options, UpdateEventOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkUpdateEvents';
      isBulk: true;
      isDeleter: false;
      hasReturnType: true;
      acceptsModelInput: true;
      operatesWithRecordIdentity: true;
      singleActionFunctionName: 'update';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: UpdateEventOptions;
      namespace: null;
      variables: { inputs: { required: true, type: '[BulkUpdateEventsInput!]' } };
      variablesType: (FullyQualifiedUpdateEventVariables | UpdateEventVariables & { id: string })[];
      paramOnlyVariables: [];
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
      defaultSelection: typeof DefaultEventSelection;
    }
  findFirst: {
      /**
       * Executes the findFirst actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.event.findFirst("1");
      **/
      <Options extends FindFirstEventOptions>(
        id: string,
      
        options?: LimitToKnownKeys<Options, FindFirstEventOptions>
      ): Promise<FindFirstEventResult<Options>>;
      type: 'action';
      operationName: 'findFirstEvent';
      operationReturnType: 'FindFirstEvent';
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
      hasReturnType: true;
      acceptsModelInput: false;
      hasCreateOrUpdateEffect: false;
      imports: [];
      optionsType: FindFirstEventOptions;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
      defaultSelection: typeof DefaultEventSelection;
    }
  bulkFindFirst: {
      /**
        * Executes the bulkFindFirst action with the given inputs.
        */
       <Options extends FindFirstEventOptions>(
          ids: string[],
          options?: LimitToKnownKeys<Options, FindFirstEventOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkFindFirstEvents';
      isBulk: true;
      isDeleter: false;
      hasReturnType: true;
      acceptsModelInput: false;
      operatesWithRecordIdentity: true;
      singleActionFunctionName: 'findFirst';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: FindFirstEventOptions;
      namespace: null;
      variables: { ids: { required: true, type: '[GadgetID!]' } };
      variablesType: IDsList | undefined;
      paramOnlyVariables: [];
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
      defaultSelection: typeof DefaultEventSelection;
    }
  upsert: {
      /**
       * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the flat style, all-params-together overload that most use cases should use.
      *
      * @example
      * * const result = await api.event.upsert({
        *   availableTickets: 123,
        *   category: "example value for category",
        *   createdBy: {
        *     _link: "1",
        *   },
        *   date: "2025-06-01T00:00:00.000+00:00",
        *   id: "1",
        * });
      **/
      <Options extends UpsertEventOptions>(
      
        variables: UpsertEventVariables,
        options?: LimitToKnownKeys<Options, UpsertEventOptions>
      ): Promise<UpsertEventResult<Options>>;
      /**
       * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.event.upsert({
        *   event: {
        *     availableTickets: 123,
        *     category: "example value for category",
        *     createdBy: {
        *       _link: "1",
        *     },
        *     date: "2025-06-01T00:00:00.000+00:00",
        *     id: "1",
        *   },
        * });
      **/
      <Options extends UpsertEventOptions>(
      
        variables: FullyQualifiedUpsertEventVariables,
        options?: LimitToKnownKeys<Options, UpsertEventOptions>
      ): Promise<UpsertEventResult<Options>>;
      type: 'action';
      operationName: 'upsertEvent';
      operationReturnType: 'UpsertEvent';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: false;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: {
          on: { required: false, type: '[String!]' },
          event: { required: false, type: 'UpsertEventInput' }
        };
      variablesType: ((
               
               & (FullyQualifiedUpsertEventVariables | UpsertEventVariables)
             ) | undefined);
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [ 'on' ];
      hasReturnType: {
          '... on CreateEventResult': { hasReturnType: true },
          '... on UpdateEventResult': { hasReturnType: true }
        };
      acceptsModelInput: true;
      hasCreateOrUpdateEffect: true;
      imports: [ 'Scalars', 'UpsertEventInput' ];
      optionsType: UpsertEventOptions;
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
      defaultSelection: typeof DefaultEventSelection;
    }
  bulkUpsert: {
      /**
        * Executes the bulkUpsert action with the given inputs.
        */
       <Options extends UpsertEventOptions>(
          inputs: (FullyQualifiedUpsertEventVariables | UpsertEventVariables)[],
          options?: LimitToKnownKeys<Options, UpsertEventOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkUpsertEvents';
      isBulk: true;
      isDeleter: false;
      hasReturnType: true;
      acceptsModelInput: true;
      operatesWithRecordIdentity: false;
      singleActionFunctionName: 'upsert';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: UpsertEventOptions;
      namespace: null;
      variables: { inputs: { required: true, type: '[BulkUpsertEventsInput!]' } };
      variablesType: (FullyQualifiedUpsertEventVariables | UpsertEventVariables)[];
      paramOnlyVariables: [ 'on' ];
      selectionType: AvailableEventSelection;
      schemaType: Query["event"];
      defaultSelection: typeof DefaultEventSelection;
    }
  view: {
      (query: string, variables?: Record<string, unknown>): Promise<unknown>
      type: 'computedView';
      operationName: 'view';
      gqlFieldName: 'eventGellyView';
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
 * A manager for the event model with all the available operations for reading and writing to it.*/
export const EventManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultEventSelection,
  [
    {
      type: 'findOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: 'findMany',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: 'findFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: 'maybeFindFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: 'findOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'findById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'maybeFindById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventSelection,
      namespace: null
    },
    {
      type: 'action',
      operationName: 'createEvent',
      operationReturnType: 'CreateEvent',
      functionName: 'create',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { event: { required: false, type: 'CreateEventInput' } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultEventSelection
    },
    {
      type: 'action',
      operationName: 'bulkCreateEvents',
      functionName: 'bulkCreate',
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: true,
      operatesWithRecordIdentity: false,
      singleActionFunctionName: 'create',
      modelApiIdentifier: modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: '[BulkCreateEventsInput!]' } },
      paramOnlyVariables: [],
      defaultSelection: DefaultEventSelection
    },
    {
      type: 'action',
      operationName: 'updateEvent',
      operationReturnType: 'UpdateEvent',
      functionName: 'update',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        id: { required: true, type: 'GadgetID' },
        event: { required: false, type: 'UpdateEventInput' }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultEventSelection
    },
    {
      type: 'action',
      operationName: 'bulkUpdateEvents',
      functionName: 'bulkUpdate',
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: true,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: 'update',
      modelApiIdentifier: modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: '[BulkUpdateEventsInput!]' } },
      paramOnlyVariables: [],
      defaultSelection: DefaultEventSelection
    },
    {
      type: 'action',
      operationName: 'findFirstEvent',
      operationReturnType: 'FindFirstEvent',
      functionName: 'findFirst',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { id: { required: true, type: 'GadgetID' } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultEventSelection
    },
    {
      type: 'action',
      operationName: 'bulkFindFirstEvents',
      functionName: 'bulkFindFirst',
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: 'findFirst',
      modelApiIdentifier: modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { ids: { required: true, type: '[GadgetID!]' } },
      paramOnlyVariables: [],
      defaultSelection: DefaultEventSelection
    },
    {
      type: 'action',
      operationName: 'upsertEvent',
      operationReturnType: 'UpsertEvent',
      functionName: 'upsert',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        on: { required: false, type: '[String!]' },
        event: { required: false, type: 'UpsertEventInput' }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [ 'on' ],
      hasReturnType: {
        '... on CreateEventResult': { hasReturnType: true },
        '... on UpdateEventResult': { hasReturnType: true }
      },
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultEventSelection
    },
    {
      type: 'action',
      operationName: 'bulkUpsertEvents',
      functionName: 'bulkUpsert',
      isBulk: true,
      isDeleter: false,
      hasReturnType: true,
      acceptsModelInput: true,
      operatesWithRecordIdentity: false,
      singleActionFunctionName: 'upsert',
      modelApiIdentifier: modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { inputs: { required: true, type: '[BulkUpsertEventsInput!]' } },
      paramOnlyVariables: [ 'on' ],
      defaultSelection: DefaultEventSelection
    },
    {
      type: 'computedView',
      operationName: 'view',
      functionName: 'view',
      gqlFieldName: 'eventGellyView',
      namespace: null,
      variables: {
        query: { type: 'String', required: true },
        args: { type: 'JSONObject' }
      }
    }
  ] as const
) as unknown as {
  // Gadget generates these model manager classes at runtime dynamically, which means there is no source code for the class. This is done to make the bundle size of the client as small as possible, avoiding a bunch of repeated source code in favour of one small builder function. The TypeScript types above document the exact interface of the constructed class.
  new(connection: GadgetConnection): EventManager;
};