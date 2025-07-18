
import type { AnyClient, GadgetRecord } from "@gadgetinc/api-client-core";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Logger } from "./AmbientContext.js";
import type { Session } from "./Session.js";
import type { GadgetFrameworkGlobals, kGlobals } from "./globals.js";
import type { JSONTransportConfig, SESTransportConfig, SMTPTransportConfig, SendmailTransportConfig, StreamTransportConfig } from "./nodemailer-transports.js";
import type { AppTenancy, AppTenancyKey } from "./tenancy.js";
/**
* An object passed between all preconditions and effects of an action execution at the `scope` property.
* Useful for transferring data between effects.
**/
export interface ActionExecutionScope {
	recordDeleted?: boolean;
	[key: string]: any;
}
/** Information about the current request being processed by Gadget. */
export interface RequestData {
	/** The remote IP address of the request */
	ip: string;
	/** The requested URL */
	url: string;
	/** The HTTP method for this request (like GET, POST, etc) */
	method: string;
	/** A unique identifier for this request */
	id: string;
	/** The user agent header of the request */
	userAgent?: string;
	/** Headers passed to this request */
	headers: Record<string, string | string[] | undefined>;
}
/** Describes an action triggered by running a Shopify webhook */
export interface ShopifyWebhookActionTrigger {
	type: "shopify_webhook";
	/** The topic of the incoming webhook from Shopify, like products/update or orders/create */
	topic: string;
	/** The raw incoming payload from Shopify */
	payload: Record<string, any>;
	/** The ID of the shop receiving the webhook */
	shopId: string;
	/** The number of times this webhook has been retried */
	retries: number;
}
export interface PublicAPIActionTrigger {
	/** Mutation name called in the API */
	mutationName: string;
	/** Model identifier the mutation was called on. Usually the same as the model the action is being run on, but will be different if the action is nested. Is not set for global actions. */
	rootModel?: string;
	/** Action identifier triggered by the mutation. Usually the same as the action is being run, but will be different if the current action is nested */
	rootAction: string;
	/** The params passed to this API call, including any data for nested actions if passed */
	rawParams: Record<string, any>;
}
/** Describes an action triggered by calling a mutation in the app's generated GraphQL API */
export interface APIActionTrigger extends PublicAPIActionTrigger {
	type: "api";
}
/** Describes an action triggered by running a sync on a Shopify model. */
export interface ShopifySyncActionTrigger {
	type: "shopify_sync";
	/** The shop id being synced */
	shopId: string;
	/** The API version of the shop being synced */
	apiVersion: string;
	/** The available oauth scopes of the shop being synced */
	shopifyScopes: string[];
	/** The id of the sync record tracking the state of this sync, if available */
	syncId?: string;
	/** The specified date range of this sync, if set when the sync was started */
	syncSince?: string;
	/** The list of model apiIdentifiers this sync will work on. */
	models: string[];
	/** If this sync is being run in force mode, which will always run actions, even if the updated_at timestamps match between Gadget and Shopify */
	force: boolean;
	/** The string reason why this sync was started if set when the sync began */
	startReason?: string;
}
/** Describes an action run by one event on a schedule */
export interface SchedulerActionTrigger {
	type: "scheduler";
}
/** Describes an action run as a background job */
export interface BackgroundActionTrigger extends Omit<APIActionTrigger, "type"> {
	type: "background-action";
	/** How many attempts we have made to run this job */
	attemptNumber: number;
	/** Whether this is the final attempt */
	finalAttempt: boolean;
	/** ID of the background action record */
	id: string;
	priority: string;
	queue?: {
		name: string
		maxConcurrency: number
	};
}
/** Describes an action run by a Shopify merchant completing the OAuth process to install an application */
export interface ShopifyOAuthActionTrigger {
	type: "shopify_oauth";
}
/** Describes an action run by a Shopify Admin app being installed into Gadget */
export interface ShopifyAdminActionTrigger {
	type: "shopify_admin";
}
/** Describes an action run by a Shopify customer who has logged in to a customer UI extension that has called this app */
export interface ShopifyCustomerAccountLoginTrigger {
	type: "shopify_customer_account_login";
}
/** Represents actions triggered by happenings inside the Gadget platform, like maintenance, or administrative actions taken inside the Gadget editor */
export interface PlatformTrigger {
	type: "platform";
	reason: string;
}
/** Represents actions triggered by tests within the Gadget platform */
export interface MockActionTrigger {
	type: "mock";
}
export interface BigCommerceOauthActionTrigger {
	type: "bigcommerce_oauth";
}
export interface BigCommerceUninstallAppTrigger {
	type: "bigcommerce_uninstall";
	signed_payload_jwt: string;
}
export interface BigCommerceRemoveUserAppTrigger {
	type: "bigcommerce_remove_user";
	signed_payload_jwt: string;
}
/** Describes an action triggered by running a BigCommerce webhook */
export interface BigCommerceWebhookActionTrigger {
	type: "bigcommerce_webhook";
	/** The scope of the incoming webhook from BigCommerce, like store/products/updated or store/orders/* */
	scope: string;
	/** The raw incoming data from BigCommerce */
	data: Record<string, any>;
	/** The storeHash of the store producing the webhook */
	storeHash: string;
	/** The time at which the webhook was created */
	createdAt: number;
	/** A hash sent by BigCommerce with each webhook to help with duplicate events */
	hash: string;
	/** The number of times this webhook has been retried */
	retries: number;
}
export interface GoogleOAuthActionTrigger {
	user: {
		given_name: string
		family_name: string
		email: string
		email_verified: string
		name: string
		picture: string
		hd: string
		locale: string
	};
	token?: {
		token_type: string
		id_token: string
		access_token: string
		refresh_token?: string
		expires_in: number
		scope: string
	};
}
export interface GoogleOAuthSignInActionTrigger extends GoogleOAuthActionTrigger {
	type: "google_oauth_signin";
}
export interface GoogleOAuthSignUpActionTrigger extends GoogleOAuthActionTrigger {
	type: "google_oauth_signup";
}
export interface GadgetEmailPasswordSignUpTrigger extends PublicAPIActionTrigger {
	type: "user_sign_up";
}
export interface GadgetEmailPasswordSignInTrigger extends PublicAPIActionTrigger {
	type: "user_sign_in";
}
export interface GadgetEmailPasswordResetTrigger extends PublicAPIActionTrigger {
	type: "user_reset_password";
}
export interface GadgetEmailPasswordSendResetTrigger extends PublicAPIActionTrigger {
	type: "user_send_reset_password";
}
export interface GadgetEmailPasswordVerifyTrigger extends PublicAPIActionTrigger {
	type: "user_verify_email";
}
export interface GadgetEmailPasswordSendVerifyTrigger extends PublicAPIActionTrigger {
	type: "user_send_verify_email";
}
export interface GadgetEmailPasswordChangePasswordTrigger extends PublicAPIActionTrigger {
	type: "user_change_password";
}
export interface GadgetUserSignOutTrigger extends PublicAPIActionTrigger {
	type: "user_sign_out";
}
export type ActionTrigger = ShopifyWebhookActionTrigger | APIActionTrigger | ShopifySyncActionTrigger | SchedulerActionTrigger | BackgroundActionTrigger | ShopifyOAuthActionTrigger | ShopifyAdminActionTrigger | ShopifyCustomerAccountLoginTrigger | PlatformTrigger | MockActionTrigger | GoogleOAuthSignInActionTrigger | GoogleOAuthSignUpActionTrigger | GadgetEmailPasswordSignUpTrigger | GadgetEmailPasswordSignInTrigger | GadgetEmailPasswordResetTrigger | GadgetEmailPasswordSendResetTrigger | GadgetEmailPasswordVerifyTrigger | GadgetEmailPasswordSendVerifyTrigger | GadgetEmailPasswordChangePasswordTrigger | GadgetUserSignOutTrigger | BigCommerceOauthActionTrigger | BigCommerceUninstallAppTrigger | BigCommerceRemoveUserAppTrigger | BigCommerceWebhookActionTrigger;
export type TriggerWithType<T extends string> = Extract<ActionTrigger, {
	type: T
}>;
export type ConfigurationVariablesBlob = Record<string, string | null>;
/** @hidden */
export type FindRecordCondition = Record<string, any>;
/**
* The base attributes most records have
**/
export interface BaseRecord {
	__typename?: string;
	id?: string;
	state?: any;
	stateHistory?: any;
	[key: string]: any;
}
export interface AnyBulkRecordLoader {
	loadRecord(apiIdentifier: string, namespace: string[], condition: FindRecordCondition): Promise<GadgetRecord<BaseRecord> | undefined>;
}
/** Gadget's Error tracking object used in validation code effects for adding errors when a validation fails.*/
export interface ValidationErrors {
	/**
	* Add an error to the errors list for a given field
	* @param {string} field - The `apiIdentifier` of the field you wish to add an error to
	* @param {string} message - A mesage describing the error in detail.
	*/
	add(field: string, message: string): void;
	/**
	* Returns the number of errors for this record validation pass.
	*/
	get size(): number;
	/**
	* Returns `true` if there are no errors, otherwise returns `false`.
	*/
	get empty(): boolean;
	/**
	* Returns an array of objects containing the field's `apiIdentifier` and the error `message` string for all errors added so far.
	*/
	list: {
		apiIdentifier: string
		message: string
	}[];
	/**
	* Returns a simplified JSON object representing the error messages grouped by `apiIdentifier`
	*/
	toJSON(): {
		[apiIdentifier: string]: string[]
	};
}
/** A generic interface for an object that doesn't have a committed a public interface. */
export interface NotYetTyped {
	[key: string]: any;
}
export interface AnyParams {
	[key: string]: string | number | boolean | object | bigint | null | undefined | AnyParams;
}
export interface ActionDescriptor {
	key: string;
	type: "Action" | "ModelAction";
	apiIdentifier: string;
	timeoutMilliseconds: number;
	hasReturnType: boolean;
}
export interface GlobalActionDescriptor {
	key: string;
	type: "GlobalAction";
	apiIdentifier: string;
	timeoutMilliseconds: number;
	hasReturnType: boolean;
}
export interface ModelDescriptor extends ModelMetadata {
	validator: {
		validate(context: AnyEffectContext, record: GadgetRecord<BaseRecord>): Promise<void>
	};
}
/** Represents the data that's in always context */
export interface AnyAmbientContext {
	/** The current request's session, if it has one. Requests made by browsers are given sessions, but requests made using Gadget API Keys are not. */
	session: Session | null;
	/** The current request's session ID, if it has one. Requests made by browsers are given sessions, but requests made using Gadget API Keys are not. */
	sessionID: string | null;
	/** All <%- applicationName %> configuration values */
	config: ConfigurationVariablesBlob;
	/** A map of connection name to instantiated connection objects for <%- applicationName %> */
	connections: Record<string, unknown>;
	/** A signal for if/when the request for processing this unit of work gets prematurely aborted. Useful for passing along to long running requests that should be interrupted when the client goes away. */
	signal: AbortSignal;
	/** A high performance structured logger which writes logs to the Logs Viewer in the Gadget Editor. */
	logger: Logger;
	/**
	* An instance of the API client for <%- applicationName %>.
	*
	* __Note__: This client is authorized using a superuser internal api token and has permission to invoke any action in the system using normal API mutations or the Internal API.
	**/
	api: AnyClient;
	/**
	* The details of the request that is invoking this unit of work, if it was invoked by a request.
	*
	* __Note__: Request details are not always present, like during a background connection sync, a background job, or an action retry.
	**/
	request?: RequestData;
	/**
	* A unique identifier for this context
	*/
	id: string;
	/**
	* A boolean describing if this unit of work will be retried automatically or not
	*/
	willRetry?: boolean;
	/** App URL for the current environment e.g. https://example.gadget.app */
	currentAppUrl: string;
	/** An object for sending emails */
	emails: GadgetMailer;
	/**
	* The current tenancy for this unit of work
	* @internal
	*/
	[AppTenancyKey]?: AppTenancy;
	/** @internal */
	loaders: AnyBulkRecordLoader;
	/** @internal */
	effectAPIs: any;
	/** @internal */
	authConfig?: AuthenticationConfiguration;
	/** @internal */
	[kGlobals]: GadgetFrameworkGlobals;
}
export type GadgetConfig = {
	apiKeys: {
		shopify?: string
	}
	environment?: string | null
	env: {
		GADGET_APP: string
		GADGET_ENV?: string
		GADGET_PUBLIC_APP_SLUG: string
		GADGET_PUBLIC_APP_ENV?: string
		GADGET_PUBLIC_SHOPIFY_APP_URL?: string
	} & {
		[key: string]: string | undefined
	}
	shopifyInstallState?: {
		redirectToOauth: boolean
		isAuthenticated: boolean
		missingScopes: string[]
		shopExists: boolean
	}
	shopifyAppBridgeCDNScriptSrc: string
	authentication?: Pick<AuthenticationConfiguration, "signInPath" | "redirectOnSuccessfulSignInPath">
};
/** The context for a request passed to an HTTP route */
export interface AnyRequestContext extends AnyAmbientContext {
	gadgetConfig: GadgetConfig;
	gadgetContext: Record<string, any>;
	currentAppUrl: string;
	request: FastifyRequest;
	reply: FastifyReply;
	/** @deprecated */
	applicationIdentity: any | null;
	/** @deprecated */
	applicationSessionID?: string | null;
	/** @deprecated */
	applicationSession?: Session | null;
	/** A signal for if/when the request for processing this unit of work gets prematurely aborted. Useful for passing along to long running requests that should be interrupted when the client goes away. */
	signal: AbortSignal;
}
export interface BaseActionContext extends AnyAmbientContext {
	/** Details about what triggered this action or global action to run */
	trigger: ActionTrigger;
	/**
	* An object passed between all preconditions and effects of an action execution at the \`scope\` property.
	* Useful for transferring data between effects.
	*/
	scope: ActionExecutionScope;
	/**
	* @internal
	*/
	[AppTenancyKey]?: AppTenancy;
}
/**
* An action context type for use in actions that can run on any model.
*/
export interface AnyActionContext extends BaseActionContext {
	type: "action";
	/** Details about the action being executed */
	action: ActionDescriptor;
	/**
	* The record this action is operating on.
	*/
	record: GadgetRecord<BaseRecord>;
	/**
	* The model this action is for.
	*/
	model: ModelDescriptor;
	/**
	* The parameters passed to the action.
	*/
	params: AnyParams;
	/** The phase of execution we're running currently */
	phase: "precondition" | "run" | "success" | "failure";
	/**
	* The current context for this action
	*/
	context: AnyActionContext;
	/**
	* @deprecated
	*/
	transition?: {
		type: "Transition"
		key: string
		actionKey: string
		fromStateKey: string
		toStateKey: string
	};
}
/**
* Describes the context passed to every global action.
*/
export interface AnyGlobalActionContext extends BaseActionContext {
	type: "global-action";
	/** Details about the global action being executed */
	action: GlobalActionDescriptor;
	/** What phase of execution this global action is currently in */
	phase: "precondition" | "run" | "success" | "failure";
	/**
	* The parameters passed to the action.
	*/
	params: AnyParams;
	/**
	* The current context for this global action
	*/
	context: AnyGlobalActionContext;
}
/**
* Represents all the context available when executing one effect of an action or global action
**/
export interface AnyEffectContext extends BaseActionContext {
	type: "effect";
	effect: {
		spec: {
			id: string
		}
		configuration: Record<string, any>
	};
	/**
	* The parameters passed to this effect.
	*/
	params: AnyParams;
	/**
	* The specific connection this effect has been contributed by
	**/
	connection?: unknown;
	model?: ModelDescriptor;
	record?: GadgetRecord<BaseRecord>;
}
/**
* Represents all the context available when executing one precondition of an action or global action
* @deprecated
**/
export interface AnyPreconditionContext extends BaseActionContext {
	type: "precondition";
	condition: {
		spec: {
			id: string
		}
		configuration: Record<string, any>
	};
	model?: ModelDescriptor;
	record?: GadgetRecord<BaseRecord>;
	params: AnyParams;
}
export type ActionContextForBlob<T> = T extends {
	type: "Action"
} ? AnyActionContext : T extends {
	type: "GlobalAction"
} ? AnyGlobalActionContext : never;
/**
* @hidden
*/
export interface FieldMetadata {
	fieldType: string;
	key: string;
	name: string;
	apiIdentifier: string;
	configuration: {
		[key: string]: any
	};
	internalWritable: boolean;
}
/**
* @hidden
*/
export interface ModelMetadata {
	key: string;
	name: string;
	apiIdentifier: string;
	namespace: string[];
	fields: {
		[key: string]: FieldMetadata
	};
	graphqlTypeName: string;
	stateChart: any;
}
/** Gadget wrapper for NodeMailer, used to facilitate the sending of emails.*/
export interface GadgetMailer {
	/** Verifies SMTP configuration */
	verifyConnection(): Promise<void>;
	/** Sets the transport configuration used for transporting emails */
	setTransport(transport: SMTPTransportConfig | SendmailTransportConfig | StreamTransportConfig | JSONTransportConfig | SESTransportConfig): void;
	/** Sends the email using the set transporter, alias for `sendMail` */
	send(mailData: MailData): Promise<any>;
	/** Sends the email using the set transporter */
	sendMail(mailData: MailData): Promise<any>;
	/** Renders an ejs template */
	render(template: string, data: any): string;
}
/**
* @internal
*/
export interface AuthenticationConfigurationMethod {
	specID: string;
	configuration?: {
		type: "GoogleMethodConfiguration"
		gadgetManagedCredentials: boolean
		callbackPath: string
		scopes: string[]
		redirectOnSuccessfulSignInPath?: string | null
		credentials: {
			clientID?: string
			clientSecret?: string
		}
		offlineMode: boolean
	} | {
		type: "EmailPasswordMethodConfiguration"
	};
}
/**
* @internal
*/
export interface AuthenticationConfiguration {
	signInPath: string;
	redirectOnForbidden: boolean;
	sessionExpirationMs: number;
	defaultAuthRoles: string[];
	redirectOnSuccessfulSignInPath?: string;
	methods?: AuthenticationConfigurationMethod[];
	userModelKey?: string;
}
/** The options for the mail object being sent */
export type MailData = {
	/** An array of recipients e-mail addresses that will appear on the To: field */
	to: string | string[] | Address | Array<string | Address>
	/** The subject of the e-mail */
	subject?: string
	/** The body of the email in plain text */
	text?: string
	/** The body of the email in HTML */
	html?: string
	/** The From address displayed to users as to who the email came from. If using Gadget transport, must end in the app's approved subdomain, the value of primaryDomain found in Config. If one is not provided then a default address for the app will be used */
	from?: string | Address
	/** The Sender header used to identify the agent responsible for the actual transmission of the email. Can only be set when using a Custom transport */
	sender?: string | Address
	/** An array of attachments */
	attachments?: Attachment[]
	/** Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field */
	cc?: string | Address | (string | Address)[]
	/** Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field */
	bcc?: string | Address | (string | Address)[]
	/** Comma separated list or an array of e-mail addresses that will appear on the Reply-To: field */
	replyTo?: string | Address | (string | Address)[]
	/** The message-id this message is replying */
	inReplyTo?: string | Address
	/** Message-id list (an array or space separated string) */
	references?: string | string[]
	/** An object or array of additional header fields */
	headers?: {
		[key: string]: string | string[]
	}
};
export type Address = {
	name: string
	address: string
};
export type Attachment = {
	/** the filename of the attachment. If not provided, will be derived from the path */
	filename?: string
	/** path to a file */
	path?: string
	/** the content of the attachment */
	content?: string | Buffer
};
