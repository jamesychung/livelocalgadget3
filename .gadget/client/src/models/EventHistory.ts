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
  EventHistory,
  AvailableEventHistorySelection,
  EventHistorySort,
  EventHistoryFilter
} from "../types.js";

import { buildModelManager } from "../builder.js";
import { AvailableSelection, AllFieldsSelected, DefaultSelection, Select, DeepFilterNever } from "../utils.js";

/**
* A type that holds only the selected fields (and nested fields) of eventHistory. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedEventHistoryOrDefault<Options extends Selectable<AvailableEventHistorySelection>> = DeepFilterNever<
    Select<
      EventHistory,
      DefaultSelection<
        AvailableEventHistorySelection,
        Options,
        typeof DefaultEventHistorySelection
      >
    >
  >;

/**
 * A type that represents a `GadgetRecord` type for eventHistory.
 * It selects all fields of the model by default. If you want to represent a record type with a subset of fields, you could pass in an object in the `Selection` type parameter.
 *
 * @example
 * ```ts
 * const someFunction = (record: EventHistoryRecord, recordWithName: EventHistoryRecord<{ select: { name: true; } }>) => {
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
export type EventHistoryRecord<Selection extends AvailableEventHistorySelection | undefined = typeof DefaultEventHistorySelection> = DeepFilterNever<
  GadgetRecord<
    SelectedEventHistoryOrDefault<{
      select: Selection;
    }>
  >
>;

export const DefaultEventHistorySelection = {
     __typename: true,
     id: true,
     bookingId: true,
     changeType: true,
     changedById: true,
     context: true,
     createdAt: true,
     description: true,
     eventId: true,
     metadata: true,
     newValue: true,
     previousValue: true,
     updatedAt: true
   } as const;
const modelApiIdentifier = "eventHistory" as const;
const pluralModelApiIdentifier = "eventHistories" as const;
/** Options that can be passed to the `EventHistoryManager#findOne` method */
 export interface FindOneEventHistoryOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventHistorySelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
/** Options that can be passed to the `EventHistoryManager#maybeFindOne` method */
 export interface MaybeFindOneEventHistoryOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventHistorySelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
};
/** Options that can be passed to the `EventHistoryManager#findMany` method */
 export interface FindManyEventHistoriesOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventHistorySelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: EventHistorySort | EventHistorySort[] | null;
  /** Only return records matching these filters. */
  filter?: EventHistoryFilter | EventHistoryFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
  first?: number | null;
  last?: number | null;
  after?: string | null;
  before?: string | null;
};
/** Options that can be passed to the `EventHistoryManager#findFirst` method */
 export interface FindFirstEventHistoryOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventHistorySelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: EventHistorySort | EventHistorySort[] | null;
  /** Only return records matching these filters. */
  filter?: EventHistoryFilter | EventHistoryFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
};
/** Options that can be passed to the `EventHistoryManager#maybeFindFirst` method */
 export interface MaybeFindFirstEventHistoryOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventHistorySelection;
  /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
  live?: boolean;
  /** Return records sorted by these sorts */
  sort?: EventHistorySort | EventHistorySort[] | null;
  /** Only return records matching these filters. */
  filter?: EventHistoryFilter | EventHistoryFilter[] | null;
  /** Only return records matching this freeform search string */
  search?: string | null;
};
export interface CreateEventHistoryOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableEventHistorySelection;
};
/**
 * The return value from executing create on eventHistory
 * Is a GadgetRecord of the model's type.
 **/
export type CreateEventHistoryResult<Options extends CreateEventHistoryOptions> = SelectedEventHistoryOrDefault<Options> extends void ?
      void :
      GadgetRecord<SelectedEventHistoryOrDefault<Options>>;

/**
 * A manager for the eventHistory model with all the available operations for reading and writing to it.*/
export type EventHistoryManager = {
  readonly connection: GadgetConnection;

  findOne: {
      /**
       * Finds one eventHistory by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
       **/
      <Options extends FindOneEventHistoryOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneEventHistoryOptions>): PromiseOrLiveIterator<Options,EventHistoryRecord<Options["select"]>>;
      type: 'findOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultEventHistorySelection;
      namespace: null;
      optionsType: FindOneEventHistoryOptions;
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
    }
  maybeFindOne: {
      /**
       * Finds one eventHistory by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
       **/
      <Options extends MaybeFindOneEventHistoryOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneEventHistoryOptions>): PromiseOrLiveIterator<Options,EventHistoryRecord<Options["select"]> | null>;
      type: 'maybeFindOne';
      operationName: typeof modelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: MaybeFindOneEventHistoryOptions;
      findByVariableName: 'id';
      defaultSelection: typeof DefaultEventHistorySelection;
      namespace: null;
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
    }
  findMany: {
      /**
       * Finds many eventHistory. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindManyEventHistoriesOptions>(options?: LimitToKnownKeys<Options, FindManyEventHistoriesOptions>): PromiseOrLiveIterator<Options,GadgetRecordList<EventHistoryRecord<Options["select"]>>>;
      type: 'findMany';
      operationName: typeof pluralModelApiIdentifier;
      modelApiIdentifier: typeof modelApiIdentifier;
      optionsType: FindManyEventHistoriesOptions;
      defaultSelection: typeof DefaultEventHistorySelection;
      namespace: null;
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
    }
  findFirst: {
      /**
       * Finds the first matching eventHistory. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
       **/
      <Options extends FindFirstEventHistoryOptions>(options?: LimitToKnownKeys<Options, FindFirstEventHistoryOptions>): PromiseOrLiveIterator<Options,EventHistoryRecord<Options["select"]>>;
      type: 'findFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: FindFirstEventHistoryOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultEventHistorySelection;
      namespace: null;
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
    }
  maybeFindFirst: {
      /**
       * Finds the first matching eventHistory. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
       **/
      <Options extends MaybeFindFirstEventHistoryOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstEventHistoryOptions>): PromiseOrLiveIterator<Options,EventHistoryRecord<Options["select"]> | null>;
      type: 'maybeFindFirst';
      operationName: typeof pluralModelApiIdentifier;
      optionsType: MaybeFindFirstEventHistoryOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultEventHistorySelection;
      namespace: null;
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
    }
  findById: {
      /**
      * Finds one eventHistory by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
      **/
      <Options extends FindOneEventHistoryOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneEventHistoryOptions>): PromiseOrLiveIterator<Options,EventHistoryRecord<Options["select"]>>;
      type: 'findOne';
      operationName: typeof pluralModelApiIdentifier;
      findByField: 'id';
      findByVariableName: 'id';
      optionsType: FindOneEventHistoryOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultEventHistorySelection;
      namespace: null;
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
    }
  maybeFindById: {
      /**
      * Finds one eventHistory by its id. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
      **/
      <Options extends FindOneEventHistoryOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneEventHistoryOptions>): Promise<EventHistoryRecord<Options["select"]> | null>;
      type: 'maybeFindOne';
      operationName: typeof pluralModelApiIdentifier;
      findByField: 'id';
      findByVariableName: 'id';
      optionsType: FindOneEventHistoryOptions;
      modelApiIdentifier: typeof modelApiIdentifier;
      defaultSelection: typeof DefaultEventHistorySelection;
      namespace: null;
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
    }
  create: {
      /**
       * Executes the create actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const eventHistoryRecord = await api.eventHistory.create("1");
      **/
      <Options extends CreateEventHistoryOptions>(
        id: string,
      
        options?: LimitToKnownKeys<Options, CreateEventHistoryOptions>
      ): Promise<CreateEventHistoryResult<Options>>;
      type: 'action';
      operationName: 'createEventHistory';
      operationReturnType: 'CreateEventHistory';
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
      optionsType: CreateEventHistoryOptions;
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
      defaultSelection: typeof DefaultEventHistorySelection;
    }
  bulkCreate: {
      /**
        * Executes the bulkCreate action with the given inputs.
        */
       <Options extends CreateEventHistoryOptions>(
          ids: string[],
          options?: LimitToKnownKeys<Options, CreateEventHistoryOptions>
       ): Promise<CreateEventHistoryResult<Options>[]>
      type: 'action';
      operationName: 'bulkCreateEventHistories';
      isBulk: true;
      isDeleter: false;
      hasReturnType: false;
      acceptsModelInput: false;
      operatesWithRecordIdentity: true;
      singleActionFunctionName: 'create';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: CreateEventHistoryOptions;
      namespace: null;
      variables: { ids: { required: true, type: '[GadgetID!]' } };
      variablesType: IDsList | undefined;
      paramOnlyVariables: [];
      selectionType: AvailableEventHistorySelection;
      schemaType: Query["eventHistory"];
      defaultSelection: typeof DefaultEventHistorySelection;
    }
  view: {
      (query: string, variables?: Record<string, unknown>): Promise<unknown>
      type: 'computedView';
      operationName: 'view';
      gqlFieldName: 'eventHistoryGellyView';
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
 * A manager for the eventHistory model with all the available operations for reading and writing to it.*/
export const EventHistoryManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultEventHistorySelection,
  [
    {
      type: 'findOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultEventHistorySelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: modelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      findByVariableName: 'id',
      defaultSelection: DefaultEventHistorySelection,
      namespace: null
    },
    {
      type: 'findMany',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventHistorySelection,
      namespace: null
    },
    {
      type: 'findFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventHistorySelection,
      namespace: null
    },
    {
      type: 'maybeFindFirst',
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventHistorySelection,
      namespace: null
    },
    {
      type: 'findOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'findById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventHistorySelection,
      namespace: null
    },
    {
      type: 'maybeFindOne',
      operationName: pluralModelApiIdentifier,
      functionName: 'maybeFindById',
      findByField: 'id',
      findByVariableName: 'id',
      modelApiIdentifier: modelApiIdentifier,
      defaultSelection: DefaultEventHistorySelection,
      namespace: null
    },
    {
      type: 'action',
      operationName: 'createEventHistory',
      operationReturnType: 'CreateEventHistory',
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
      defaultSelection: DefaultEventHistorySelection
    },
    {
      type: 'action',
      operationName: 'bulkCreateEventHistories',
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
      defaultSelection: DefaultEventHistorySelection
    },
    {
      type: 'computedView',
      operationName: 'view',
      functionName: 'view',
      gqlFieldName: 'eventHistoryGellyView',
      namespace: null,
      variables: {
        query: { type: 'String', required: true },
        args: { type: 'JSONObject' }
      }
    }
  ] as const
) as unknown as {
  // Gadget generates these model manager classes at runtime dynamically, which means there is no source code for the class. This is done to make the bundle size of the client as small as possible, avoiding a bunch of repeated source code in favour of one small builder function. The TypeScript types above document the exact interface of the constructed class.
  new(connection: GadgetConnection): EventHistoryManager;
};