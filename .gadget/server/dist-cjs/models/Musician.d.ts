
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, TriggerWithType } from "../types";
import type { Scalars } from "@gadget-client/livelocalgadget6";
import { GadgetRecord, Musician } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultMusicianServerSelection = {
	readonly __typename: true
	readonly id: true
	readonly createdAt: true
	readonly updatedAt: true
	readonly state: true
	readonly reviews: false
	readonly bookings: false
	readonly events: false
	readonly additionalPictures: true
	readonly audio: true
	readonly audioFiles: true
	readonly availability: true
	readonly bio: true
	readonly city: true
	readonly country: true
	readonly email: true
	readonly experience: true
	readonly genre: true
	readonly genres: true
	readonly hourlyRate: true
	readonly instruments: true
	readonly isActive: true
	readonly isVerified: true
	readonly location: true
	readonly phone: true
	readonly profilePicture: true
	readonly rating: true
	readonly socialLinks: true
	readonly stageName: true
	readonly totalGigs: true
	readonly userId: true
	readonly user: false
	readonly website: true
	readonly yearsExperience: true
};
/** Context of the `create` action on the `musician` model. */
export interface CreateMusicianActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `musician` record this action is operating on.
	*/
	record: GadgetRecord<Select<Musician, DefaultMusicianServerSelection>>;
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
		musician?: {
			state?: string
			additionalPictures?: Scalars["JSON"]
			audio?: string
			audioFiles?: Scalars["JSON"]
			availability?: Scalars["JSON"]
			bio?: string
			city?: string
			country?: string
			email?: string
			experience?: string
			genre?: string
			genres?: Scalars["JSON"]
			hourlyRate?: number
			instruments?: Scalars["JSON"]
			isActive?: boolean
			isVerified?: boolean
			location?: string
			phone?: string
			profilePicture?: string
			rating?: number
			socialLinks?: Scalars["JSON"]
			stageName?: string
			totalGigs?: number
			user?: {
				_link: string | null
			}
			website?: string
			yearsExperience?: number
		}
	};
	/**
	* @private The context of this action.
	*/
	context: CreateMusicianActionContext;
}
/** Context of the `update` action on the `musician` model. */
export interface UpdateMusicianActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `musician` record this action is operating on.
	*/
	record: GadgetRecord<Select<Musician, DefaultMusicianServerSelection>>;
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
		musician?: {
			state?: string
			additionalPictures?: Scalars["JSON"]
			audio?: string
			audioFiles?: Scalars["JSON"]
			availability?: Scalars["JSON"]
			bio?: string
			city?: string
			country?: string
			email?: string
			experience?: string
			genre?: string
			genres?: Scalars["JSON"]
			hourlyRate?: number
			instruments?: Scalars["JSON"]
			isActive?: boolean
			isVerified?: boolean
			location?: string
			phone?: string
			profilePicture?: string
			rating?: number
			socialLinks?: Scalars["JSON"]
			stageName?: string
			totalGigs?: number
			user?: {
				_link: string | null
			}
			website?: string
			yearsExperience?: number
		}
		id?: string
	};
	/**
	* @private The context of this action.
	*/
	context: UpdateMusicianActionContext;
}
/** Context of the `findFirst` action on the `musician` model. */
export interface FindFirstMusicianActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `musician` record this action is operating on.
	*/
	record: GadgetRecord<Select<Musician, DefaultMusicianServerSelection>>;
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
	context: FindFirstMusicianActionContext;
}
