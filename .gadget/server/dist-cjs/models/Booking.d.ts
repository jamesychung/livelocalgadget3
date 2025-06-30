
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, TriggerWithType } from "../types";
import { GadgetRecord, Booking } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultBookingServerSelection = {
	readonly __typename: true
	readonly id: true
	readonly createdAt: true
	readonly updatedAt: true
	readonly bookedById: true
	readonly bookedBy: false
	readonly date: true
	readonly depositAmount: true
	readonly depositPaid: true
	readonly endTime: true
	readonly fullPaymentPaid: true
	readonly isActive: true
	readonly musicianId: true
	readonly musician: false
	readonly notes: true
	readonly specialRequirements: true
	readonly startTime: true
	readonly status: true
	readonly totalAmount: true
	readonly venueId: true
	readonly venue: false
	readonly musicianPitch: true
	readonly proposedRate: true
	readonly eventId: true
	readonly event: false
};
/** Context of the `update` action on the `booking` model. */
export interface UpdateBookingActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `booking` record this action is operating on.
	*/
	record: GadgetRecord<Select<Booking, DefaultBookingServerSelection>>;
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
	context: UpdateBookingActionContext;
}
