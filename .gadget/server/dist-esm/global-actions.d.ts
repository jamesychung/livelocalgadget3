
import type { AmbientContext } from "./AmbientContext.js";
import type { TriggerWithType, ActionExecutionScope } from "./types.js";
/** Context of the `sendBookingEmails` action. */
export interface SendBookingEmailsGlobalActionContext extends AmbientContext {
	/**
	* @deprecated Use 'returnType' instead.
	* Useful for returning data from this action by setting `scope.result`.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, custom params).
	*/
	params: {};
	/**
	* An object specifying the trigger to this action (e.g. api call, scheduler etc.)
	*/
	trigger: TriggerWithType<"api"> | TriggerWithType<"background-action">;
	/**
	* @private The context of this action.
	*/
	context: SendBookingEmailsGlobalActionContext;
}
/** Context of the `sendEmail` action. */
export interface SendEmailGlobalActionContext extends AmbientContext {
	/**
	* @deprecated Use 'returnType' instead.
	* Useful for returning data from this action by setting `scope.result`.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, custom params).
	*/
	params: {};
	/**
	* An object specifying the trigger to this action (e.g. api call, scheduler etc.)
	*/
	trigger: TriggerWithType<"api"> | TriggerWithType<"background-action">;
	/**
	* @private The context of this action.
	*/
	context: SendEmailGlobalActionContext;
}
