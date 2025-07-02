
import { AmbientContext } from "../AmbientContext.js";
import { ActionExecutionScope, NotYetTyped, TriggerWithType } from "../types.js";
import { GadgetRecord, EventHistory } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultEventHistoryServerSelection = {
	readonly __typename: true
	readonly id: true
	readonly createdAt: true
	readonly updatedAt: true
	readonly bookingId: true
	readonly booking: false
	readonly changeType: true
	readonly changedById: true
	readonly changedBy: false
	readonly context: true
	readonly description: true
	readonly eventId: true
	readonly event: false
	readonly metadata: true
	readonly newValue: true
	readonly previousValue: true
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
		id?: string
	};
	/**
	* @private The context of this action.
	*/
	context: CreateEventHistoryActionContext;
}
