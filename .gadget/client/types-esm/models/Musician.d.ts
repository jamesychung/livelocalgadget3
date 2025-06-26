import { GadgetConnection, GadgetRecord, GadgetRecordList, LimitToKnownKeys, Selectable } from "@gadgetinc/api-client-core";
import { Query, IDsList, PromiseOrLiveIterator, Musician, AvailableMusicianSelection, MusicianSort, MusicianFilter, CreateMusicianInput, UpdateMusicianInput, Scalars, UpsertMusicianInput } from "../types.js";
import { DefaultSelection, Select, DeepFilterNever } from "../utils.js";
/**
* A type that holds only the selected fields (and nested fields) of musician. The present fields in the result type of this are dynamic based on the options to each call that uses it.
* The selected fields are sometimes given by the `Options` at `Options["select"]`, and if a selection isn't made in the options, we use the default selection from above.
*/
export type SelectedMusicianOrDefault<Options extends Selectable<AvailableMusicianSelection>> = DeepFilterNever<Select<Musician, DefaultSelection<AvailableMusicianSelection, Options, typeof DefaultMusicianSelection>>>;
/**
 * A type that represents a `GadgetRecord` type for musician.
 * It selects all fields of the model by default. If you want to represent a record type with a subset of fields, you could pass in an object in the `Selection` type parameter.
 *
 * @example
 * ```ts
 * const someFunction = (record: MusicianRecord, recordWithName: MusicianRecord<{ select: { name: true; } }>) => {
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
export type MusicianRecord<Selection extends AvailableMusicianSelection | undefined = typeof DefaultMusicianSelection> = DeepFilterNever<GadgetRecord<SelectedMusicianOrDefault<{
    select: Selection;
}>>>;
export declare const DefaultMusicianSelection: {
    readonly __typename: true;
    readonly id: true;
    readonly additionalPictures: true;
    readonly audio: true;
    readonly audioFiles: true;
    readonly availability: true;
    readonly bio: true;
    readonly city: true;
    readonly country: true;
    readonly createdAt: true;
    readonly email: true;
    readonly experience: true;
    readonly genres: true;
    readonly hourlyRate: true;
    readonly instruments: true;
    readonly isVerified: true;
    readonly location: true;
    readonly name: true;
    readonly profilePicture: true;
    readonly rating: true;
    readonly stageName: true;
    readonly updatedAt: true;
    readonly state: true;
    readonly genre: true;
    readonly isActive: true;
    readonly phone: true;
    readonly socialLinks: true;
    readonly totalGigs: true;
    readonly userId: true;
    readonly website: true;
    readonly yearsExperience: true;
};
declare const modelApiIdentifier: "musician";
declare const pluralModelApiIdentifier: "musicians";
/** Options that can be passed to the `MusicianManager#findOne` method */
export interface FindOneMusicianOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableMusicianSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `MusicianManager#maybeFindOne` method */
export interface MaybeFindOneMusicianOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableMusicianSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
}
/** Options that can be passed to the `MusicianManager#findMany` method */
export interface FindManyMusiciansOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableMusicianSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: MusicianSort | MusicianSort[] | null;
    /** Only return records matching these filters. */
    filter?: MusicianFilter | MusicianFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
    first?: number | null;
    last?: number | null;
    after?: string | null;
    before?: string | null;
}
/** Options that can be passed to the `MusicianManager#findFirst` method */
export interface FindFirstMusicianOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableMusicianSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: MusicianSort | MusicianSort[] | null;
    /** Only return records matching these filters. */
    filter?: MusicianFilter | MusicianFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
/** Options that can be passed to the `MusicianManager#maybeFindFirst` method */
export interface MaybeFindFirstMusicianOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableMusicianSelection;
    /** Run a realtime query instead of running the query only once. Returns an AsyncIterator of new results when the result changes on the backend. */
    live?: boolean;
    /** Return records sorted by these sorts */
    sort?: MusicianSort | MusicianSort[] | null;
    /** Only return records matching these filters. */
    filter?: MusicianFilter | MusicianFilter[] | null;
    /** Only return records matching this freeform search string */
    search?: string | null;
}
export interface CreateMusicianOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableMusicianSelection;
}
export interface UpdateMusicianOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableMusicianSelection;
}
export interface UpsertMusicianOptions {
    /** Select fields other than the defaults of the record to return */
    select?: AvailableMusicianSelection;
}
/**
 * The fully-qualified, expanded form of the inputs for executing the create action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedCreateMusicianVariables = {
    musician?: CreateMusicianInput;
};
/**
 * The inputs for executing create on musician.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type CreateMusicianVariables = CreateMusicianInput;
/**
 * The return value from executing create on musician
 *
 **/
export type CreateMusicianResult<Options extends CreateMusicianOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the update action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpdateMusicianVariables = {
    musician?: UpdateMusicianInput;
};
/**
 * The inputs for executing update on musician.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpdateMusicianVariables = UpdateMusicianInput;
/**
 * The return value from executing update on musician
 *
 **/
export type UpdateMusicianResult<Options extends UpdateMusicianOptions> = any;
/**
 * The return value from executing findFirst on musician
 *
 **/
export type FindFirstMusicianResult<Options extends FindFirstMusicianOptions> = any;
/**
 * The fully-qualified, expanded form of the inputs for executing the upsert action.
 * The flattened style should be preferred over this style, but for models with ambiguous API identifiers, this style can be used to remove any ambiguity.
 **/
export type FullyQualifiedUpsertMusicianVariables = {
    on?: ((Scalars['String'] | null))[];
    musician?: UpsertMusicianInput;
};
/**
 * The inputs for executing upsert on musician.
 * This is the flattened style of inputs, suitable for general use, and should be preferred.
 **/
export type UpsertMusicianVariables = Omit<UpsertMusicianInput, "on"> & {
    on?: ((Scalars['String'] | null))[];
};
/**
 * The return value from executing upsert on musician
 *
 **/
export type UpsertMusicianResult<Options extends UpsertMusicianOptions> = any;
/**
 * A manager for the musician model with all the available operations for reading and writing to it.*/
export type MusicianManager = {
    readonly connection: GadgetConnection;
    findOne: {
        /**
         * Finds one musician by ID. Returns a `Promise` that resolves to the record if found and rejects the promise if the record isn't found.
         **/
        <Options extends FindOneMusicianOptions>(id: string, options?: LimitToKnownKeys<Options, FindOneMusicianOptions>): PromiseOrLiveIterator<Options, MusicianRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultMusicianSelection;
        namespace: null;
        optionsType: FindOneMusicianOptions;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
    };
    maybeFindOne: {
        /**
         * Finds one musician by ID. Returns a `Promise` that resolves to the record if found and returns null otherwise.
         **/
        <Options extends MaybeFindOneMusicianOptions>(id: string, options?: LimitToKnownKeys<Options, MaybeFindOneMusicianOptions>): PromiseOrLiveIterator<Options, MusicianRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof modelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: MaybeFindOneMusicianOptions;
        findByVariableName: 'id';
        defaultSelection: typeof DefaultMusicianSelection;
        namespace: null;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
    };
    findMany: {
        /**
         * Finds many musician. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindManyMusiciansOptions>(options?: LimitToKnownKeys<Options, FindManyMusiciansOptions>): PromiseOrLiveIterator<Options, GadgetRecordList<MusicianRecord<Options["select"]>>>;
        type: 'findMany';
        operationName: typeof pluralModelApiIdentifier;
        modelApiIdentifier: typeof modelApiIdentifier;
        optionsType: FindManyMusiciansOptions;
        defaultSelection: typeof DefaultMusicianSelection;
        namespace: null;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
    };
    findFirst: {
        /**
         * Finds the first matching musician. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
         **/
        <Options extends FindFirstMusicianOptions>(options?: LimitToKnownKeys<Options, FindFirstMusicianOptions>): PromiseOrLiveIterator<Options, MusicianRecord<Options["select"]>>;
        type: 'findFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: FindFirstMusicianOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultMusicianSelection;
        namespace: null;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
    };
    maybeFindFirst: {
        /**
         * Finds the first matching musician. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
         **/
        <Options extends MaybeFindFirstMusicianOptions>(options?: LimitToKnownKeys<Options, MaybeFindFirstMusicianOptions>): PromiseOrLiveIterator<Options, MusicianRecord<Options["select"]> | null>;
        type: 'maybeFindFirst';
        operationName: typeof pluralModelApiIdentifier;
        optionsType: MaybeFindFirstMusicianOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultMusicianSelection;
        namespace: null;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
    };
    findById: {
        /**
        * Finds one musician by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
        **/
        <Options extends FindOneMusicianOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneMusicianOptions>): PromiseOrLiveIterator<Options, MusicianRecord<Options["select"]>>;
        type: 'findOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneMusicianOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultMusicianSelection;
        namespace: null;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
    };
    maybeFindById: {
        /**
        * Finds one musician by its id. Returns a Promise that resolves to the record if found and returns null if the record isn't found.
        **/
        <Options extends FindOneMusicianOptions>(value: string, options?: LimitToKnownKeys<Options, FindOneMusicianOptions>): Promise<MusicianRecord<Options["select"]> | null>;
        type: 'maybeFindOne';
        operationName: typeof pluralModelApiIdentifier;
        findByField: 'id';
        findByVariableName: 'id';
        optionsType: FindOneMusicianOptions;
        modelApiIdentifier: typeof modelApiIdentifier;
        defaultSelection: typeof DefaultMusicianSelection;
        namespace: null;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
    };
    create: {
        /**
         * Executes the create action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.musician.create({
          *   availability: {
          *     example: true,
          *     key: "value",
          *   },
          *   bio: "example value for bio",
          *   city: "example value for city",
          *   state: "example value for state",
          * });
        **/
        <Options extends CreateMusicianOptions>(variables: CreateMusicianVariables, options?: LimitToKnownKeys<Options, CreateMusicianOptions>): Promise<CreateMusicianResult<Options>>;
        /**
         * Executes the create action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.musician.create({
          *   musician: {
          *     availability: {
          *       example: true,
          *       key: "value",
          *     },
          *     bio: "example value for bio",
          *     city: "example value for city",
          *     state: "example value for state",
          *   },
          * });
        **/
        <Options extends CreateMusicianOptions>(variables: FullyQualifiedCreateMusicianVariables, options?: LimitToKnownKeys<Options, CreateMusicianOptions>): Promise<CreateMusicianResult<Options>>;
        type: 'action';
        operationName: 'createMusician';
        operationReturnType: 'CreateMusician';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: false;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            musician: {
                required: false;
                type: 'CreateMusicianInput';
            };
        };
        variablesType: (((FullyQualifiedCreateMusicianVariables | CreateMusicianVariables)) | undefined);
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: true;
        acceptsModelInput: true;
        hasCreateOrUpdateEffect: true;
        imports: ['CreateMusicianInput'];
        optionsType: CreateMusicianOptions;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
        defaultSelection: typeof DefaultMusicianSelection;
    };
    bulkCreate: {
        /**
          * Executes the bulkCreate action with the given inputs.
          */
        <Options extends CreateMusicianOptions>(inputs: (FullyQualifiedCreateMusicianVariables | CreateMusicianVariables)[], options?: LimitToKnownKeys<Options, CreateMusicianOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkCreateMusicians';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: true;
        operatesWithRecordIdentity: false;
        singleActionFunctionName: 'create';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: CreateMusicianOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkCreateMusiciansInput!]';
            };
        };
        variablesType: (FullyQualifiedCreateMusicianVariables | CreateMusicianVariables)[];
        paramOnlyVariables: [];
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
        defaultSelection: typeof DefaultMusicianSelection;
    };
    update: {
        /**
         * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.musician.update("1", {
          *   availability: {
          *     example: true,
          *     key: "value",
          *   },
          *   bio: "example value for bio",
          *   city: "example value for city",
          *   state: "example value for state",
          * });
        **/
        <Options extends UpdateMusicianOptions>(id: string, variables: UpdateMusicianVariables, options?: LimitToKnownKeys<Options, UpdateMusicianOptions>): Promise<UpdateMusicianResult<Options>>;
        /**
         * Executes the update actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.musician.update("1", {
          *   musician: {
          *     availability: {
          *       example: true,
          *       key: "value",
          *     },
          *     bio: "example value for bio",
          *     city: "example value for city",
          *     state: "example value for state",
          *   },
          * });
        **/
        <Options extends UpdateMusicianOptions>(id: string, variables: FullyQualifiedUpdateMusicianVariables, options?: LimitToKnownKeys<Options, UpdateMusicianOptions>): Promise<UpdateMusicianResult<Options>>;
        type: 'action';
        operationName: 'updateMusician';
        operationReturnType: 'UpdateMusician';
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
            musician: {
                required: false;
                type: 'UpdateMusicianInput';
            };
        };
        variablesType: ({
            id: string;
        } & (FullyQualifiedUpdateMusicianVariables | UpdateMusicianVariables));
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: [];
        hasReturnType: true;
        acceptsModelInput: true;
        hasCreateOrUpdateEffect: true;
        imports: ['UpdateMusicianInput'];
        optionsType: UpdateMusicianOptions;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
        defaultSelection: typeof DefaultMusicianSelection;
    };
    bulkUpdate: {
        /**
          * Executes the bulkUpdate action with the given inputs.
          */
        <Options extends UpdateMusicianOptions>(inputs: (FullyQualifiedUpdateMusicianVariables | UpdateMusicianVariables & {
            id: string;
        })[], options?: LimitToKnownKeys<Options, UpdateMusicianOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkUpdateMusicians';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: true;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'update';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: UpdateMusicianOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkUpdateMusiciansInput!]';
            };
        };
        variablesType: (FullyQualifiedUpdateMusicianVariables | UpdateMusicianVariables & {
            id: string;
        })[];
        paramOnlyVariables: [];
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
        defaultSelection: typeof DefaultMusicianSelection;
    };
    findFirst: {
        /**
         * Executes the findFirst actionon one record specified by `id`.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.musician.findFirst("1");
        **/
        <Options extends FindFirstMusicianOptions>(id: string, options?: LimitToKnownKeys<Options, FindFirstMusicianOptions>): Promise<FindFirstMusicianResult<Options>>;
        type: 'action';
        operationName: 'findFirstMusician';
        operationReturnType: 'FindFirstMusician';
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
        hasReturnType: true;
        acceptsModelInput: false;
        hasCreateOrUpdateEffect: false;
        imports: [];
        optionsType: FindFirstMusicianOptions;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
        defaultSelection: typeof DefaultMusicianSelection;
    };
    bulkFindFirst: {
        /**
          * Executes the bulkFindFirst action with the given inputs.
          */
        <Options extends FindFirstMusicianOptions>(ids: string[], options?: LimitToKnownKeys<Options, FindFirstMusicianOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkFindFirstMusicians';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: false;
        operatesWithRecordIdentity: true;
        singleActionFunctionName: 'findFirst';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: FindFirstMusicianOptions;
        namespace: null;
        variables: {
            ids: {
                required: true;
                type: '[GadgetID!]';
            };
        };
        variablesType: IDsList | undefined;
        paramOnlyVariables: [];
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
        defaultSelection: typeof DefaultMusicianSelection;
    };
    upsert: {
        /**
         * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the flat style, all-params-together overload that most use cases should use.
        *
        * @example
        * * const result = await api.musician.upsert({
          *   availability: {
          *     example: true,
          *     key: "value",
          *   },
          *   bio: "example value for bio",
          *   id: "1",
          *   state: "example value for state",
          * });
        **/
        <Options extends UpsertMusicianOptions>(variables: UpsertMusicianVariables, options?: LimitToKnownKeys<Options, UpsertMusicianOptions>): Promise<UpsertMusicianResult<Options>>;
        /**
         * Executes the upsert action.Accepts the parameters for the action via the `variables` argument.Runs the action and returns a Promise for the updated record.
        *
        * This is the fully qualified, nested api identifier style overload that should be used when there's an ambiguity between an action param and a model field.
        *
        * @example
        * * const result = await api.musician.upsert({
          *   musician: {
          *     availability: {
          *       example: true,
          *       key: "value",
          *     },
          *     bio: "example value for bio",
          *     id: "1",
          *     state: "example value for state",
          *   },
          * });
        **/
        <Options extends UpsertMusicianOptions>(variables: FullyQualifiedUpsertMusicianVariables, options?: LimitToKnownKeys<Options, UpsertMusicianOptions>): Promise<UpsertMusicianResult<Options>>;
        type: 'action';
        operationName: 'upsertMusician';
        operationReturnType: 'UpsertMusician';
        namespace: null;
        modelApiIdentifier: typeof modelApiIdentifier;
        operatesWithRecordIdentity: false;
        modelSelectionField: typeof modelApiIdentifier;
        isBulk: false;
        isDeleter: false;
        variables: {
            on: {
                required: false;
                type: '[String!]';
            };
            musician: {
                required: false;
                type: 'UpsertMusicianInput';
            };
        };
        variablesType: (((FullyQualifiedUpsertMusicianVariables | UpsertMusicianVariables)) | undefined);
        hasAmbiguousIdentifier: false;
        paramOnlyVariables: ['on'];
        hasReturnType: {
            '... on CreateMusicianResult': {
                hasReturnType: true;
            };
            '... on UpdateMusicianResult': {
                hasReturnType: true;
            };
        };
        acceptsModelInput: true;
        hasCreateOrUpdateEffect: true;
        imports: ['Scalars', 'UpsertMusicianInput'];
        optionsType: UpsertMusicianOptions;
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
        defaultSelection: typeof DefaultMusicianSelection;
    };
    bulkUpsert: {
        /**
          * Executes the bulkUpsert action with the given inputs.
          */
        <Options extends UpsertMusicianOptions>(inputs: (FullyQualifiedUpsertMusicianVariables | UpsertMusicianVariables)[], options?: LimitToKnownKeys<Options, UpsertMusicianOptions>): Promise<any[]>;
        type: 'action';
        operationName: 'bulkUpsertMusicians';
        isBulk: true;
        isDeleter: false;
        hasReturnType: true;
        acceptsModelInput: true;
        operatesWithRecordIdentity: false;
        singleActionFunctionName: 'upsert';
        modelApiIdentifier: typeof modelApiIdentifier;
        modelSelectionField: typeof pluralModelApiIdentifier;
        optionsType: UpsertMusicianOptions;
        namespace: null;
        variables: {
            inputs: {
                required: true;
                type: '[BulkUpsertMusiciansInput!]';
            };
        };
        variablesType: (FullyQualifiedUpsertMusicianVariables | UpsertMusicianVariables)[];
        paramOnlyVariables: ['on'];
        selectionType: AvailableMusicianSelection;
        schemaType: Query["musician"];
        defaultSelection: typeof DefaultMusicianSelection;
    };
    view: {
        (query: string, variables?: Record<string, unknown>): Promise<unknown>;
        type: 'computedView';
        operationName: 'view';
        gqlFieldName: 'musicianGellyView';
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
 * A manager for the musician model with all the available operations for reading and writing to it.*/
export declare const MusicianManager: {
    new (connection: GadgetConnection): MusicianManager;
};
export {};
