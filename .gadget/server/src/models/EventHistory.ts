// All the generated types for the "eventHistory" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger, TriggerWithType } from "../types";
import type { Scalars } from "@gadget-client/livelocalgadget6";
import { GadgetRecord, EventHistory } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";

export type DefaultEventHistoryServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly bookingId: true;
    readonly booking: false;
      readonly eventId: true;
    readonly event: false;
      readonly changedById: true;
    readonly changedBy: false;
      readonly changeType: true;
      readonly previousValue: true;
      readonly description: true;
      readonly newValue: true;
      readonly context: true;
      readonly metadata: true;
  };

  
/** Context of the `create` action on the `eventHistory` model. */
export interface CreateEventHistoryActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `eventHistory` record this action is operating on.
  */
  record: GadgetRecord<Select<EventHistory, DefaultEventHistoryServerSelection>>;
  /**
  * @deprecated Use 'return' instead.
  */
  scope: ActionExecutionScope;
  /**
  * An object specifying the trigger to this action (e.g. API call, webhook events etc.).
  */
  trigger: TriggerWithType<"api"> | TriggerWithType<"background-action">;
  /**
  * An object containing the incoming data(this models fields) passed by triggers or user inputs.
  */
  params: {
id?: string;
};
  /**
  * @private The context of this action.
  */
  context: CreateEventHistoryActionContext;
};


  