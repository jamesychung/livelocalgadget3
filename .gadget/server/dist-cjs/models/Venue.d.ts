
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, TriggerWithType } from "../types";
import type { Scalars } from "@gadget-client/livelocalgadget6";
import { GadgetRecord, Venue } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultVenueServerSelection = {
	readonly __typename: true
	readonly id: true
	readonly createdAt: true
	readonly updatedAt: true
	readonly state: true
	readonly events: false
	readonly bookings: false
	readonly additionalPictures: true
	readonly address: true
	readonly amenities: true
	readonly capacity: true
	readonly city: true
	readonly country: true
	readonly description: true
	readonly email: true
	readonly genres: true
	readonly hours: true
	readonly isActive: true
	readonly isVerified: true
	readonly name: true
	readonly ownerId: true
	readonly owner: false
	readonly phone: true
	readonly priceRange: true
	readonly profilePicture: true
	readonly rating: true
	readonly socialLinks: true
	readonly type: true
	readonly website: true
	readonly zipCode: true
	readonly reviews: false
};
/** Context of the `create` action on the `venue` model. */
export interface CreateVenueActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `venue` record this action is operating on.
	*/
	record: GadgetRecord<Select<Venue, DefaultVenueServerSelection>>;
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
		venue?: {
			state?: string
			additionalPictures?: Scalars["JSON"]
			address?: string
			amenities?: Scalars["JSON"]
			capacity?: number
			city?: string
			country?: string
			description?: string
			email?: string
			genres?: Scalars["JSON"]
			hours?: Scalars["JSON"]
			isActive?: boolean
			isVerified?: boolean
			name?: string
			owner?: {
				_link: string | null
			}
			phone?: string
			priceRange?: string
			profilePicture?: string
			rating?: number
			socialLinks?: Scalars["JSON"]
			type?: string
			website?: string
			zipCode?: string
		}
	};
	/**
	* @private The context of this action.
	*/
	context: CreateVenueActionContext;
}
/** Context of the `update` action on the `venue` model. */
export interface UpdateVenueActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `venue` record this action is operating on.
	*/
	record: GadgetRecord<Select<Venue, DefaultVenueServerSelection>>;
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
		venue?: {
			state?: string
			additionalPictures?: Scalars["JSON"]
			address?: string
			amenities?: Scalars["JSON"]
			capacity?: number
			city?: string
			country?: string
			description?: string
			email?: string
			genres?: Scalars["JSON"]
			hours?: Scalars["JSON"]
			isActive?: boolean
			isVerified?: boolean
			name?: string
			owner?: {
				_link: string | null
			}
			phone?: string
			priceRange?: string
			profilePicture?: string
			rating?: number
			socialLinks?: Scalars["JSON"]
			type?: string
			website?: string
			zipCode?: string
		}
		id?: string
	};
	/**
	* @private The context of this action.
	*/
	context: UpdateVenueActionContext;
}
/** Context of the `findFirst` action on the `venue` model. */
export interface FindFirstVenueActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `venue` record this action is operating on.
	*/
	record: GadgetRecord<Select<Venue, DefaultVenueServerSelection>>;
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
	context: FindFirstVenueActionContext;
}
