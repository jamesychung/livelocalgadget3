
import { AmbientContext } from "../AmbientContext.js";
import { ActionExecutionScope, NotYetTyped, TriggerWithType } from "../types.js";
import type { Scalars } from "@gadget-client/livelocalgadget6";
import { GadgetRecord, Event } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultEventServerSelection = {
	readonly __typename: true
	readonly id: true
	readonly createdAt: true
	readonly updatedAt: true
	readonly availableTickets: true
	readonly category: true
	readonly createdById: true
	readonly createdBy: false
	readonly date: true
	readonly description: true
	readonly endTime: true
	readonly equipment: true
	readonly genres: true
	readonly image: true
	readonly isActive: true
	readonly isPublic: true
	readonly isRecurring: true
	readonly musicianId: true
	readonly musician: false
	readonly recurringDays: true
	readonly recurringEndDate: true
	readonly recurringInterval: true
	readonly recurringPattern: true
	readonly setlist: true
	readonly startTime: true
	readonly eventStatus: true
	readonly ticketPrice: true
	readonly ticketType: true
	readonly title: true
	readonly totalCapacity: true
	readonly venueId: true
	readonly venue: false
	readonly rate: true
};
/** Context of the `create` action on the `event` model. */
export interface CreateEventActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `event` record this action is operating on.
	*/
	record: GadgetRecord<Select<Event, DefaultEventServerSelection>>;
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
		event?: {
			availableTickets?: number
			category?: string
			createdBy?: {
				_link: string | null
			}
			date?: Date
			description?: string
			endTime?: string
			equipment?: Scalars["JSON"]
			genres?: Scalars["JSON"]
			image?: string
			isActive?: boolean
			isPublic?: boolean
			isRecurring?: boolean
			musician?: {
				_link: string | null
			}
			recurringDays?: Scalars["JSON"]
			recurringEndDate?: Date
			recurringInterval?: number
			recurringPattern?: string
			setlist?: Scalars["JSON"]
			startTime?: string
			eventStatus?: string
			ticketPrice?: number
			ticketType?: string
			title?: string
			totalCapacity?: number
			venue?: {
				_link: string | null
			}
			rate?: number
		}
	};
	/**
	* @private The context of this action.
	*/
	context: CreateEventActionContext;
}
/** Context of the `update` action on the `event` model. */
export interface UpdateEventActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `event` record this action is operating on.
	*/
	record: GadgetRecord<Select<Event, DefaultEventServerSelection>>;
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
		event?: {
			availableTickets?: number
			category?: string
			createdBy?: {
				_link: string | null
			}
			date?: Date
			description?: string
			endTime?: string
			equipment?: Scalars["JSON"]
			genres?: Scalars["JSON"]
			image?: string
			isActive?: boolean
			isPublic?: boolean
			isRecurring?: boolean
			musician?: {
				_link: string | null
			}
			recurringDays?: Scalars["JSON"]
			recurringEndDate?: Date
			recurringInterval?: number
			recurringPattern?: string
			setlist?: Scalars["JSON"]
			startTime?: string
			eventStatus?: string
			ticketPrice?: number
			ticketType?: string
			title?: string
			totalCapacity?: number
			venue?: {
				_link: string | null
			}
			rate?: number
		}
		id?: string
	};
	/**
	* @private The context of this action.
	*/
	context: UpdateEventActionContext;
}
/** Context of the `findFirst` action on the `event` model. */
export interface FindFirstEventActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `event` record this action is operating on.
	*/
	record: GadgetRecord<Select<Event, DefaultEventServerSelection>>;
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
	context: FindFirstEventActionContext;
}
