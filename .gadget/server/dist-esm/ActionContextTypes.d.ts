import "path";

import { SignUpUserActionContext } from "./models/User.js";

import { SignInUserActionContext } from "./models/User.js";

import { SignOutUserActionContext } from "./models/User.js";

import { UpdateUserActionContext } from "./models/User.js";

import { DeleteUserActionContext } from "./models/User.js";

import { SendVerifyEmailUserActionContext } from "./models/User.js";

import { VerifyEmailUserActionContext } from "./models/User.js";

import { SendResetPasswordUserActionContext } from "./models/User.js";

import { ResetPasswordUserActionContext } from "./models/User.js";

import { ChangePasswordUserActionContext } from "./models/User.js";

import { CreateEventActionContext } from "./models/Event.js";

import { UpdateEventActionContext } from "./models/Event.js";

import { FindFirstEventActionContext } from "./models/Event.js";

import { CreateMusicianActionContext } from "./models/Musician.js";

import { UpdateMusicianActionContext } from "./models/Musician.js";

import { FindFirstMusicianActionContext } from "./models/Musician.js";

import { CreateVenueActionContext } from "./models/Venue.js";

import { UpdateVenueActionContext } from "./models/Venue.js";

import { FindFirstVenueActionContext } from "./models/Venue.js";

import { SeedCreateEventsGlobalActionContext } from "./global-actions.js";

import { SeedCreateMusiciansGlobalActionContext } from "./global-actions.js";

import { SeedCreateReviewsGlobalActionContext } from "./global-actions.js";

import { SeedCreateUsersGlobalActionContext } from "./global-actions.js";

import { SeedCreateVenuesGlobalActionContext } from "./global-actions.js";

import { SeedDebugSeedGlobalActionContext } from "./global-actions.js";

import { SeedQuickSeedGlobalActionContext } from "./global-actions.js";

import { SeedSeedAllDataGlobalActionContext } from "./global-actions.js";

import { SeedSeedDataGlobalActionContext } from "./global-actions.js";

import { SeedSimpleSeedGlobalActionContext } from "./global-actions.js";

import { SeedTestContextGlobalActionContext } from "./global-actions.js";




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


declare module "../../../api/actions/seed/createEvents" {
  export type ActionRun = (params: SeedCreateEventsGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedCreateEventsGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/createMusicians" {
  export type ActionRun = (params: SeedCreateMusiciansGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedCreateMusiciansGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/createReviews" {
  export type ActionRun = (params: SeedCreateReviewsGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedCreateReviewsGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/createUsers" {
  export type ActionRun = (params: SeedCreateUsersGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedCreateUsersGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/createVenues" {
  export type ActionRun = (params: SeedCreateVenuesGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedCreateVenuesGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/debugSeed" {
  export type ActionRun = (params: SeedDebugSeedGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedDebugSeedGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/quickSeed" {
  export type ActionRun = (params: SeedQuickSeedGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedQuickSeedGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/seedAllData" {
  export type ActionRun = (params: SeedSeedAllDataGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedSeedAllDataGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/seedData" {
  export type ActionRun = (params: SeedSeedDataGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedSeedDataGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/simpleSeed" {
  export type ActionRun = (params: SeedSimpleSeedGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedSimpleSeedGlobalActionContext) => Promise<any>;
}


declare module "../../../api/actions/seed/testContext" {
  export type ActionRun = (params: SeedTestContextGlobalActionContext) => Promise<any>;
  export type ActionOnSuccess = (params: SeedTestContextGlobalActionContext) => Promise<any>;
}

