"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Client_exports = {};
__export(Client_exports, {
  Client: () => Client,
  DefaultBookingSelection: () => import_Booking2.DefaultBookingSelection,
  DefaultEventHistorySelection: () => import_EventHistory2.DefaultEventHistorySelection,
  DefaultEventSelection: () => import_Event2.DefaultEventSelection,
  DefaultMusicianSelection: () => import_Musician2.DefaultMusicianSelection,
  DefaultReviewSelection: () => import_Review2.DefaultReviewSelection,
  DefaultSessionSelection: () => import_Session2.DefaultSessionSelection,
  DefaultUserSelection: () => import_User2.DefaultUserSelection,
  DefaultVenueSelection: () => import_Venue2.DefaultVenueSelection,
  Livelocalgadget6Client: () => Livelocalgadget6Client
});
module.exports = __toCommonJS(Client_exports);
var import_wonka = require("wonka");
var import_api_client_core = require("@gadgetinc/api-client-core");
var import_builder = require("./builder.js");
var import_Booking = require("./models/Booking.js");
var import_Event = require("./models/Event.js");
var import_Musician = require("./models/Musician.js");
var import_Review = require("./models/Review.js");
var import_Venue = require("./models/Venue.js");
var import_User = require("./models/User.js");
var import_Session = require("./models/Session.js");
var import_CurrentSession = require("./models/CurrentSession.js");
var import_EventHistory = require("./models/EventHistory.js");
var import_seed = require("./namespaces/seed.js");
var import_Booking2 = require("./models/Booking.js");
var import_Event2 = require("./models/Event.js");
var import_Musician2 = require("./models/Musician.js");
var import_Review2 = require("./models/Review.js");
var import_Venue2 = require("./models/Venue.js");
var import_User2 = require("./models/User.js");
var import_Session2 = require("./models/Session.js");
var import_EventHistory2 = require("./models/EventHistory.js");
const import_meta = {};
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
    this.sendBookingEmails = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "sendBookingEmails",
      operationName: "sendBookingEmails",
      operationReturnType: "SendBookingEmails",
      namespace: null,
      variables: {}
    });
    /** Executes the sendEmail global action. */
    this.sendEmail = (0, import_builder.buildGlobalAction)(this, {
      type: "globalAction",
      functionName: "sendEmail",
      operationName: "sendEmail",
      operationReturnType: "SendEmail",
      namespace: null,
      variables: {}
    });
    /** Executes an inline computed view. */
    this.view = (0, import_builder.buildInlineComputedView)(this, {
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
    this.apiRoots = { "production": "https://livelocalgadget6.gadget.app/", "development": "https://livelocalgadget6--development.gadget.app/" };
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
    var _a, _b;
    let inSSRContext = false;
    try {
      inSSRContext = !!(import_meta.env && import_meta.env.SSR);
    } catch (error) {
    }
    if (inSSRContext) {
      const api = (_a = globalThis.GadgetGlobals) == null ? void 0 : _a.api;
      if (api) {
        return api.actAsSession;
      }
    }
    this.environment = ((options == null ? void 0 : options.environment) ?? getImplicitEnv() ?? fallbackEnv).toLocaleLowerCase();
    let apiRoot;
    if (this.apiRoots[this.environment]) {
      apiRoot = this.apiRoots[this.environment];
    } else {
      const envPart = this.environment == productionEnv ? "" : `--${this.environment}`;
      apiRoot = `https://livelocalgadget6${envPart}.gadget.app`;
    }
    const exchanges = { ...options == null ? void 0 : options.exchanges };
    if (this.environment !== productionEnv) {
      const devHarnessExchange = ({ forward }) => {
        return (operations$) => {
          const operationResult$ = forward(operations$);
          return (0, import_wonka.pipe)(
            operationResult$,
            (0, import_wonka.map)((result) => {
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
    this.connection = new import_api_client_core.GadgetConnection({
      endpoint: new URL("api/graphql", apiRoot).toString(),
      applicationId: this.applicationId,
      authenticationMode: (options == null ? void 0 : options.authenticationMode) ?? (typeof window == "undefined" ? { anonymous: true } : { browserSession: true }),
      ...options,
      exchanges,
      environment: this.environment
    });
    if (typeof window != "undefined" && this.connection.authenticationMode == import_api_client_core.AuthenticationMode.APIKey && !((_b = options == null ? void 0 : options.authenticationMode) == null ? void 0 : _b.dangerouslyAllowBrowserApiKey)) {
      throw new Error("GGT_BROWSER_API_KEY_USAGE: Using a Gadget API key to authenticate this client object is insecure and will leak your API keys to attackers. Please use a different authentication mode.");
    }
    this.booking = new import_Booking.BookingManager(this.connection);
    this.event = new import_Event.EventManager(this.connection);
    this.musician = new import_Musician.MusicianManager(this.connection);
    this.review = new import_Review.ReviewManager(this.connection);
    this.venue = new import_Venue.VenueManager(this.connection);
    this.user = new import_User.UserManager(this.connection);
    this.session = new import_Session.SessionManager(this.connection);
    this.currentSession = new import_CurrentSession.CurrentSessionManager(this.connection);
    this.eventHistory = new import_EventHistory.EventHistoryManager(this.connection);
    this.seed = new import_seed.SeedNamespace(this);
    this.internal = {
      booking: new import_api_client_core.InternalModelManager("booking", this.connection, { "pluralApiIdentifier": "bookings", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      event: new import_api_client_core.InternalModelManager("event", this.connection, { "pluralApiIdentifier": "events", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      musician: new import_api_client_core.InternalModelManager("musician", this.connection, { "pluralApiIdentifier": "musicians", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      review: new import_api_client_core.InternalModelManager("review", this.connection, { "pluralApiIdentifier": "reviews", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      venue: new import_api_client_core.InternalModelManager("venue", this.connection, { "pluralApiIdentifier": "venues", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      user: new import_api_client_core.InternalModelManager("user", this.connection, { "pluralApiIdentifier": "users", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      session: new import_api_client_core.InternalModelManager("session", this.connection, { "pluralApiIdentifier": "sessions", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      eventHistory: new import_api_client_core.InternalModelManager("eventHistory", this.connection, { "pluralApiIdentifier": "eventHistories", "hasAmbiguousIdentifiers": false, "namespace": [] }),
      seed: {}
    };
  }
  /**
   * Returns a new Client instance that will call the Gadget API as the application's admin user.
   * This can only be used for API clients using internal authentication.
   * @returns {Livelocalgadget6Client} A new Livelocalgadget6Client instance with admin authentication
   */
  get actAsAdmin() {
    var _a, _b, _c;
    (0, import_api_client_core.assert)((_b = (_a = this.options) == null ? void 0 : _a.authenticationMode) == null ? void 0 : _b.internal, `actAsAdmin can only be used for API clients using internal authentication, this client is using ${JSON.stringify((_c = this.options) == null ? void 0 : _c.authenticationMode)}`);
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
    var _a, _b;
    (0, import_api_client_core.assert)((_b = (_a = this.options) == null ? void 0 : _a.authenticationMode) == null ? void 0 : _b.internal, "actAsSession can only be used for API clients using internal authentication");
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
    (0, import_api_client_core.assert)(action, ".enqueue must be passed an action as the first argument but was passed undefined");
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
    return await (0, import_api_client_core.enqueueActionRunner)(this.connection, action, input, options);
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
    return new import_api_client_core.BackgroundActionHandle(this.connection, action, id);
  }
  toString() {
    return `Livelocalgadget6Client<${this.environment}>`;
  }
  toJSON() {
    return this.toString();
  }
}
Livelocalgadget6Client.prototype[Symbol.for("gadget/modelRelationships")] = { "booking": { "bookedBy": { "type": "BelongsTo", "model": "user" }, "musician": { "type": "BelongsTo", "model": "musician" }, "venue": { "type": "BelongsTo", "model": "venue" }, "event": { "type": "BelongsTo", "model": "event" } }, "event": { "createdBy": { "type": "BelongsTo", "model": "user" }, "musician": { "type": "BelongsTo", "model": "musician" }, "venue": { "type": "BelongsTo", "model": "venue" } }, "musician": { "reviews": { "type": "HasMany", "model": "review" }, "bookings": { "type": "HasMany", "model": "booking" }, "events": { "type": "HasMany", "model": "event" }, "user": { "type": "BelongsTo", "model": "user" } }, "review": { "event": { "type": "BelongsTo", "model": "venue" }, "musician": { "type": "BelongsTo", "model": "musician" }, "reviewer": { "type": "BelongsTo", "model": "user" }, "venue": { "type": "BelongsTo", "model": "venue" } }, "venue": { "events": { "type": "HasMany", "model": "event" }, "bookings": { "type": "HasMany", "model": "booking" }, "owner": { "type": "BelongsTo", "model": "user" }, "reviews": { "type": "HasMany", "model": "review" } }, "user": {}, "session": { "user": { "type": "BelongsTo", "model": "user" } }, "eventHistory": { "booking": { "type": "BelongsTo", "model": "booking" }, "event": { "type": "BelongsTo", "model": "event" }, "changedBy": { "type": "BelongsTo", "model": "user" } } };
const Client = Livelocalgadget6Client;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client,
  DefaultBookingSelection,
  DefaultEventHistorySelection,
  DefaultEventSelection,
  DefaultMusicianSelection,
  DefaultReviewSelection,
  DefaultSessionSelection,
  DefaultUserSelection,
  DefaultVenueSelection,
  Livelocalgadget6Client
});
//# sourceMappingURL=Client.js.map
