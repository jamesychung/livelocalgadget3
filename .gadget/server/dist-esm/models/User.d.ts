
import { AmbientContext } from "../AmbientContext.js";
import { ActionExecutionScope, NotYetTyped, TriggerWithType } from "../types.js";
import { GadgetRecord, User } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";
export type DefaultUserServerSelection = {
	readonly __typename: true
	readonly id: true
	readonly createdAt: true
	readonly updatedAt: true
	readonly email: true
	readonly emailVerificationToken: true
	readonly emailVerificationTokenExpiration: true
	readonly emailVerified: true
	readonly firstName: true
	readonly googleImageUrl: true
	readonly googleProfileId: true
	readonly lastName: true
	readonly password: true
	readonly lastSignedIn: true
	readonly profilePicture: true
	readonly resetPasswordTokenExpiration: true
	readonly resetPasswordToken: true
	readonly roles: true
};
/** Context of the `signUp` action on the `user` model. */
export interface SignUpUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
	/**
	* @deprecated Use 'return' instead.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, webhook events etc.).
	*/
	trigger: TriggerWithType<"user_sign_up"> | TriggerWithType<"google_oauth_signup">;
	/**
	* An object containing the incoming data(this models fields) passed by triggers or user inputs.
	*/
	params: {};
	/**
	* @private The context of this action.
	*/
	context: SignUpUserActionContext;
}
/** Context of the `signIn` action on the `user` model. */
export interface SignInUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
	/**
	* @deprecated Use 'return' instead.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, webhook events etc.).
	*/
	trigger: TriggerWithType<"user_sign_in"> | TriggerWithType<"google_oauth_signin">;
	/**
	* An object containing the incoming data(this models fields) passed by triggers or user inputs.
	*/
	params: {};
	/**
	* @private The context of this action.
	*/
	context: SignInUserActionContext;
}
/** Context of the `signOut` action on the `user` model. */
export interface SignOutUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
	/**
	* @deprecated Use 'return' instead.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, webhook events etc.).
	*/
	trigger: TriggerWithType<"user_sign_out">;
	/**
	* An object containing the incoming data(this models fields) passed by triggers or user inputs.
	*/
	params: {
		id?: string
	};
	/**
	* @private The context of this action.
	*/
	context: SignOutUserActionContext;
}
/** Context of the `update` action on the `user` model. */
export interface UpdateUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
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
		user?: {
			email?: string
			emailVerificationToken?: string
			emailVerificationTokenExpiration?: Date
			emailVerified?: boolean
			firstName?: string
			googleImageUrl?: string
			googleProfileId?: string
			lastName?: string
			password?: string
			lastSignedIn?: Date
			profilePicture?: {
				fileName: string
				byteSize: number
				mimeType: string
				storageToken: string
				url: string
			}
			resetPasswordTokenExpiration?: Date
			resetPasswordToken?: string
			roles?: string[]
		}
		id?: string
	};
	/**
	* @private The context of this action.
	*/
	context: UpdateUserActionContext;
}
/** Context of the `delete` action on the `user` model. */
export interface DeleteUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
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
	context: DeleteUserActionContext;
}
/** Context of the `sendVerifyEmail` action on the `user` model. */
export interface SendVerifyEmailUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
	/**
	* @deprecated Use 'return' instead.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, webhook events etc.).
	*/
	trigger: TriggerWithType<"user_send_verify_email">;
	/**
	* An object containing the incoming data(this models fields) passed by triggers or user inputs.
	*/
	params: {} & {
		user?: {
			emailVerified?: boolean
			emailVerificationToken?: string
			emailVerificationTokenExpiration?: Date
			emailVerificationCode?: string
		}
	};
	/**
	* @private The context of this action.
	*/
	context: SendVerifyEmailUserActionContext;
}
/** Context of the `verifyEmail` action on the `user` model. */
export interface VerifyEmailUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
	/**
	* @deprecated Use 'return' instead.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, webhook events etc.).
	*/
	trigger: TriggerWithType<"user_verify_email">;
	/**
	* An object containing the incoming data(this models fields) passed by triggers or user inputs.
	*/
	params: {
		code?: string
	};
	/**
	* @private The context of this action.
	*/
	context: VerifyEmailUserActionContext;
}
/** Context of the `sendResetPassword` action on the `user` model. */
export interface SendResetPasswordUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
	/**
	* @deprecated Use 'return' instead.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, webhook events etc.).
	*/
	trigger: TriggerWithType<"user_send_reset_password">;
	/**
	* An object containing the incoming data(this models fields) passed by triggers or user inputs.
	*/
	params: {} & {
		user?: {
			resetPasswordToken?: string
			resetPasswordTokenExpiration?: Date
			resetPasswordCode?: string
		}
	};
	/**
	* @private The context of this action.
	*/
	context: SendResetPasswordUserActionContext;
}
/** Context of the `resetPassword` action on the `user` model. */
export interface ResetPasswordUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
	/**
	* @deprecated Use 'return' instead.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, webhook events etc.).
	*/
	trigger: TriggerWithType<"user_reset_password">;
	/**
	* An object containing the incoming data(this models fields) passed by triggers or user inputs.
	*/
	params: {
		code?: string
	};
	/**
	* @private The context of this action.
	*/
	context: ResetPasswordUserActionContext;
}
/** Context of the `changePassword` action on the `user` model. */
export interface ChangePasswordUserActionContext extends AmbientContext {
	/**
	* The model this action is operating on
	*/
	model: NotYetTyped;
	/**
	* An object specifying the `user` record this action is operating on.
	*/
	record: GadgetRecord<Select<User, DefaultUserServerSelection>>;
	/**
	* @deprecated Use 'return' instead.
	*/
	scope: ActionExecutionScope;
	/**
	* An object specifying the trigger to this action (e.g. API call, webhook events etc.).
	*/
	trigger: TriggerWithType<"user_change_password">;
	/**
	* An object containing the incoming data(this models fields) passed by triggers or user inputs.
	*/
	params: {
		id?: string
	};
	/**
	* @private The context of this action.
	*/
	context: ChangePasswordUserActionContext;
}
