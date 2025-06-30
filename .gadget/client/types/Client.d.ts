import type { OperationContext } from "@urql/core";
import { GadgetConnection, GadgetTransaction, InternalModelManager, ActionFunctionMetadata, GlobalActionFunction, BackgroundActionHandle } from "@gadgetinc/api-client-core";
import type { ClientOptions as ApiClientOptions, AnyClient, EnqueueBackgroundActionOptions, AnyActionFunction } from '@gadgetinc/api-client-core';
import type { DocumentNode } from 'graphql';
import { BookingManager } from "./models/Booking.js";
import { EventManager } from "./models/Event.js";
import { MusicianManager } from "./models/Musician.js";
import { ReviewManager } from "./models/Review.js";
import { VenueManager } from "./models/Venue.js";
import { UserManager } from "./models/User.js";
import { SessionManager } from "./models/Session.js";
import { CurrentSessionManager } from "./models/CurrentSession.js";
import { EventHistoryManager } from "./models/EventHistory.js";
import { SeedNamespace } from "./namespaces/seed.js";
export { DefaultBookingSelection, type BookingRecord } from "./models/Booking.js";
export { DefaultEventSelection, type EventRecord } from "./models/Event.js";
export { DefaultMusicianSelection, type MusicianRecord } from "./models/Musician.js";
export { DefaultReviewSelection, type ReviewRecord } from "./models/Review.js";
export { DefaultVenueSelection, type VenueRecord } from "./models/Venue.js";
export { DefaultUserSelection, type UserRecord } from "./models/User.js";
export { DefaultSessionSelection, type SessionRecord } from "./models/Session.js";
export { DefaultEventHistorySelection, type EventHistoryRecord } from "./models/EventHistory.js";
type ClientOptions = Omit<ApiClientOptions, "environment"> & {
    environment?: string;
};
type AllOptionalVariables<T> = Partial<T> extends T ? object : never;
export type InternalModelManagers = {
    /** The internal API model manager for the booking model */
    booking: InternalModelManager;
    /** The internal API model manager for the event model */
    event: InternalModelManager;
    /** The internal API model manager for the musician model */
    musician: InternalModelManager;
    /** The internal API model manager for the review model */
    review: InternalModelManager;
    /** The internal API model manager for the venue model */
    venue: InternalModelManager;
    /** The internal API model manager for the user model */
    user: InternalModelManager;
    /** The internal API model manager for the session model */
    session: InternalModelManager;
    /** The internal API model manager for the eventHistory model */
    eventHistory: InternalModelManager;
    seed: {};
};
/**
 * Function type for the inline view execution function.
 * Includes overloads for all known instances collected from call sites.
 **/
type InlineViewFunction = {
    (query: string, variables?: Record<string, unknown>): Promise<unknown>;
};
/**
 * Root object used for interacting with the livelocalgadget6 API. `Livelocalgadget6Client` has `query` and `mutation` functions for executing raw GraphQL queries and mutations, as well as `ModelManager` objects for manipulating models with a JavaScript API. `Livelocalgadget6Client` also has a `fetch` function for making raw requests to your backend.
 * */
export declare class Livelocalgadget6Client implements AnyClient {
    readonly options?: ClientOptions | undefined;
    connection: GadgetConnection;
    /** Executes the sendBookingEmails global action. */
    sendBookingEmails: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "sendBookingEmails";
        operationReturnType: "SendBookingEmails";
        namespace: null;
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes the sendEmail global action. */
    sendEmail: {
        (): Promise<any>;
        type: "globalAction";
        operationName: "sendEmail";
        operationReturnType: "SendEmail";
        namespace: null;
        typesImports: [];
        variables: {};
        variablesType: Record<string, never>;
    };
    /** Executes an inline computed view. */
    view: InlineViewFunction;
    booking: BookingManager;
    event: EventManager;
    musician: MusicianManager;
    review: ReviewManager;
    venue: VenueManager;
    user: UserManager;
    session: SessionManager;
    currentSession: CurrentSessionManager;
    eventHistory: EventHistoryManager;
    seed: SeedNamespace;
    /**
    * Namespaced object for accessing models via the Gadget internal APIs, which provide lower level and higher privileged operations directly against the database. Useful for maintenance operations like migrations or correcting broken data, and for implementing the high level actions.
    *
    * Returns an object of model API identifiers to `InternalModelManager` objects.
    *
    * Example:
    * `api.internal.user.findOne(...)`
    */
    internal: InternalModelManagers;
    /**
     * The list of environments with a customized API root endpoint
     */
    apiRoots: Record<string, string>;
    applicationId: string;
    environment: string;
    constructor(options?: ClientOptions | undefined);
    /**
     * Returns a new Client instance that will call the Gadget API as the application's admin user.
     * This can only be used for API clients using internal authentication.
     * @returns {Livelocalgadget6Client} A new Livelocalgadget6Client instance with admin authentication
     */
    get actAsAdmin(): Livelocalgadget6Client;
    /**
     * Returns a new Livelocalgadget6Client instance that will call the Gadget API as with the permission of the current session.
     * This can only be used for API clients using internal authentication.
     * @returns {Livelocalgadget6Client} A new Livelocalgadget6Client instance with session authentication
     */
    get actAsSession(): Livelocalgadget6Client;
    /** Run an arbitrary GraphQL query. */
    query<T = any>(graphQL: string | DocumentNode, variables?: Record<string, any>, options?: Partial<OperationContext>): Promise<T>;
    /** Run an arbitrary GraphQL mutation. */
    mutate<T = any>(graphQL: string | DocumentNode, variables?: Record<string, any>, options?: Partial<OperationContext>): Promise<T>;
    /** Start a transaction against the Gadget backend which will atomically commit (or rollback). */
    transaction: <T>(callback: (transaction: GadgetTransaction) => Promise<T>) => Promise<T>;
    /**
     * `fetch` function that works the same as the built-in `fetch` function, but automatically passes authentication information for this API client.
     *
     * @example
     * await api.fetch("https://myapp--development.gadget.app/foo/bar");
     *
     * @example
     * // fetch a relative URL from the endpoint this API client is configured to fetch from
     * await api.fetch("/foo/bar");
     **/
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    /**
    * Get a new direct upload token for file uploads to directly to cloud storage.
    * See https://docs.gadget.dev/guides/storing-files#direct-uploads-using-tokens for more information
    * @return { url: string, token: string } A `url` to upload one file to, and a token for that file to pass back to Gadget as an action input.
    */
    getDirectUploadToken: () => Promise<{
        url: string;
        token: string;
    }>;
    /**
     * Enqueue one action for execution in the backend. The backend will run the action as soon as possible, and return a handle to the action right away that can be used to check its status.
     *
     * @param action The action to enqueue
     * @param input The input variables for the action, in object form. Optional for actions that have only optional params, but required for actions with required params.
     * @param options Background execution options for the action
     *
     * @example
     * const handle = await api.enqueue(api.widget.update, { id: "123", name: "new name" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.create, { input: "value" }, { retries: 3, priority: "HIGH" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.delete, { id: "123" });
     *
     * @example
     * const handle = await api.enqueue(api.someGlobalAction, { retries: 3, priority: "LOW" });
     *
     * @example
     * const handle = await api.enqueue(api.someGlobalAction, { input: "value" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.bulkCreate, [{ name: "new name b" }, { name: "new name b" }]);
     **/
    enqueue<SchemaT, Action extends AnyActionFunction & AllOptionalVariables<Action['variablesType']>>(action: Action, input?: Action["variablesType"], options?: EnqueueBackgroundActionOptions<Action>): Promise<BackgroundActionHandle<SchemaT, Action>>;
    /**
     * Enqueue one action for execution in the backend. The backend will run the action as soon as possible, and return a handle to the action right away that can be used to check its status.
     *
     * @param action The action to enqueue
     * @param input The id for the record to run the action on. This is only one overload of this function, see the other forms for other input types.
     * @param options Background execution options for the action
     *
     * @example
     * const handle = await api.enqueue(api.widget.update, { id: "123", name: "new name" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.create, { input: "value" }, { retries: 3, priority: "HIGH" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.delete, { id: "123" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.delete, "123");
     *
     * @example
     * const handle = await api.enqueue(api.someGlobalAction, { retries: 3, priority: "LOW" });
     *
     * @example
     * const handle = await api.enqueue(api.someGlobalAction, { input: "value" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.bulkCreate, [{ name: "new name b" }, { name: "new name b" }]);
     **/
    enqueue<SchemaT, Action extends AnyActionFunction & {
        variablesType: {
            id: string;
        };
    }>(action: Action, id: string, options?: EnqueueBackgroundActionOptions<Action>): Promise<BackgroundActionHandle<SchemaT, Action>>;
    /**
     * Enqueue one action for execution in the backend. The backend will run the action as soon as possible, and return a handle to the action right away that can be used to check its status. This is the variant of enqueue for actions which accept no inputs.
     *
     * @param action The action to enqueue.
     * @param options Background execution options for the action
     *
     * @example
     * const handle = await api.enqueue(api.widget.update, { id: "123", name: "new name" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.create, { input: "value" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.delete, { id: "123" });
     *
     * @example
     * const handle = await api.enqueue(api.someGlobalAction);
     *
     * @example
     * const handle = await api.enqueue(api.someGlobalAction, { input: "value" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.bulkCreate, [{ name: "new name b" }, { name: "new name b" }]);
     **/
    enqueue<SchemaT, Action extends ActionFunctionMetadata<any, Record<string, never>, any, any, any, any> | GlobalActionFunction<Record<string, never>>>(action: Action, options?: EnqueueBackgroundActionOptions<Action>): Promise<BackgroundActionHandle<SchemaT, Action>>;
    /**
     * Enqueue a set of actions in bulk for execution. The backend will run each action as soon as possible, and return an array of handles to each action right away that can be used to check their statuses.
     *
     * @param bulkAction The bulk action to enqueue
     * @param input The input variables for the action, in array or object form.
     * @param options Background execution options for the action
     *
     * @example
     * const handle = await api.enqueue(api.widget.bulkCreate, [{ name: "foo" }, {name: "bar"}], { retries: 3, priority: "HIGH" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.bulkDelete, [2, 42]);
     *
     * @example
     * const handle = await api.enqueue(api.widget.addInventory, [{id: 1, amount: 10}, {id: 2, amount: 15}]);
     *
    **/
    enqueue<SchemaT, Action extends ActionFunctionMetadata<any, any, any, any, any, true>>(action: Action, input: Action["variablesType"], options?: EnqueueBackgroundActionOptions<Action>): Promise<BackgroundActionHandle<SchemaT, Action>[]>;
    /**
     * Enqueue one action for execution in the backend. The backend will run the action as soon as possible, and return a handle to the action right away that can be used to check its status.
     *
     * @param action The action to enqueue
     * @param input The input variables for the action, in object form. Optional for actions that have only optional params, but required for actions with required params.
     * @param options Background execution options for the action
     *
     * @example
     * const handle = await api.enqueue(api.widget.update, { id: "123", name: "new name" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.create, { input: "value" });
     *
     * @example
     * const handle = await api.enqueue(api.widget.delete, { id: "123" });
     *
     * @example
     * const handle = await api.enqueue(api.someGlobalAction);
     *
     * @example
     * const handle = await api.enqueue(api.someGlobalAction, { input: "value" });
     **/
    enqueue<SchemaT, Action extends AnyActionFunction>(action: Action, input: Action["variablesType"], options?: EnqueueBackgroundActionOptions<Action>): Promise<BackgroundActionHandle<SchemaT, Action>>;
    /**
     * Returns a handle for a given background action id
     *
     * @param action The action that was enqueued
     * @param id The id of the background action
     *
     * @example
     * const handle = api.handle(api.widget.update, "app-job-12346");
     *
     * @example
     * const handle = api.handle(api.someGlobalAction, "app-job-56789");
     **/
    handle<SchemaT, Action extends AnyActionFunction>(action: Action, id: string): BackgroundActionHandle<SchemaT, Action>;
    toString(): string;
    toJSON(): string;
}
/** Legacy export under the `Client` name for backwards compatibility. */
export declare const Client: typeof Livelocalgadget6Client;
export type Client = InstanceType<typeof Livelocalgadget6Client>;
