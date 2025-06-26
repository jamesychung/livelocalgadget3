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
  VenueFilter,
  CreateVenueInput,
  UpdateVenueInput,
  Scalars,
  UpsertVenueInput
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
     additionalPictures: true,
     address: true,
     amenities: true,
     capacity: true,
     city: true,
     country: true,
     createdAt: true,
     email: true,
     genres: true,
     hours: true,
     isVerified: true,
     name: true,
     ownerId: true,
     priceRange: true,
     profilePicture: true,
     rating: true,
     type: true,
     updatedAt: true,
     state: true,
     description: true,
     isActive: true,
     phone: true,
     socialLinks: true,
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
export interface CreateVenueOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableVenueSelection;
};
export interface UpdateVenueOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableVenueSelection;
};
export interface UpsertVenueOptions {
  /** Select fields other than the defaults of the record to return */
  select?: AvailableVenueSelection;
};
/**
 * The fully-qualified, expanded form of the inputs for executing the create action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedCreateVenueVariables = {
  venue?: CreateVenueInput;
}
/**
 * The inputs for executing create on venue.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type CreateVenueVariables = CreateVenueInput;
/**
 * The return value from executing create on venue
 *
 **/
export type CreateVenueResult<Options extends CreateVenueOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the update action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpdateVenueVariables = {
  venue?: UpdateVenueInput;
}
/**
 * The inputs for executing update on venue.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpdateVenueVariables = UpdateVenueInput;
/**
 * The return value from executing update on venue
 *
 **/
export type UpdateVenueResult<Options extends UpdateVenueOptions> = any;
/**
 * The return value from executing findFirst on venue
 *
 **/
export type FindFirstVenueResult<Options extends FindFirstVenueOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the upsert action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpsertVenueVariables = {
  on?: ((Scalars['String'] | null))[];
  venue?: UpsertVenueInput;
}
/**
 * The inputs for executing upsert on venue.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpsertVenueVariables = Omit<
     UpsertVenueInput,
     "on"
   > & {
     on?: ((Scalars['String'] | null))[];
   };
/**
 * The return value from executing upsert on venue
 *
 **/
export type UpsertVenueResult<Options extends UpsertVenueOptions> = any;

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
  create: {
      /**
       * Executes the create action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the flat style, all-params-together overload that most use cases should use.
      *
      * @example
      * * const result = await api.venue.create({
        *   additionalPictures: {
        *     example: true,
        *     key: "value",
        *   },
        *   address: "example value for address",
        *   amenities: {
        *     example: true,
        *     key: "value",
        *   },
        *   state: "example value for state",
        * });
      **/
      <Options extends CreateVenueOptions>(
      
        variables: CreateVenueVariables,
        options?: LimitToKnownKeys<Options, CreateVenueOptions>
      ): Promise<CreateVenueResult<Options>>;
      /**
       * Executes the create action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.venue.create({
        *   venue: {
        *     additionalPictures: {
        *       example: true,
        *       key: "value",
        *     },
        *     address: "example value for address",
        *     amenities: {
        *       example: true,
        *       key: "value",
        *     },
        *     state: "example value for state",
        *   },
        * });
      **/
      <Options extends CreateVenueOptions>(
      
        variables: FullyQualifiedCreateVenueVariables,
        options?: LimitToKnownKeys<Options, CreateVenueOptions>
      ): Promise<CreateVenueResult<Options>>;
      type: 'action';
      operationName: 'createVenue';
      operationReturnType: 'CreateVenue';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: false;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: { venue: { required: false, type: 'CreateVenueInput' } };
      variablesType: ((
               
               & (FullyQualifiedCreateVenueVariables | CreateVenueVariables)
             ) | undefined);
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [];
      hasReturnType: true;
      acceptsModelInput: true;
      hasCreateOrUpdateEffect: true;
      imports: [ 'CreateVenueInput' ];
      optionsType: CreateVenueOptions;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
      defaultSelection: typeof DefaultVenueSelection;
    }
  bulkCreate: {
      /**
        * Executes the bulkCreate action with the given inputs.
        */
       <Options extends CreateVenueOptions>(
          inputs: (FullyQualifiedCreateVenueVariables | CreateVenueVariables)[],
          options?: LimitToKnownKeys<Options, CreateVenueOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkCreateVenues';
      isBulk: true;
      isDeleter: false;
      hasReturnType: true;
      acceptsModelInput: true;
      operatesWithRecordIdentity: false;
      singleActionFunctionName: 'create';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: CreateVenueOptions;
      namespace: null;
      variables: { inputs: { required: true, type: '[BulkCreateVenuesInput!]' } };
      variablesType: (FullyQualifiedCreateVenueVariables | CreateVenueVariables)[];
      paramOnlyVariables: [];
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
      defaultSelection: typeof DefaultVenueSelection;
    }
  update: {
      /**
       * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the flat style, all-params-together overload that most use cases should use.
      *
      * @example
      * * const result = await api.venue.update("1", {
        *   additionalPictures: {
        *     example: true,
        *     key: "value",
        *   },
        *   address: "example value for address",
        *   amenities: {
        *     example: true,
        *     key: "value",
        *   },
        *   state: "example value for state",
        * });
      **/
      <Options extends UpdateVenueOptions>(
        id: string,
        variables: UpdateVenueVariables,
        options?: LimitToKnownKeys<Options, UpdateVenueOptions>
      ): Promise<UpdateVenueResult<Options>>;
      /**
       * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.venue.update("1", {
        *   venue: {
        *     additionalPictures: {
        *       example: true,
        *       key: "value",
        *     },
        *     address: "example value for address",
        *     amenities: {
        *       example: true,
        *       key: "value",
        *     },
        *     state: "example value for state",
        *   },
        * });
      **/
      <Options extends UpdateVenueOptions>(
        id: string,
        variables: FullyQualifiedUpdateVenueVariables,
        options?: LimitToKnownKeys<Options, UpdateVenueOptions>
      ): Promise<UpdateVenueResult<Options>>;
      type: 'action';
      operationName: 'updateVenue';
      operationReturnType: 'UpdateVenue';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: true;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: {
          id: { required: true, type: 'GadgetID' },
          venue: { required: false, type: 'UpdateVenueInput' }
        };
      variablesType: (
              { id: string }
              & (FullyQualifiedUpdateVenueVariables | UpdateVenueVariables)
            );
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [];
      hasReturnType: true;
      acceptsModelInput: true;
      hasCreateOrUpdateEffect: true;
      imports: [ 'UpdateVenueInput' ];
      optionsType: UpdateVenueOptions;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
      defaultSelection: typeof DefaultVenueSelection;
    }
  bulkUpdate: {
      /**
        * Executes the bulkUpdate action with the given inputs.
        */
       <Options extends UpdateVenueOptions>(
          inputs: (FullyQualifiedUpdateVenueVariables | UpdateVenueVariables & { id: string })[],
          options?: LimitToKnownKeys<Options, UpdateVenueOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkUpdateVenues';
      isBulk: true;
      isDeleter: false;
      hasReturnType: true;
      acceptsModelInput: true;
      operatesWithRecordIdentity: true;
      singleActionFunctionName: 'update';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: UpdateVenueOptions;
      namespace: null;
      variables: { inputs: { required: true, type: '[BulkUpdateVenuesInput!]' } };
      variablesType: (FullyQualifiedUpdateVenueVariables | UpdateVenueVariables & { id: string })[];
      paramOnlyVariables: [];
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
      defaultSelection: typeof DefaultVenueSelection;
    }
  findFirst: {
      /**
       * Executes the findFirst actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.venue.findFirst("1");
      **/
      <Options extends FindFirstVenueOptions>(
        id: string,
      
        options?: LimitToKnownKeys<Options, FindFirstVenueOptions>
      ): Promise<FindFirstVenueResult<Options>>;
      type: 'action';
      operationName: 'findFirstVenue';
      operationReturnType: 'FindFirstVenue';
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
      optionsType: FindFirstVenueOptions;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
      defaultSelection: typeof DefaultVenueSelection;
    }
  bulkFindFirst: {
      /**
        * Executes the bulkFindFirst action with the given inputs.
        */
       <Options extends FindFirstVenueOptions>(
          ids: string[],
          options?: LimitToKnownKeys<Options, FindFirstVenueOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkFindFirstVenues';
      isBulk: true;
      isDeleter: false;
      hasReturnType: true;
      acceptsModelInput: false;
      operatesWithRecordIdentity: true;
      singleActionFunctionName: 'findFirst';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: FindFirstVenueOptions;
      namespace: null;
      variables: { ids: { required: true, type: '[GadgetID!]' } };
      variablesType: IDsList | undefined;
      paramOnlyVariables: [];
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
      defaultSelection: typeof DefaultVenueSelection;
    }
  upsert: {
      /**
       * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the flat style, all-params-together overload that most use cases should use.
      *
      * @example
      * * const result = await api.venue.upsert({
        *   additionalPictures: {
        *     example: true,
        *     key: "value",
        *   },
        *   address: "example value for address",
        *   amenities: {
        *     example: true,
        *     key: "value",
        *   },
        *   id: "1",
        *   state: "example value for state",
        * });
      **/
      <Options extends UpsertVenueOptions>(
      
        variables: UpsertVenueVariables,
        options?: LimitToKnownKeys<Options, UpsertVenueOptions>
      ): Promise<UpsertVenueResult<Options>>;
      /**
       * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
      *
      * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
      *
      * @example
      * * const result = await api.venue.upsert({
        *   venue: {
        *     additionalPictures: {
        *       example: true,
        *       key: "value",
        *     },
        *     address: "example value for address",
        *     amenities: {
        *       example: true,
        *       key: "value",
        *     },
        *     id: "1",
        *     state: "example value for state",
        *   },
        * });
      **/
      <Options extends UpsertVenueOptions>(
      
        variables: FullyQualifiedUpsertVenueVariables,
        options?: LimitToKnownKeys<Options, UpsertVenueOptions>
      ): Promise<UpsertVenueResult<Options>>;
      type: 'action';
      operationName: 'upsertVenue';
      operationReturnType: 'UpsertVenue';
      namespace: null;
      modelApiIdentifier: typeof modelApiIdentifier;
      operatesWithRecordIdentity: false;
      modelSelectionField: typeof modelApiIdentifier;
      isBulk: false;
      isDeleter: false;
      variables: {
          on: { required: false, type: '[String!]' },
          venue: { required: false, type: 'UpsertVenueInput' }
        };
      variablesType: ((
               
               & (FullyQualifiedUpsertVenueVariables | UpsertVenueVariables)
             ) | undefined);
      hasAmbiguousIdentifier: false;
      paramOnlyVariables: [ 'on' ];
      hasReturnType: {
          '... on CreateVenueResult': { hasReturnType: true },
          '... on UpdateVenueResult': { hasReturnType: true }
        };
      acceptsModelInput: true;
      hasCreateOrUpdateEffect: true;
      imports: [ 'Scalars', 'UpsertVenueInput' ];
      optionsType: UpsertVenueOptions;
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
      defaultSelection: typeof DefaultVenueSelection;
    }
  bulkUpsert: {
      /**
        * Executes the bulkUpsert action with the given inputs.
        */
       <Options extends UpsertVenueOptions>(
          inputs: (FullyQualifiedUpsertVenueVariables | UpsertVenueVariables)[],
          options?: LimitToKnownKeys<Options, UpsertVenueOptions>
       ): Promise<any[]>
      type: 'action';
      operationName: 'bulkUpsertVenues';
      isBulk: true;
      isDeleter: false;
      hasReturnType: true;
      acceptsModelInput: true;
      operatesWithRecordIdentity: false;
      singleActionFunctionName: 'upsert';
      modelApiIdentifier: typeof modelApiIdentifier;
      modelSelectionField: typeof pluralModelApiIdentifier;
      optionsType: UpsertVenueOptions;
      namespace: null;
      variables: { inputs: { required: true, type: '[BulkUpsertVenuesInput!]' } };
      variablesType: (FullyQualifiedUpsertVenueVariables | UpsertVenueVariables)[];
      paramOnlyVariables: [ 'on' ];
      selectionType: AvailableVenueSelection;
      schemaType: Query["venue"];
      defaultSelection: typeof DefaultVenueSelection;
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
      type: 'action',
      operationName: 'createVenue',
      operationReturnType: 'CreateVenue',
      functionName: 'create',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { venue: { required: false, type: 'CreateVenueInput' } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultVenueSelection
    },
    {
      type: 'action',
      operationName: 'bulkCreateVenues',
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
      variables: { inputs: { required: true, type: '[BulkCreateVenuesInput!]' } },
      paramOnlyVariables: [],
      defaultSelection: DefaultVenueSelection
    },
    {
      type: 'action',
      operationName: 'updateVenue',
      operationReturnType: 'UpdateVenue',
      functionName: 'update',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        id: { required: true, type: 'GadgetID' },
        venue: { required: false, type: 'UpdateVenueInput' }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: true,
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultVenueSelection
    },
    {
      type: 'action',
      operationName: 'bulkUpdateVenues',
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
      variables: { inputs: { required: true, type: '[BulkUpdateVenuesInput!]' } },
      paramOnlyVariables: [],
      defaultSelection: DefaultVenueSelection
    },
    {
      type: 'action',
      operationName: 'findFirstVenue',
      operationReturnType: 'FindFirstVenue',
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
      defaultSelection: DefaultVenueSelection
    },
    {
      type: 'action',
      operationName: 'bulkFindFirstVenues',
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
      defaultSelection: DefaultVenueSelection
    },
    {
      type: 'action',
      operationName: 'upsertVenue',
      operationReturnType: 'UpsertVenue',
      functionName: 'upsert',
      namespace: null,
      modelApiIdentifier: modelApiIdentifier,
      operatesWithRecordIdentity: false,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: {
        on: { required: false, type: '[String!]' },
        venue: { required: false, type: 'UpsertVenueInput' }
      },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [ 'on' ],
      hasReturnType: {
        '... on CreateVenueResult': { hasReturnType: true },
        '... on UpdateVenueResult': { hasReturnType: true }
      },
      acceptsModelInput: true,
      hasCreateOrUpdateEffect: true,
      defaultSelection: DefaultVenueSelection
    },
    {
      type: 'action',
      operationName: 'bulkUpsertVenues',
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
      variables: { inputs: { required: true, type: '[BulkUpsertVenuesInput!]' } },
      paramOnlyVariables: [ 'on' ],
      defaultSelection: DefaultVenueSelection
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