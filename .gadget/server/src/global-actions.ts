import type { AmbientContext } from "./AmbientContext";
import type { ActionTrigger, TriggerWithType, ActionExecutionScope } from "./types";
import type { Scalars } from "@gadget-client/livelocalgadget6";

/** Context of the `createEvents` action. */
export interface SeedCreateEventsGlobalActionContext extends AmbientContext {
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
  context: SeedCreateEventsGlobalActionContext;
};


/** Context of the `createMusicians` action. */
export interface SeedCreateMusiciansGlobalActionContext extends AmbientContext {
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
  context: SeedCreateMusiciansGlobalActionContext;
};


/** Context of the `createReviews` action. */
export interface SeedCreateReviewsGlobalActionContext extends AmbientContext {
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
  context: SeedCreateReviewsGlobalActionContext;
};


/** Context of the `createUsers` action. */
export interface SeedCreateUsersGlobalActionContext extends AmbientContext {
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
  context: SeedCreateUsersGlobalActionContext;
};


/** Context of the `createVenues` action. */
export interface SeedCreateVenuesGlobalActionContext extends AmbientContext {
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
  context: SeedCreateVenuesGlobalActionContext;
};


/** Context of the `quickSeed` action. */
export interface SeedQuickSeedGlobalActionContext extends AmbientContext {
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
  context: SeedQuickSeedGlobalActionContext;
};


/** Context of the `seedAllData` action. */
export interface SeedSeedAllDataGlobalActionContext extends AmbientContext {
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
  context: SeedSeedAllDataGlobalActionContext;
};


/** Context of the `seedData` action. */
export interface SeedSeedDataGlobalActionContext extends AmbientContext {
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
  context: SeedSeedDataGlobalActionContext;
};


/** Context of the `simpleSeed` action. */
export interface SeedSimpleSeedGlobalActionContext extends AmbientContext {
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
  context: SeedSimpleSeedGlobalActionContext;
};


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


