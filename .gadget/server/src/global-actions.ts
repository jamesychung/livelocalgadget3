import type { AmbientContext } from "./AmbientContext";
import type { ActionTrigger, TriggerWithType, ActionExecutionScope } from "./types";
import type { Scalars } from "@gadget-client/livelocalgadget6";

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
  params: {
};
  /**
  * An object specifying the trigger to this action (e.g. api call, scheduler etc.)
  */
  trigger: TriggerWithType<"api"> | TriggerWithType<"background-action">;
  /**
  * @private The context of this action.
  */
  context: SendBookingEmailsGlobalActionContext;
};


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
  params: {
};
  /**
  * An object specifying the trigger to this action (e.g. api call, scheduler etc.)
  */
  trigger: TriggerWithType<"api"> | TriggerWithType<"background-action">;
  /**
  * @private The context of this action.
  */
  context: SendEmailGlobalActionContext;
};


