// All the generated types for the "eventApplication" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger, TriggerWithType } from "../types";
import type { Scalars } from "@gadget-client/livelocalgadget6";
import { GadgetRecord, EventApplication } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";

export type DefaultEventApplicationServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly eventId: true;
    readonly event: false;
      readonly musicianId: true;
    readonly musician: false;
      readonly venueId: true;
    readonly venue: false;
      readonly status: true;
      readonly appliedAt: true;
      readonly message: true;
      readonly reviewedAt: true;
      readonly reviewedById: true;
    readonly reviewedBy: false;
  };

  
/** Context of the `create` action on the `eventApplication` model. */
export interface CreateEventApplicationActionContext extends AmbientContext {
  /**
  * The model this action is operating on
  */
  model: NotYetTyped;
  /**
  * An object specifying the `eventApplication` record this action is operating on.
  */
  record: GadgetRecord<Select<EventApplication, DefaultEventApplicationServerSelection>>;
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
  context: CreateEventApplicationActionContext;
};


  