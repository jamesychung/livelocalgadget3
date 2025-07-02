import { pipe, map } from "wonka";
import { assert, GadgetConnection, AuthenticationMode, InternalModelManager, enqueueActionRunner, BackgroundActionHandle } from "@gadgetinc/api-client-core";
import { buildGlobalAction, buildInlineComputedView } from "./builder.js";
import { BookingManager } from "./models/Booking.js";
import { EventManager } from "./models/Event.js";
import { MusicianManager } from "./models/Musician.js";
import { ReviewManager } from "./models/Review.js";
import { VenueManager } from "./models/Venue.js";
import { UserManager } from "./models/User.js";
import { SessionManager } from "./models/Session.js";
import { CurrentSessionManager } from "./models/CurrentSession.js";
import { EventHistoryManager } from "./models/EventHistory.js";
import { EventApplicationManager } from "./models/EventApplication.js";
import { DefaultBookingSelection as DefaultBookingSelection2 } from "./models/Booking.js";
import { DefaultEventSelection as DefaultEventSelection2 } from "./models/Event.js";
import { DefaultMusicianSelection as DefaultMusicianSelection2 } from "./models/Musician.js";
import { DefaultReviewSelection as DefaultReviewSelection2 } from "./models/Review.js";
import { DefaultVenueSelection as DefaultVenueSelection2 } from "./models/Venue.js";
import { DefaultUserSelection as DefaultUserSelection2 } from "./models/User.js";
import { DefaultSessionSelection as DefaultSessionSelection2 } from "./models/Session.js";
import { DefaultEventHistorySelection as DefaultEventHistorySelection2 } from "./models/EventHistory.js";
import { DefaultEventApplicationSelection as DefaultEventApplicationSelection2 } from "./models/EventApplication.js";
const productionEnv = "production";
const fallbackEnv = "development";
const getImplicitEnv = () => {
  try {
    return process.env.GADGET_ENV;
  } catch (error) {
    return void 0;
  }
};
class Livelocalgadget6Client {
  constructor(options) {
    this.options = options;
    /** Executes the sendBookingEmails global action. */
    this.sendBookingEmails = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "sendBookingEmails",
      operationName: "sendBookingEmails",
      operationReturnType: "SendBookingEmails",
      namespace: null,
      variables: {}
    });
    /** Executes the sendEmail global action. */
    this.sendEmail = buildGlobalAction(this, {
      type: "globalAction",
      functionName: "sendEmail",
      operationName: "sendEmail",
      operationReturnType: "SendEmail",
      namespace: null,
      variables: {}
    });
    /** Executes an inline computed view. */
    this.view = buildInlineComputedView(this, {
      type: "computedView",
      operationName: "gellyView",
      functionName: "view",
      gqlFieldName: "gellyView",
      namespace: null,
      variables: {
        query: { type: "String", required: true },
        args: { type: "JSONObject" }
      }
    });
    /**
     * The list of environments with a customized API root endpoint
     */
    this.apiRoots = { "development": "https://livelocalgadget6--development.gadget.app/", "production": "https://livelocalgadget6.gadget.app/" };
    this.applicationId = "240767";
    /** Start a transaction against the Gadget backend which will atomically commit (or rollback). */
    this.transaction = async (callback) => {
      return await this.connection.transaction(callback);
    };
    /**
    * Get a new direct upload token for file uploads to directly to cloud storage.
    * See https://docs.gadget.dev/guides/storing-files#direct-uploads-using-tokens for more information
    * @return { url: string, token: string } A `url` to upload one file to, and a token for that file to pass back to Gadget as an action input.
    */
    this.getDirectUploadToken = async () => {
      const result = await this.query("query GetDirectUploadToken($nonce: String) { gadgetMeta { directUploadToken(nonce: $nonce) { url, token } } }", { nonce: Math.random().toString(36).slice(2, 7) }, {
        requestPolicy: "network-only"
      });
      return result.gadgetMeta.directUploadToken;
    };
    let inSSRContext = false;
    try {
      inSSRContext = !!(import.meta.env && import.meta.env.SSR);
    } catch (error) {
    }
    if (inSSRContext) {
      const api = globalThis.GadgetGlobals?.api;
      if (api) {
        return api.actAsSession;
      }
    }
    this.environment = (options?.environment ?? getImplicitEnv() ?? fallbackEnv).toLocaleLowerCase();
    let apiRoot;
    if (this.apiRoots[this.environment]) {
      apiRoot = this.apiRoots[this.environment];
    } else {
      const envPart = this.environment == productionEnv ? "" : `--${this.environment}`;
      apiRoot = `https://livelocalgadget6${envPart}.gadget.app`;
    }
    const exchanges = { ...options?.exchanges };
    if (this.environment !== productionEnv) {
      const devHarnessExchange = ({ forward }) => {
        return (operations$) => {
          const operationResult$ = forward(operations$);
          return pipe(
            operationResult$,
            map((result) => {
              try {
                if (typeof window !== "undefined" && typeof CustomEvent === "function") {
                  const event = new CustomEvent("gadget:devharness:graphqlresult", { detail: result });
                  window.dispatchEvent(event);
                }
              } catch (error) {
                console.warn("[gadget] error dispatching gadget dev harness event", error);
              }
              return result;
            })
          );
        };
      };
      exchanges.beforeAll = [
        devHarnessExchange,
        ...exchanges.beforeAll ?? []
      ];
    }
    this.connection = new GadgetConnection({
      endpoint: new URL("api/graphql", apiRoot).toString(),
      applicationId: this.applicationId,
      authenticationMode: options?.authenticationMode ?? (typeof window == "undefined" ? { anonymous: true } : { browserSession: true }),
      ...options,
      exchanges,
      environment: this.environment
    });
    if (typeof window != "undefined" && this.connection.authenticationMode == AuthenticationMode.APIKey && !options?.authenticationMode?.dangerouslyAllowBrowserApiKey) {
      throw new Error("GGT_BROWSER_API_KEY_USAGE: Using a Gadget API key to authenticate this client object is insecure and will leak your API keys to attackers. Please use a different authentication mode.");
    }
    this.booking = new BookingManager(this.connection);
    this.event = new EventManager(this.connection);
    this.musician = new MusicianManager(this.connection);
    this.review = new ReviewManager(this.connection);
    this.venue = new VenueManager(this.connection);
    this.user = new UserManager(this.connection);
    this.session = new SessionManager(this.connection);
    this.currentSession = new CurrentSessionManager(this.connection);
    this.eventHistory = new EventHistoryManager(this.connection);
    this.eventApplication = new EventApplicationManager(this.connection);
    this.internal = {
      booking: new InternalModelManager("booking", this.connection, { "pluralApiIdentifier": "bookings", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      event: new InternalModelManager("event", this.connection, { "pluralApiIdentifier": "events", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      musician: new InternalModelManager("musician", this.connection, { "pluralApiIdentifier": "musicians", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      review: new InternalModelManager("review", this.connection, { "pluralApiIdentifier": "reviews", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      venue: new InternalModelManager("venue", this.connection, { "pluralApiIdentifier": "venues", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      user: new InternalModelManager("user", this.connection, { "pluralApiIdentifier": "users", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      session: new InternalModelManager("session", this.connection, { "pluralApiIdentifier": "sessions", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      eventHistory: new InternalModelManager("eventHistory", this.connection, { "pluralApiIdentifier": "eventHistories", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      eventApplication: new InternalModelManager("eventApplication", this.connection, { "pluralApiIdentifier": "eventApplications", "hasAmbiguousIdentifiers": false, "namespace": [] })
    };
  }
  /**
   * Returns a new Client instance that will call the Gadget API as the application's admin user.
   * This can only be used for API clients using internal authentication.
   * @returns {Livelocalgadget6Client} A new Livelocalgadget6Client instance with admin authentication
   */
  get actAsAdmin() {
    assert(this.options?.authenticationMode?.internal, `actAsAdmin can only be used for API clients using internal authentication, this client is using ${JSON.stringify(this.options?.authenticationMode)}`);
    return new Livelocalgadget6Client({
      ...this.options,
      authenticationMode: {
        internal: {
          ...this.options.authenticationMode.internal,
          actAsSession: false
        }
      }
    });
  }
  /**
   * Returns a new Livelocalgadget6Client instance that will call the Gadget API as with the permission of the current session.
   * This can only be used for API clients using internal authentication.
   * @returns {Livelocalgadget6Client} A new Livelocalgadget6Client instance with session authentication
   */
  get actAsSession() {
    assert(this.options?.authenticationMode?.internal, "actAsSession can only be used for API clients using internal authentication");
    return new Livelocalgadget6Client({
      ...this.options,
      authenticationMode: {
        internal: {
          ...this.options.authenticationMode.internal,
          actAsSession: true
        }
      }
    });
  }
  /** Run an arbitrary GraphQL query. */
  async query(graphQL, variables, options) {
    const { data, error } = await this.connection.currentClient.query(graphQL, variables, options).toPromise();
    if (error)
      throw error;
    return data;
  }
  /** Run an arbitrary GraphQL mutation. */
  async mutate(graphQL, variables, options) {
    const { data, error } = await this.connection.currentClient.mutation(graphQL, variables, options).toPromise();
    if (error)
      throw error;
    return data;
  }
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
  async fetch(input, init = {}) {
    return await this.connection.fetch(input, init);
  }
  async enqueue(action, inputOrOptions, maybeOptions) {
    assert(action, ".enqueue must be passed an action as the first argument but was passed undefined");
    let input;
    let options;
    if (typeof maybeOptions !== "undefined") {
      input = inputOrOptions;
      options = maybeOptions;
    } else if (!action.variables || Object.keys(action.variables).length == 0) {
      input = {};
      options = inputOrOptions;
    } else {
      if (typeof inputOrOptions == "string") {
        input = { id: inputOrOptions };
      } else {
        input = inputOrOptions;
      }
      options = {};
    }
    return await enqueueActionRunner(this.connection, action, input, options);
  }
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
  handle(action, id) {
    return new BackgroundActionHandle(this.connection, action, id);
  }
  toString() {
    return `Livelocalgadget6Client<${this.environment}>`;
  }
  toJSON() {
    return this.toString();
  }
}
Livelocalgadget6Client.prototype[Symbol.for("gadget/modelRelationships")] = { "booking": { "bookedBy": { "type": "BelongsTo", "model": "user" }, "musician": { "type": "BelongsTo", "model": "musician" }, "venue": { "type": "BelongsTo", "model": "venue" }, "event": { "type": "BelongsTo", "model": "event" } }, "event": { "createdBy": { "type": "BelongsTo", "model": "user" }, "musician": { "type": "BelongsTo", "model": "musician" }, "venue": { "type": "BelongsTo", "model": "venue" } }, "musician": { "reviews": { "type": "HasMany", "model": "review" }, "bookings": { "type": "HasMany", "model": "booking" }, "events": { "type": "HasMany", "model": "event" }, "user": { "type": "BelongsTo", "model": "user" } }, "review": { "event": { "type": "BelongsTo", "model": "venue" }, "musician": { "type": "BelongsTo", "model": "musician" }, "reviewer": { "type": "BelongsTo", "model": "user" }, "venue": { "type": "BelongsTo", "model": "venue" } }, "venue": { "events": { "type": "HasMany", "model": "event" }, "bookings": { "type": "HasMany", "model": "booking" }, "owner": { "type": "BelongsTo", "model": "user" }, "reviews": { "type": "HasMany", "model": "review" } }, "user": {}, "session": { "user": { "type": "BelongsTo", "model": "user" } }, "eventHistory": { "booking": { "type": "BelongsTo", "model": "booking" }, "changedBy": { "type": "BelongsTo", "model": "user" }, "event": { "type": "BelongsTo", "model": "event" } }, "eventApplication": { "event": { "type": "BelongsTo", "model": "event" }, "musician": { "type": "BelongsTo", "model": "musician" }, "venue": { "type": "BelongsTo", "model": "venue" }, "reviewedBy": { "type": "BelongsTo", "model": "user" } } };
const Client = Livelocalgadget6Client;
export {
  Client,
  DefaultBookingSelection2 as DefaultBookingSelection,
  DefaultEventApplicationSelection2 as DefaultEventApplicationSelection,
  DefaultEventHistorySelection2 as DefaultEventHistorySelection,
  DefaultEventSelection2 as DefaultEventSelection,
  DefaultMusicianSelection2 as DefaultMusicianSelection,
  DefaultReviewSelection2 as DefaultReviewSelection,
  DefaultSessionSelection2 as DefaultSessionSelection,
  DefaultUserSelection2 as DefaultUserSelection,
  DefaultVenueSelection2 as DefaultVenueSelection,
  Livelocalgadget6Client
};
//# sourceMappingURL=Client.js.map
