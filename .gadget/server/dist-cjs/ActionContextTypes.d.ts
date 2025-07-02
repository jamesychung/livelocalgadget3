import "path";

import { CreateBookingActionContext } from "./models/Booking";

import { UpdateBookingActionContext } from "./models/Booking";

import { CreateEventActionContext } from "./models/Event";

import { UpdateEventActionContext } from "./models/Event";

import { FindFirstEventActionContext } from "./models/Event";

import { CreateMusicianActionContext } from "./models/Musician";

import { UpdateMusicianActionContext } from "./models/Musician";

import { FindFirstMusicianActionContext } from "./models/Musician";

import { CreateVenueActionContext } from "./models/Venue";

import { UpdateVenueActionContext } from "./models/Venue";

import { FindFirstVenueActionContext } from "./models/Venue";

import { SignUpUserActionContext } from "./models/User";

import { SignInUserActionContext } from "./models/User";

import { SignOutUserActionContext } from "./models/User";

import { UpdateUserActionContext } from "./models/User";

import { DeleteUserActionContext } from "./models/User";

import { SendVerifyEmailUserActionContext } from "./models/User";

import { VerifyEmailUserActionContext } from "./models/User";

import { SendResetPasswordUserActionContext } from "./models/User";

import { ResetPasswordUserActionContext } from "./models/User";

import { ChangePasswordUserActionContext } from "./models/User";

import { CreateEventHistoryActionContext } from "./models/EventHistory";

import { CreateEventApplicationActionContext } from "./models/EventApplication";

import { SendBookingEmailsGlobalActionContext } from "./global-actions";

import { SendEmailGlobalActionContext } from "./global-actions";




declare module "../../../api/models/booking/actions/create" {
  export type ActionRun = (params: CreateBookingActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: CreateBookingActionContext) => Promise<any>;
}


declare module "../../../api/models/booking/actions/update" {
  export type ActionRun = (params: UpdateBookingActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: UpdateBookingActionContext) => Promise<any>;
}


declare module "../../../api/models/event/actions/create" {
  export type ActionRun = (params: CreateEventActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: CreateEventActionContext) => Promise<any>;
}


declare module "../../../api/models/event/actions/update" {
  export type ActionRun = (params: UpdateEventActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: UpdateEventActionContext) => Promise<any>;
}


declare module "../../../api/models/event/actions/findFirst" {
  export type ActionRun = (params: FindFirstEventActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: FindFirstEventActionContext) => Promise<any>;
}


declare module "../../../api/models/musician/actions/create" {
  export type ActionRun = (params: CreateMusicianActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: CreateMusicianActionContext) => Promise<any>;
}


declare module "../../../api/models/musician/actions/update" {
  export type ActionRun = (params: UpdateMusicianActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: UpdateMusicianActionContext) => Promise<any>;
}


declare module "../../../api/models/musician/actions/findFirst" {
  export type ActionRun = (params: FindFirstMusicianActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: FindFirstMusicianActionContext) => Promise<any>;
}


declare module "../../../api/models/venue/actions/create" {
  export type ActionRun = (params: CreateVenueActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: CreateVenueActionContext) => Promise<any>;
}


declare module "../../../api/models/venue/actions/update" {
  export type ActionRun = (params: UpdateVenueActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: UpdateVenueActionContext) => Promise<any>;
}


declare module "../../../api/models/venue/actions/findFirst" {
  export type ActionRun = (params: FindFirstVenueActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: FindFirstVenueActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/signUp" {
  export type ActionRun = (params: SignUpUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SignUpUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/signIn" {
  export type ActionRun = (params: SignInUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SignInUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/signOut" {
  export type ActionRun = (params: SignOutUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SignOutUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/update" {
  export type ActionRun = (params: UpdateUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: UpdateUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/delete" {
  export type ActionRun = (params: DeleteUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: DeleteUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/sendVerifyEmail" {
  export type ActionRun = (params: SendVerifyEmailUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SendVerifyEmailUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/verifyEmail" {
  export type ActionRun = (params: VerifyEmailUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: VerifyEmailUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/sendResetPassword" {
  export type ActionRun = (params: SendResetPasswordUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SendResetPasswordUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/resetPassword" {
  export type ActionRun = (params: ResetPasswordUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: ResetPasswordUserActionContext) => Promise<any>;
}


declare module "../../../api/models/user/actions/changePassword" {
  export type ActionRun = (params: ChangePasswordUserActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: ChangePasswordUserActionContext) => Promise<any>;
}


declare module "../../../api/models/eventHistory/actions/create" {
  export type ActionRun = (params: CreateEventHistoryActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: CreateEventHistoryActionContext) => Promise<any>;
}


declare module "../../../api/models/eventApplication/actions/create" {
  export type ActionRun = (params: CreateEventApplicationActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: CreateEventApplicationActionContext) => Promise<any>;
}


declare module "../../../api/actions/sendBookingEmails" {
  export type ActionRun = (params: SendBookingEmailsGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SendBookingEmailsGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/sendEmail" {
  export type ActionRun = (params: SendEmailGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SendEmailGlobalActionContext) => Promise<any>;
}

