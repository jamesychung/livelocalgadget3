import { FieldSelection, FilterNever } from "@gadgetinc/api-client-core";
import { ComputedViewWithoutVariables, ComputedViewWithVariables, ComputedViewFunctionWithoutVariables, ComputedViewFunctionWithVariables } from "./computedViews.js";
export type JSONValue = string | number | boolean | JSONObject | JSONArray;
interface JSONObject {
    [x: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {
}
export declare enum GadgetFieldType {
    Any = 0,
    Array = 1,
    BelongsTo = 2,
    Boolean = 3,
    Code = 4,
    Color = 5,
    Computed = 6,
    DateTime = 7,
    Email = 8,
    EncryptedString = 9,
    Enum = 10,
    File = 11,
    HasMany = 12,
    HasManyThrough = 13,
    HasOne = 14,
    ID = 15,
    JSON = 16,
    Money = 17,
    Null = 18,
    Number = 19,
    Object = 20,
    Password = 21,
    RecordState = 22,
    RichText = 23,
    RoleAssignments = 24,
    String = 25,
    URL = 26,
    Vector = 27
}
export declare enum BackgroundActionPriority {
    DEFAULT = 0,
    HIGH = 1,
    LOW = 2,
    PLATFORM = 3
}
export declare enum BackgroundActionOutcome {
    failed = 0,
    completed = 1
}
export type GadgetFieldValidationUnion = AvailableGadgetRegexFieldValidationSelection | AvailableGadgetRangeFieldValidationSelection | AvailableGadgetOnlyImageFileFieldValidationSelection | AvailableGadgetGenericFieldValidationSelection;
export type AvailableGadgetFieldValidationUnionSelection = GadgetRegexFieldValidation | GadgetRangeFieldValidation | GadgetOnlyImageFileFieldValidation | GadgetGenericFieldValidation;
/** Represents the possible values of the primaryRole enum. */
export type UserPrimaryRoleEnum = "user" | "musician" | "venue";
/** A sort order for a field. Can be Ascending or Descending. */
export type SortOrder = "Ascending" | "Descending";
/** Represents one session result record in internal api calls. Returns a JSON blob of all the record's fields. */
export type InternalSessionRecord = Scalars["JSONObject"];
/** Represents one booking result record in internal api calls. Returns a JSON blob of all the record's fields. */
export type InternalBookingRecord = Scalars["JSONObject"];
/** Represents one event result record in internal api calls. Returns a JSON blob of all the record's fields. */
export type InternalEventRecord = Scalars["JSONObject"];
/** Represents one musician result record in internal api calls. Returns a JSON blob of all the record's fields. */
export type InternalMusicianRecord = Scalars["JSONObject"];
/** Represents one review result record in internal api calls. Returns a JSON blob of all the record's fields. */
export type InternalReviewRecord = Scalars["JSONObject"];
/** Represents one venue result record in internal api calls. Returns a JSON blob of all the record's fields. */
export type InternalVenueRecord = Scalars["JSONObject"];
/** Represents one user result record in internal api calls. Returns a JSON blob of all the record's fields. */
export type InternalUserRecord = Scalars["JSONObject"];
/** The `Upload` scalar type represents a file upload. */
export type Upload = any;
export type BackgroundActionResult = AvailableSeedCreateEventsResultSelection | AvailableSeedCreateMusiciansResultSelection | AvailableSeedCreateReviewsResultSelection | AvailableSeedCreateUsersResultSelection | AvailableSeedCreateVenuesResultSelection | AvailableSeedDebugSeedResultSelection | AvailableSeedQuickSeedResultSelection | AvailableSeedSeedAllDataResultSelection | AvailableSeedSeedDataResultSelection | AvailableSeedSimpleSeedResultSelection | AvailableSeedTestContextResultSelection | AvailableCreateMusicianResultSelection | AvailableUpdateMusicianResultSelection | AvailableFindFirstMusicianResultSelection | AvailableSignUpUserResultSelection | AvailableSignInUserResultSelection | AvailableSignOutUserResultSelection | AvailableUpdateUserResultSelection | AvailableDeleteUserResultSelection | AvailableSendVerifyEmailUserResultSelection | AvailableVerifyEmailUserResultSelection | AvailableSendResetPasswordUserResultSelection | AvailableResetPasswordUserResultSelection | AvailableChangePasswordUserResultSelection | AvailableUpdateRoleUserResultSelection;
export type AvailableBackgroundActionResultSelection = SeedCreateEventsResult | SeedCreateMusiciansResult | SeedCreateReviewsResult | SeedCreateUsersResult | SeedCreateVenuesResult | SeedDebugSeedResult | SeedQuickSeedResult | SeedSeedAllDataResult | SeedSeedDataResult | SeedSimpleSeedResult | SeedTestContextResult | CreateMusicianResult | UpdateMusicianResult | FindFirstMusicianResult | SignUpUserResult | SignInUserResult | SignOutUserResult | UpdateUserResult | DeleteUserResult | SendVerifyEmailUserResult | VerifyEmailUserResult | SendResetPasswordUserResult | ResetPasswordUserResult | ChangePasswordUserResult | UpdateRoleUserResult;
export type SessionFilter = {
    id?: IDEqualsFilter | null;
    user?: IDEqualsFilter | null;
    userId?: IDEqualsFilter | null;
};
export type IDEqualsFilter = {
    equals?: (Scalars['GadgetID'] | null) | null;
};
export type EventSort = {
    /** Sort the results by the id field. Defaults to ascending (smallest value first). */
    id?: SortOrder | null;
    /** Sort the results by the createdAt field. Defaults to ascending (smallest value first). */
    createdAt?: SortOrder | null;
    /** Sort the results by the updatedAt field. Defaults to ascending (smallest value first). */
    updatedAt?: SortOrder | null;
    /** Sort the results by the availableTickets field. Defaults to ascending (smallest value first). */
    availableTickets?: SortOrder | null;
    /** Sort the results by the category field. Defaults to ascending (smallest value first). */
    category?: SortOrder | null;
    /** Sort the results by the date field. Defaults to ascending (smallest value first). */
    date?: SortOrder | null;
    /** Sort the results by the description field. Defaults to ascending (smallest value first). */
    description?: SortOrder | null;
    /** Sort the results by the endTime field. Defaults to ascending (smallest value first). */
    endTime?: SortOrder | null;
    /** Sort the results by the image field. Defaults to ascending (smallest value first). */
    image?: SortOrder | null;
    /** Sort the results by the isActive field. Defaults to ascending (smallest value first). */
    isActive?: SortOrder | null;
    /** Sort the results by the isPublic field. Defaults to ascending (smallest value first). */
    isPublic?: SortOrder | null;
    /** Sort the results by the setlist field. Defaults to ascending (smallest value first). */
    setlist?: SortOrder | null;
    /** Sort the results by the startTime field. Defaults to ascending (smallest value first). */
    startTime?: SortOrder | null;
    /** Sort the results by the status field. Defaults to ascending (smallest value first). */
    status?: SortOrder | null;
    /** Sort the results by the ticketPrice field. Defaults to ascending (smallest value first). */
    ticketPrice?: SortOrder | null;
    /** Sort the results by the ticketType field. Defaults to ascending (smallest value first). */
    ticketType?: SortOrder | null;
    /** Sort the results by the title field. Defaults to ascending (smallest value first). */
    title?: SortOrder | null;
    /** Sort the results by the totalCapacity field. Defaults to ascending (smallest value first). */
    totalCapacity?: SortOrder | null;
};
export type EventFilter = {
    AND?: (EventFilter | null)[];
    OR?: (EventFilter | null)[];
    NOT?: (EventFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    availableTickets?: FloatFilter | null;
    category?: StringFilter | null;
    createdById?: IDFilter | null;
    createdBy?: UserRelationshipFilter | null;
    date?: DateTimeFilter | null;
    description?: StringFilter | null;
    endTime?: StringFilter | null;
    image?: StringFilter | null;
    isActive?: BooleanFilter | null;
    isPublic?: BooleanFilter | null;
    musicianId?: IDFilter | null;
    musician?: MusicianRelationshipFilter | null;
    setlist?: JSONFilter | null;
    startTime?: StringFilter | null;
    status?: StringFilter | null;
    ticketPrice?: FloatFilter | null;
    ticketType?: StringFilter | null;
    title?: StringFilter | null;
    totalCapacity?: FloatFilter | null;
    venueId?: IDFilter | null;
    venue?: VenueRelationshipFilter | null;
};
export type IDFilter = {
    equals?: (Scalars['GadgetID'] | null) | null;
    notEquals?: (Scalars['GadgetID'] | null) | null;
    isSet?: (Scalars['Boolean'] | null) | null;
    in?: ((Scalars['GadgetID'] | null) | null)[];
    notIn?: ((Scalars['GadgetID'] | null) | null)[];
    lessThan?: (Scalars['GadgetID'] | null) | null;
    lessThanOrEqual?: (Scalars['GadgetID'] | null) | null;
    greaterThan?: (Scalars['GadgetID'] | null) | null;
    greaterThanOrEqual?: (Scalars['GadgetID'] | null) | null;
};
export type DateTimeFilter = {
    equals?: Date | Scalars['ISO8601DateString'] | null;
    notEquals?: Date | Scalars['ISO8601DateString'] | null;
    isSet?: (Scalars['Boolean'] | null) | null;
    in?: (Date | Scalars['ISO8601DateString'] | null)[];
    notIn?: (Date | Scalars['ISO8601DateString'] | null)[];
    lessThan?: Date | Scalars['ISO8601DateString'] | null;
    lessThanOrEqual?: Date | Scalars['ISO8601DateString'] | null;
    greaterThan?: Date | Scalars['ISO8601DateString'] | null;
    greaterThanOrEqual?: Date | Scalars['ISO8601DateString'] | null;
    before?: Date | Scalars['ISO8601DateString'] | null;
    after?: Date | Scalars['ISO8601DateString'] | null;
};
export type FloatFilter = {
    equals?: (Scalars['Float'] | null) | null;
    notEquals?: (Scalars['Float'] | null) | null;
    isSet?: (Scalars['Boolean'] | null) | null;
    in?: ((Scalars['Float'] | null) | null)[];
    notIn?: ((Scalars['Float'] | null) | null)[];
    lessThan?: (Scalars['Float'] | null) | null;
    lessThanOrEqual?: (Scalars['Float'] | null) | null;
    greaterThan?: (Scalars['Float'] | null) | null;
    greaterThanOrEqual?: (Scalars['Float'] | null) | null;
};
export type StringFilter = {
    equals?: (Scalars['String'] | null) | null;
    notEquals?: (Scalars['String'] | null) | null;
    isSet?: (Scalars['Boolean'] | null) | null;
    in?: ((Scalars['String'] | null) | null)[];
    notIn?: ((Scalars['String'] | null) | null)[];
    lessThan?: (Scalars['String'] | null) | null;
    lessThanOrEqual?: (Scalars['String'] | null) | null;
    greaterThan?: (Scalars['String'] | null) | null;
    greaterThanOrEqual?: (Scalars['String'] | null) | null;
    startsWith?: (Scalars['String'] | null) | null;
};
export type UserRelationshipFilter = {
    AND?: (UserRelationshipFilter | null)[];
    OR?: (UserRelationshipFilter | null)[];
    NOT?: (UserRelationshipFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    isSet?: (Scalars['Boolean'] | null) | null;
    emailVerified?: BooleanFilter | null;
    email?: StringFilter | null;
    lastSignedIn?: DateTimeFilter | null;
    firstName?: StringFilter | null;
    roles?: RoleAssignmentFilter | null;
    googleImageUrl?: StringFilter | null;
    emailVerificationToken?: StringFilter | null;
    primaryRole?: SingleEnumFilter | null;
    emailVerificationTokenExpiration?: DateTimeFilter | null;
    resetPasswordTokenExpiration?: DateTimeFilter | null;
    resetPasswordToken?: StringFilter | null;
    lastName?: StringFilter | null;
    googleProfileId?: StringFilter | null;
};
export type BooleanFilter = {
    isSet?: (Scalars['Boolean'] | null) | null;
    equals?: (Scalars['Boolean'] | null) | null;
    notEquals?: (Scalars['Boolean'] | null) | null;
};
export type RoleAssignmentFilter = {
    isSet?: (Scalars['Boolean'] | null) | null;
    equals?: ((Scalars['String'] | null) | null)[];
    notEquals?: ((Scalars['String'] | null) | null)[];
    contains?: ((Scalars['String'] | null) | null)[];
};
export type SingleEnumFilter = {
    isSet?: (Scalars['Boolean'] | null) | null;
    equals?: (Scalars['String'] | null) | null;
    notEquals?: (Scalars['String'] | null) | null;
    in?: ((Scalars['String'] | null) | null)[];
};
export type MusicianRelationshipFilter = {
    AND?: (MusicianRelationshipFilter | null)[];
    OR?: (MusicianRelationshipFilter | null)[];
    NOT?: (MusicianRelationshipFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    isSet?: (Scalars['Boolean'] | null) | null;
    state?: StringFilter | null;
    reviews?: ReviewsRelationshipFilter | null;
    bookings?: BookingsRelationshipFilter | null;
    events?: EventsRelationshipFilter | null;
    availability?: JSONFilter | null;
    bio?: StringFilter | null;
    city?: StringFilter | null;
    country?: StringFilter | null;
    email?: StringFilter | null;
    experience?: StringFilter | null;
    genre?: StringFilter | null;
    genres?: JSONFilter | null;
    hourlyRate?: FloatFilter | null;
    instruments?: JSONFilter | null;
    isActive?: BooleanFilter | null;
    isVerified?: BooleanFilter | null;
    location?: StringFilter | null;
    name?: StringFilter | null;
    phone?: StringFilter | null;
    profilePicture?: StringFilter | null;
    rating?: FloatFilter | null;
    socialLinks?: JSONFilter | null;
    stageName?: StringFilter | null;
    totalGigs?: FloatFilter | null;
    userId?: IDFilter | null;
    user?: UserRelationshipFilter | null;
    website?: StringFilter | null;
    yearsExperience?: FloatFilter | null;
};
export type ReviewsRelationshipFilter = {
    some?: ReviewsInnerRelationshipFilter | null;
    every?: ReviewsInnerRelationshipFilter | null;
};
export type ReviewsInnerRelationshipFilter = {
    AND?: (ReviewsInnerRelationshipFilter | null)[];
    OR?: (ReviewsInnerRelationshipFilter | null)[];
    NOT?: (ReviewsInnerRelationshipFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    comment?: StringFilter | null;
    eventId?: IDFilter | null;
    event?: VenueRelationshipFilter | null;
    isActive?: BooleanFilter | null;
    isVerified?: BooleanFilter | null;
    musicianId?: IDFilter | null;
    musician?: MusicianRelationshipFilter | null;
    rating?: FloatFilter | null;
    reviewerId?: IDFilter | null;
    reviewer?: UserRelationshipFilter | null;
    reviewType?: StringFilter | null;
    venueId?: IDFilter | null;
    venue?: VenueRelationshipFilter | null;
};
export type VenueRelationshipFilter = {
    AND?: (VenueRelationshipFilter | null)[];
    OR?: (VenueRelationshipFilter | null)[];
    NOT?: (VenueRelationshipFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    isSet?: (Scalars['Boolean'] | null) | null;
    state?: StringFilter | null;
    events?: EventsRelationshipFilter | null;
    bookings?: BookingsRelationshipFilter | null;
    address?: StringFilter | null;
    amenities?: JSONFilter | null;
    capacity?: FloatFilter | null;
    city?: StringFilter | null;
    country?: StringFilter | null;
    description?: StringFilter | null;
    email?: StringFilter | null;
    genres?: JSONFilter | null;
    hours?: JSONFilter | null;
    isActive?: BooleanFilter | null;
    isVerified?: BooleanFilter | null;
    name?: StringFilter | null;
    ownerId?: IDFilter | null;
    owner?: UserRelationshipFilter | null;
    phone?: StringFilter | null;
    priceRange?: StringFilter | null;
    profilePicture?: StringFilter | null;
    rating?: FloatFilter | null;
    socialLinks?: JSONFilter | null;
    type?: StringFilter | null;
    website?: StringFilter | null;
    zipCode?: StringFilter | null;
    reviews?: ReviewsRelationshipFilter | null;
};
export type EventsRelationshipFilter = {
    some?: EventsInnerRelationshipFilter | null;
    every?: EventsInnerRelationshipFilter | null;
};
export type EventsInnerRelationshipFilter = {
    AND?: (EventsInnerRelationshipFilter | null)[];
    OR?: (EventsInnerRelationshipFilter | null)[];
    NOT?: (EventsInnerRelationshipFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    availableTickets?: FloatFilter | null;
    category?: StringFilter | null;
    createdById?: IDFilter | null;
    createdBy?: UserRelationshipFilter | null;
    date?: DateTimeFilter | null;
    description?: StringFilter | null;
    endTime?: StringFilter | null;
    image?: StringFilter | null;
    isActive?: BooleanFilter | null;
    isPublic?: BooleanFilter | null;
    musicianId?: IDFilter | null;
    musician?: MusicianRelationshipFilter | null;
    setlist?: JSONFilter | null;
    startTime?: StringFilter | null;
    status?: StringFilter | null;
    ticketPrice?: FloatFilter | null;
    ticketType?: StringFilter | null;
    title?: StringFilter | null;
    totalCapacity?: FloatFilter | null;
    venueId?: IDFilter | null;
    venue?: VenueRelationshipFilter | null;
};
export type JSONFilter = {
    isSet?: (Scalars['Boolean'] | null) | null;
    equals?: (Scalars['JSON'] | null) | null;
    in?: ((Scalars['JSON'] | null) | null)[];
    notIn?: ((Scalars['JSON'] | null) | null)[];
    notEquals?: (Scalars['JSON'] | null) | null;
    matches?: (Scalars['JSON'] | null) | null;
};
export type BookingsRelationshipFilter = {
    some?: BookingsInnerRelationshipFilter | null;
    every?: BookingsInnerRelationshipFilter | null;
};
export type BookingsInnerRelationshipFilter = {
    AND?: (BookingsInnerRelationshipFilter | null)[];
    OR?: (BookingsInnerRelationshipFilter | null)[];
    NOT?: (BookingsInnerRelationshipFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    bookedById?: IDFilter | null;
    bookedBy?: UserRelationshipFilter | null;
    date?: DateTimeFilter | null;
    depositAmount?: FloatFilter | null;
    depositPaid?: BooleanFilter | null;
    endTime?: StringFilter | null;
    fullPaymentPaid?: BooleanFilter | null;
    isActive?: BooleanFilter | null;
    musicianId?: IDFilter | null;
    musician?: MusicianRelationshipFilter | null;
    notes?: StringFilter | null;
    specialRequirements?: StringFilter | null;
    startTime?: StringFilter | null;
    status?: StringFilter | null;
    totalAmount?: FloatFilter | null;
    venueId?: IDFilter | null;
    venue?: VenueRelationshipFilter | null;
};
export type BookingSort = {
    /** Sort the results by the id field. Defaults to ascending (smallest value first). */
    id?: SortOrder | null;
    /** Sort the results by the createdAt field. Defaults to ascending (smallest value first). */
    createdAt?: SortOrder | null;
    /** Sort the results by the updatedAt field. Defaults to ascending (smallest value first). */
    updatedAt?: SortOrder | null;
    /** Sort the results by the date field. Defaults to ascending (smallest value first). */
    date?: SortOrder | null;
    /** Sort the results by the depositAmount field. Defaults to ascending (smallest value first). */
    depositAmount?: SortOrder | null;
    /** Sort the results by the depositPaid field. Defaults to ascending (smallest value first). */
    depositPaid?: SortOrder | null;
    /** Sort the results by the endTime field. Defaults to ascending (smallest value first). */
    endTime?: SortOrder | null;
    /** Sort the results by the fullPaymentPaid field. Defaults to ascending (smallest value first). */
    fullPaymentPaid?: SortOrder | null;
    /** Sort the results by the isActive field. Defaults to ascending (smallest value first). */
    isActive?: SortOrder | null;
    /** Sort the results by the notes field. Defaults to ascending (smallest value first). */
    notes?: SortOrder | null;
    /** Sort the results by the specialRequirements field. Defaults to ascending (smallest value first). */
    specialRequirements?: SortOrder | null;
    /** Sort the results by the startTime field. Defaults to ascending (smallest value first). */
    startTime?: SortOrder | null;
    /** Sort the results by the status field. Defaults to ascending (smallest value first). */
    status?: SortOrder | null;
    /** Sort the results by the totalAmount field. Defaults to ascending (smallest value first). */
    totalAmount?: SortOrder | null;
};
export type BookingFilter = {
    AND?: (BookingFilter | null)[];
    OR?: (BookingFilter | null)[];
    NOT?: (BookingFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    bookedById?: IDFilter | null;
    bookedBy?: UserRelationshipFilter | null;
    date?: DateTimeFilter | null;
    depositAmount?: FloatFilter | null;
    depositPaid?: BooleanFilter | null;
    endTime?: StringFilter | null;
    fullPaymentPaid?: BooleanFilter | null;
    isActive?: BooleanFilter | null;
    musicianId?: IDFilter | null;
    musician?: MusicianRelationshipFilter | null;
    notes?: StringFilter | null;
    specialRequirements?: StringFilter | null;
    startTime?: StringFilter | null;
    status?: StringFilter | null;
    totalAmount?: FloatFilter | null;
    venueId?: IDFilter | null;
    venue?: VenueRelationshipFilter | null;
};
export type ReviewSort = {
    /** Sort the results by the id field. Defaults to ascending (smallest value first). */
    id?: SortOrder | null;
    /** Sort the results by the createdAt field. Defaults to ascending (smallest value first). */
    createdAt?: SortOrder | null;
    /** Sort the results by the updatedAt field. Defaults to ascending (smallest value first). */
    updatedAt?: SortOrder | null;
    /** Sort the results by the comment field. Defaults to ascending (smallest value first). */
    comment?: SortOrder | null;
    /** Sort the results by the isActive field. Defaults to ascending (smallest value first). */
    isActive?: SortOrder | null;
    /** Sort the results by the isVerified field. Defaults to ascending (smallest value first). */
    isVerified?: SortOrder | null;
    /** Sort the results by the rating field. Defaults to ascending (smallest value first). */
    rating?: SortOrder | null;
    /** Sort the results by the reviewType field. Defaults to ascending (smallest value first). */
    reviewType?: SortOrder | null;
};
export type ReviewFilter = {
    AND?: (ReviewFilter | null)[];
    OR?: (ReviewFilter | null)[];
    NOT?: (ReviewFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    comment?: StringFilter | null;
    eventId?: IDFilter | null;
    event?: VenueRelationshipFilter | null;
    isActive?: BooleanFilter | null;
    isVerified?: BooleanFilter | null;
    musicianId?: IDFilter | null;
    musician?: MusicianRelationshipFilter | null;
    rating?: FloatFilter | null;
    reviewerId?: IDFilter | null;
    reviewer?: UserRelationshipFilter | null;
    reviewType?: StringFilter | null;
    venueId?: IDFilter | null;
    venue?: VenueRelationshipFilter | null;
};
export type MusicianSort = {
    /** Sort the results by the id field. Defaults to ascending (smallest value first). */
    id?: SortOrder | null;
    /** Sort the results by the createdAt field. Defaults to ascending (smallest value first). */
    createdAt?: SortOrder | null;
    /** Sort the results by the updatedAt field. Defaults to ascending (smallest value first). */
    updatedAt?: SortOrder | null;
    /** Sort the results by the state field. Defaults to ascending (smallest value first). */
    state?: SortOrder | null;
    /** Sort the results by the availability field. Defaults to ascending (smallest value first). */
    availability?: SortOrder | null;
    /** Sort the results by the bio field. Defaults to ascending (smallest value first). */
    bio?: SortOrder | null;
    /** Sort the results by the city field. Defaults to ascending (smallest value first). */
    city?: SortOrder | null;
    /** Sort the results by the country field. Defaults to ascending (smallest value first). */
    country?: SortOrder | null;
    /** Sort the results by the email field. Defaults to ascending (smallest value first). */
    email?: SortOrder | null;
    /** Sort the results by the experience field. Defaults to ascending (smallest value first). */
    experience?: SortOrder | null;
    /** Sort the results by the genre field. Defaults to ascending (smallest value first). */
    genre?: SortOrder | null;
    /** Sort the results by the genres field. Defaults to ascending (smallest value first). */
    genres?: SortOrder | null;
    /** Sort the results by the hourlyRate field. Defaults to ascending (smallest value first). */
    hourlyRate?: SortOrder | null;
    /** Sort the results by the instruments field. Defaults to ascending (smallest value first). */
    instruments?: SortOrder | null;
    /** Sort the results by the isActive field. Defaults to ascending (smallest value first). */
    isActive?: SortOrder | null;
    /** Sort the results by the isVerified field. Defaults to ascending (smallest value first). */
    isVerified?: SortOrder | null;
    /** Sort the results by the location field. Defaults to ascending (smallest value first). */
    location?: SortOrder | null;
    /** Sort the results by the name field. Defaults to ascending (smallest value first). */
    name?: SortOrder | null;
    /** Sort the results by the phone field. Defaults to ascending (smallest value first). */
    phone?: SortOrder | null;
    /** Sort the results by the profilePicture field. Defaults to ascending (smallest value first). */
    profilePicture?: SortOrder | null;
    /** Sort the results by the rating field. Defaults to ascending (smallest value first). */
    rating?: SortOrder | null;
    /** Sort the results by the socialLinks field. Defaults to ascending (smallest value first). */
    socialLinks?: SortOrder | null;
    /** Sort the results by the stageName field. Defaults to ascending (smallest value first). */
    stageName?: SortOrder | null;
    /** Sort the results by the totalGigs field. Defaults to ascending (smallest value first). */
    totalGigs?: SortOrder | null;
    /** Sort the results by the website field. Defaults to ascending (smallest value first). */
    website?: SortOrder | null;
    /** Sort the results by the yearsExperience field. Defaults to ascending (smallest value first). */
    yearsExperience?: SortOrder | null;
};
export type MusicianFilter = {
    AND?: (MusicianFilter | null)[];
    OR?: (MusicianFilter | null)[];
    NOT?: (MusicianFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    state?: StringFilter | null;
    reviews?: ReviewsRelationshipFilter | null;
    bookings?: BookingsRelationshipFilter | null;
    events?: EventsRelationshipFilter | null;
    availability?: JSONFilter | null;
    bio?: StringFilter | null;
    city?: StringFilter | null;
    country?: StringFilter | null;
    email?: StringFilter | null;
    experience?: StringFilter | null;
    genre?: StringFilter | null;
    genres?: JSONFilter | null;
    hourlyRate?: FloatFilter | null;
    instruments?: JSONFilter | null;
    isActive?: BooleanFilter | null;
    isVerified?: BooleanFilter | null;
    location?: StringFilter | null;
    name?: StringFilter | null;
    phone?: StringFilter | null;
    profilePicture?: StringFilter | null;
    rating?: FloatFilter | null;
    socialLinks?: JSONFilter | null;
    stageName?: StringFilter | null;
    totalGigs?: FloatFilter | null;
    userId?: IDFilter | null;
    user?: UserRelationshipFilter | null;
    website?: StringFilter | null;
    yearsExperience?: FloatFilter | null;
};
export type VenueSort = {
    /** Sort the results by the id field. Defaults to ascending (smallest value first). */
    id?: SortOrder | null;
    /** Sort the results by the createdAt field. Defaults to ascending (smallest value first). */
    createdAt?: SortOrder | null;
    /** Sort the results by the updatedAt field. Defaults to ascending (smallest value first). */
    updatedAt?: SortOrder | null;
    /** Sort the results by the state field. Defaults to ascending (smallest value first). */
    state?: SortOrder | null;
    /** Sort the results by the address field. Defaults to ascending (smallest value first). */
    address?: SortOrder | null;
    /** Sort the results by the amenities field. Defaults to ascending (smallest value first). */
    amenities?: SortOrder | null;
    /** Sort the results by the capacity field. Defaults to ascending (smallest value first). */
    capacity?: SortOrder | null;
    /** Sort the results by the city field. Defaults to ascending (smallest value first). */
    city?: SortOrder | null;
    /** Sort the results by the country field. Defaults to ascending (smallest value first). */
    country?: SortOrder | null;
    /** Sort the results by the description field. Defaults to ascending (smallest value first). */
    description?: SortOrder | null;
    /** Sort the results by the email field. Defaults to ascending (smallest value first). */
    email?: SortOrder | null;
    /** Sort the results by the genres field. Defaults to ascending (smallest value first). */
    genres?: SortOrder | null;
    /** Sort the results by the hours field. Defaults to ascending (smallest value first). */
    hours?: SortOrder | null;
    /** Sort the results by the isActive field. Defaults to ascending (smallest value first). */
    isActive?: SortOrder | null;
    /** Sort the results by the isVerified field. Defaults to ascending (smallest value first). */
    isVerified?: SortOrder | null;
    /** Sort the results by the name field. Defaults to ascending (smallest value first). */
    name?: SortOrder | null;
    /** Sort the results by the phone field. Defaults to ascending (smallest value first). */
    phone?: SortOrder | null;
    /** Sort the results by the priceRange field. Defaults to ascending (smallest value first). */
    priceRange?: SortOrder | null;
    /** Sort the results by the profilePicture field. Defaults to ascending (smallest value first). */
    profilePicture?: SortOrder | null;
    /** Sort the results by the rating field. Defaults to ascending (smallest value first). */
    rating?: SortOrder | null;
    /** Sort the results by the socialLinks field. Defaults to ascending (smallest value first). */
    socialLinks?: SortOrder | null;
    /** Sort the results by the type field. Defaults to ascending (smallest value first). */
    type?: SortOrder | null;
    /** Sort the results by the website field. Defaults to ascending (smallest value first). */
    website?: SortOrder | null;
    /** Sort the results by the zipCode field. Defaults to ascending (smallest value first). */
    zipCode?: SortOrder | null;
};
export type VenueFilter = {
    AND?: (VenueFilter | null)[];
    OR?: (VenueFilter | null)[];
    NOT?: (VenueFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    state?: StringFilter | null;
    events?: EventsRelationshipFilter | null;
    bookings?: BookingsRelationshipFilter | null;
    address?: StringFilter | null;
    amenities?: JSONFilter | null;
    capacity?: FloatFilter | null;
    city?: StringFilter | null;
    country?: StringFilter | null;
    description?: StringFilter | null;
    email?: StringFilter | null;
    genres?: JSONFilter | null;
    hours?: JSONFilter | null;
    isActive?: BooleanFilter | null;
    isVerified?: BooleanFilter | null;
    name?: StringFilter | null;
    ownerId?: IDFilter | null;
    owner?: UserRelationshipFilter | null;
    phone?: StringFilter | null;
    priceRange?: StringFilter | null;
    profilePicture?: StringFilter | null;
    rating?: FloatFilter | null;
    socialLinks?: JSONFilter | null;
    type?: StringFilter | null;
    website?: StringFilter | null;
    zipCode?: StringFilter | null;
    reviews?: ReviewsRelationshipFilter | null;
};
export type UserSort = {
    /** Sort the results by the id field. Defaults to ascending (smallest value first). */
    id?: SortOrder | null;
    /** Sort the results by the createdAt field. Defaults to ascending (smallest value first). */
    createdAt?: SortOrder | null;
    /** Sort the results by the updatedAt field. Defaults to ascending (smallest value first). */
    updatedAt?: SortOrder | null;
    /** Sort the results by the emailVerified field. Defaults to ascending (smallest value first). */
    emailVerified?: SortOrder | null;
    /** Sort the results by the email field. Defaults to ascending (smallest value first). */
    email?: SortOrder | null;
    /** Sort the results by the lastSignedIn field. Defaults to ascending (smallest value first). */
    lastSignedIn?: SortOrder | null;
    /** Sort the results by the firstName field. Defaults to ascending (smallest value first). */
    firstName?: SortOrder | null;
    /** Sort the results by the googleImageUrl field. Defaults to ascending (smallest value first). */
    googleImageUrl?: SortOrder | null;
    /** Sort the results by the emailVerificationToken field. Defaults to ascending (smallest value first). */
    emailVerificationToken?: SortOrder | null;
    /** Sort the results by the primaryRole field. Defaults to ascending (smallest value first). */
    primaryRole?: SortOrder | null;
    /** Sort the results by the emailVerificationTokenExpiration field. Defaults to ascending (smallest value first). */
    emailVerificationTokenExpiration?: SortOrder | null;
    /** Sort the results by the resetPasswordTokenExpiration field. Defaults to ascending (smallest value first). */
    resetPasswordTokenExpiration?: SortOrder | null;
    /** Sort the results by the resetPasswordToken field. Defaults to ascending (smallest value first). */
    resetPasswordToken?: SortOrder | null;
    /** Sort the results by the lastName field. Defaults to ascending (smallest value first). */
    lastName?: SortOrder | null;
    /** Sort the results by the googleProfileId field. Defaults to ascending (smallest value first). */
    googleProfileId?: SortOrder | null;
};
export type UserFilter = {
    AND?: (UserFilter | null)[];
    OR?: (UserFilter | null)[];
    NOT?: (UserFilter | null)[];
    id?: IDFilter | null;
    createdAt?: DateTimeFilter | null;
    updatedAt?: DateTimeFilter | null;
    emailVerified?: BooleanFilter | null;
    email?: StringFilter | null;
    lastSignedIn?: DateTimeFilter | null;
    firstName?: StringFilter | null;
    roles?: RoleAssignmentFilter | null;
    googleImageUrl?: StringFilter | null;
    emailVerificationToken?: StringFilter | null;
    primaryRole?: SingleEnumFilter | null;
    emailVerificationTokenExpiration?: DateTimeFilter | null;
    resetPasswordTokenExpiration?: DateTimeFilter | null;
    resetPasswordToken?: StringFilter | null;
    lastName?: StringFilter | null;
    googleProfileId?: StringFilter | null;
};
export type CreateMusicianInput = {
    state?: (Scalars['String'] | null) | null;
    availability?: (Scalars['JSON'] | null) | null;
    bio?: (Scalars['String'] | null) | null;
    city?: (Scalars['String'] | null) | null;
    country?: (Scalars['String'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    experience?: (Scalars['String'] | null) | null;
    genre?: (Scalars['String'] | null) | null;
    genres?: (Scalars['JSON'] | null) | null;
    hourlyRate?: (Scalars['Float'] | null) | null;
    instruments?: (Scalars['JSON'] | null) | null;
    isActive?: (Scalars['Boolean'] | null) | null;
    isVerified?: (Scalars['Boolean'] | null) | null;
    location?: (Scalars['String'] | null) | null;
    name?: (Scalars['String'] | null) | null;
    phone?: (Scalars['String'] | null) | null;
    profilePicture?: (Scalars['String'] | null) | null;
    rating?: (Scalars['Float'] | null) | null;
    socialLinks?: (Scalars['JSON'] | null) | null;
    stageName?: (Scalars['String'] | null) | null;
    totalGigs?: (Scalars['Float'] | null) | null;
    user?: UserBelongsToInput | null;
    website?: (Scalars['String'] | null) | null;
    yearsExperience?: (Scalars['Float'] | null) | null;
};
export type UserBelongsToInput = {
    signUp?: NestedSignUpUserInput | null;
    signIn?: NestedSignInUserInput | null;
    signOut?: NestedSignOutUserInput | null;
    update?: NestedUpdateUserInput | null;
    delete?: NestedDeleteUserInput | null;
    sendVerifyEmail?: NestedSendVerifyEmailUserInput | null;
    verifyEmail?: NestedVerifyEmailUserInput | null;
    sendResetPassword?: NestedSendResetPasswordUserInput | null;
    resetPassword?: NestedResetPasswordUserInput | null;
    changePassword?: NestedChangePasswordUserInput | null;
    updateRole?: NestedUpdateRoleUserInput | null;
    /** Existing ID of another record, which you would like to associate this record with */
    _link?: (Scalars['GadgetID'] | null) | null;
};
export type NestedSignUpUserInput = {
    email?: (Scalars['String'] | null) | null;
    password?: (Scalars['String'] | null) | null;
};
export type NestedSignInUserInput = {
    email?: (Scalars['String'] | null) | null;
    password?: (Scalars['String'] | null) | null;
};
export type NestedSignOutUserInput = {
    id: (Scalars['GadgetID'] | null);
};
export type NestedUpdateUserInput = {
    password?: (Scalars['String'] | null) | null;
    emailVerified?: (Scalars['Boolean'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    lastSignedIn?: Date | Scalars['ISO8601DateString'] | null;
    firstName?: (Scalars['String'] | null) | null;
    googleImageUrl?: (Scalars['String'] | null) | null;
    emailVerificationToken?: (Scalars['String'] | null) | null;
    primaryRole?: UserPrimaryRoleEnum | null;
    emailVerificationTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    profilePicture?: StoredFileInput | null;
    resetPasswordTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    resetPasswordToken?: (Scalars['String'] | null) | null;
    lastName?: (Scalars['String'] | null) | null;
    googleProfileId?: (Scalars['String'] | null) | null;
    id: (Scalars['GadgetID'] | null);
};
export type StoredFileInput = {
    /** Sets the file contents using this string, interpreting the string as base64 encoded bytes. This is useful for creating files quickly and easily if you have the file contents available already, but, it doesn't support files larger than 10MB, and is slower to process for the backend. Using multipart file uploads or direct-to-storage file uploads is preferable. */
    base64?: (Scalars['String'] | null) | null;
    /** Sets the file contents using binary bytes sent along side a GraphQL mutation as a multipart POST request. Gadget expects this multipart POST request to be formatted according to the GraphQL multipart request spec defined at https://github.com/jaydenseric/graphql-multipart-request-spec. Sending files as a multipart POST requests is supported natively by the generated Gadget JS client using File objects as variables in API calls. This method supports files up to 100MB. */
    file?: (Scalars['Upload'] | null) | null;
    /** Sets the file contents by fetching a remote URL and saving a copy to cloud storage. File downloads happen as the request is processed so they can be validated, which means large files can take some time to download from the existing URL. If the file can't be fetched from this URL, the action will fail. */
    copyURL?: (Scalars['URL'] | null) | null;
    /** Sets the file contents using a token from a separate upload request made with the Gadget storage service. Uploading files while a user is completing the rest of a form gives a great user experience and supports much larger files, but requires client side code to complete the upload, and then pass the returned token for this field. */
    directUploadToken?: (Scalars['String'] | null) | null;
    /** Sets this file's mime type, which will then be used when serving the file during read requests as the `Content-Type` HTTP header. If not set, Gadget will infer a content type based on the file's contents. */
    mimeType?: (Scalars['String'] | null) | null;
    /** Sets this file's stored name, which will then be used as the file name when serving the file during read requests. If not set, Gadget will infer a filename if possible. */
    fileName?: (Scalars['String'] | null) | null;
};
export type NestedDeleteUserInput = {
    id: (Scalars['GadgetID'] | null);
};
export type NestedSendVerifyEmailUserInput = {
    email?: (Scalars['String'] | null) | null;
};
export type NestedVerifyEmailUserInput = {
    code?: (Scalars['String'] | null) | null;
};
export type NestedSendResetPasswordUserInput = {
    email?: (Scalars['String'] | null) | null;
};
export type NestedResetPasswordUserInput = {
    password?: (Scalars['String'] | null) | null;
    code?: (Scalars['String'] | null) | null;
};
export type NestedChangePasswordUserInput = {
    id: (Scalars['GadgetID'] | null);
    currentPassword?: (Scalars['String'] | null) | null;
    newPassword?: (Scalars['String'] | null) | null;
};
export type NestedUpdateRoleUserInput = {
    password?: (Scalars['String'] | null) | null;
    emailVerified?: (Scalars['Boolean'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    lastSignedIn?: Date | Scalars['ISO8601DateString'] | null;
    firstName?: (Scalars['String'] | null) | null;
    googleImageUrl?: (Scalars['String'] | null) | null;
    emailVerificationToken?: (Scalars['String'] | null) | null;
    primaryRole?: UserPrimaryRoleEnum | null;
    emailVerificationTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    profilePicture?: StoredFileInput | null;
    resetPasswordTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    resetPasswordToken?: (Scalars['String'] | null) | null;
    lastName?: (Scalars['String'] | null) | null;
    googleProfileId?: (Scalars['String'] | null) | null;
    id: (Scalars['GadgetID'] | null);
};
export type BulkCreateMusiciansInput = {
    musician?: CreateMusicianInput | null;
};
export type UpdateMusicianInput = {
    state?: (Scalars['String'] | null) | null;
    availability?: (Scalars['JSON'] | null) | null;
    bio?: (Scalars['String'] | null) | null;
    city?: (Scalars['String'] | null) | null;
    country?: (Scalars['String'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    experience?: (Scalars['String'] | null) | null;
    genre?: (Scalars['String'] | null) | null;
    genres?: (Scalars['JSON'] | null) | null;
    hourlyRate?: (Scalars['Float'] | null) | null;
    instruments?: (Scalars['JSON'] | null) | null;
    isActive?: (Scalars['Boolean'] | null) | null;
    isVerified?: (Scalars['Boolean'] | null) | null;
    location?: (Scalars['String'] | null) | null;
    name?: (Scalars['String'] | null) | null;
    phone?: (Scalars['String'] | null) | null;
    profilePicture?: (Scalars['String'] | null) | null;
    rating?: (Scalars['Float'] | null) | null;
    socialLinks?: (Scalars['JSON'] | null) | null;
    stageName?: (Scalars['String'] | null) | null;
    totalGigs?: (Scalars['Float'] | null) | null;
    user?: UserBelongsToInput | null;
    website?: (Scalars['String'] | null) | null;
    yearsExperience?: (Scalars['Float'] | null) | null;
};
export type BulkUpdateMusiciansInput = {
    musician?: UpdateMusicianInput | null;
    id: (Scalars['GadgetID'] | null);
};
export type UpsertMusicianInput = {
    id?: (Scalars['GadgetID'] | null) | null;
    state?: (Scalars['String'] | null) | null;
    availability?: (Scalars['JSON'] | null) | null;
    bio?: (Scalars['String'] | null) | null;
    city?: (Scalars['String'] | null) | null;
    country?: (Scalars['String'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    experience?: (Scalars['String'] | null) | null;
    genre?: (Scalars['String'] | null) | null;
    genres?: (Scalars['JSON'] | null) | null;
    hourlyRate?: (Scalars['Float'] | null) | null;
    instruments?: (Scalars['JSON'] | null) | null;
    isActive?: (Scalars['Boolean'] | null) | null;
    isVerified?: (Scalars['Boolean'] | null) | null;
    location?: (Scalars['String'] | null) | null;
    name?: (Scalars['String'] | null) | null;
    phone?: (Scalars['String'] | null) | null;
    profilePicture?: (Scalars['String'] | null) | null;
    rating?: (Scalars['Float'] | null) | null;
    socialLinks?: (Scalars['JSON'] | null) | null;
    stageName?: (Scalars['String'] | null) | null;
    totalGigs?: (Scalars['Float'] | null) | null;
    user?: UserBelongsToInput | null;
    website?: (Scalars['String'] | null) | null;
    yearsExperience?: (Scalars['Float'] | null) | null;
};
export type BulkUpsertMusiciansInput = {
    /** An array of Strings */
    on?: ((Scalars['String'] | null))[];
    musician?: UpsertMusicianInput | null;
};
export type BulkSignUpUsersInput = {
    email?: (Scalars['String'] | null) | null;
    password?: (Scalars['String'] | null) | null;
};
export type BulkSignInUsersInput = {
    email?: (Scalars['String'] | null) | null;
    password?: (Scalars['String'] | null) | null;
};
export type UpdateUserInput = {
    password?: (Scalars['String'] | null) | null;
    emailVerified?: (Scalars['Boolean'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    lastSignedIn?: Date | Scalars['ISO8601DateString'] | null;
    firstName?: (Scalars['String'] | null) | null;
    googleImageUrl?: (Scalars['String'] | null) | null;
    emailVerificationToken?: (Scalars['String'] | null) | null;
    primaryRole?: UserPrimaryRoleEnum | null;
    emailVerificationTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    profilePicture?: StoredFileInput | null;
    resetPasswordTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    resetPasswordToken?: (Scalars['String'] | null) | null;
    lastName?: (Scalars['String'] | null) | null;
    googleProfileId?: (Scalars['String'] | null) | null;
};
export type BulkUpdateUsersInput = {
    user?: UpdateUserInput | null;
    id: (Scalars['GadgetID'] | null);
};
export type BulkSendVerifyEmailUsersInput = {
    email?: (Scalars['String'] | null) | null;
};
export type BulkVerifyEmailUsersInput = {
    code?: (Scalars['String'] | null) | null;
};
export type BulkSendResetPasswordUsersInput = {
    email?: (Scalars['String'] | null) | null;
};
export type BulkResetPasswordUsersInput = {
    password?: (Scalars['String'] | null) | null;
    code?: (Scalars['String'] | null) | null;
};
export type BulkChangePasswordUsersInput = {
    id: (Scalars['GadgetID'] | null);
    currentPassword?: (Scalars['String'] | null) | null;
    newPassword?: (Scalars['String'] | null) | null;
};
export type UpdateRoleUserInput = {
    password?: (Scalars['String'] | null) | null;
    emailVerified?: (Scalars['Boolean'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    lastSignedIn?: Date | Scalars['ISO8601DateString'] | null;
    firstName?: (Scalars['String'] | null) | null;
    googleImageUrl?: (Scalars['String'] | null) | null;
    emailVerificationToken?: (Scalars['String'] | null) | null;
    primaryRole?: UserPrimaryRoleEnum | null;
    emailVerificationTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    profilePicture?: StoredFileInput | null;
    resetPasswordTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    resetPasswordToken?: (Scalars['String'] | null) | null;
    lastName?: (Scalars['String'] | null) | null;
    googleProfileId?: (Scalars['String'] | null) | null;
};
export type BulkUpdateRoleUsersInput = {
    user?: UpdateRoleUserInput | null;
    id: (Scalars['GadgetID'] | null);
};
export type UpsertUserInput = {
    id?: (Scalars['GadgetID'] | null) | null;
    password?: (Scalars['String'] | null) | null;
    emailVerified?: (Scalars['Boolean'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    lastSignedIn?: Date | Scalars['ISO8601DateString'] | null;
    firstName?: (Scalars['String'] | null) | null;
    /** A string list of Gadget platform Role keys to assign to this record */
    roles?: ((Scalars['String'] | null))[];
    googleImageUrl?: (Scalars['String'] | null) | null;
    emailVerificationToken?: (Scalars['String'] | null) | null;
    primaryRole?: UserPrimaryRoleEnum | null;
    emailVerificationTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    profilePicture?: StoredFileInput | null;
    resetPasswordTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    resetPasswordToken?: (Scalars['String'] | null) | null;
    lastName?: (Scalars['String'] | null) | null;
    googleProfileId?: (Scalars['String'] | null) | null;
};
export type BulkUpsertUsersInput = {
    /** An array of Strings */
    on?: ((Scalars['String'] | null))[];
    user?: UpsertUserInput | null;
    email?: (Scalars['String'] | null) | null;
    password?: (Scalars['String'] | null) | null;
};
export type EnqueueBackgroundActionOptions = {
    /** A fixed ID to assign to this background action. If not passed, a random ID will be generated and assigned. */
    id?: (Scalars['String'] | null) | null;
    /** The priority for executing this action. */
    priority?: BackgroundActionPriority | null;
    /** Group actions into the same queue and limit the concurrency they can run with. */
    queue?: BackgroundActionQueue | null;
    /** Options governing if and how this action will be retried if it fails. */
    retries?: BackgroundActionRetryPolicy | null;
    /** Actions won't be started until after this time. */
    startAt?: Date | Scalars['ISO8601DateString'] | null;
};
export type BackgroundActionQueue = {
    /** The identifier for this queue. */
    name: (Scalars['String'] | null);
    /** The maximum number of actions that will be run at the same time. Defaults to 1 if not passed (only one job per key at once). */
    maxConcurrency?: (Scalars['Int'] | null) | null;
};
export type BackgroundActionRetryPolicy = {
    /** The number of repeat attempts to make if the initial attempt fails. Defaults to 10. Note: the total number of attempts will be this number plus one -- this counts the number of retries *after* the first attempt. */
    retryCount?: (Scalars['Int'] | null) | null;
    /** How long to delay the first retry attempt, in milliseconds. Default is 1000. */
    initialInterval?: (Scalars['Int'] | null) | null;
    /** The maximum amount of time to delay a retry while exponentially backing off in milliseconds. Default is not set, so the retry can backoff indefinitely */
    maxInterval?: (Scalars['Int'] | null) | null;
    /** The exponential backoff factor to use for calculating the retry delay for successive retries. Set this higher to grow the delay faster with each retry attempt. Default is 2. */
    backoffFactor?: (Scalars['Int'] | null) | null;
    /** If true, the retry interval will be randomized by a small amount to avoid all retries happening at the same time. Default is false. */
    randomizeInterval?: (Scalars['Boolean'] | null) | null;
};
export type InternalSessionInput = {
    state?: (Scalars['RecordState'] | null) | null;
    stateHistory?: (Scalars['RecordState'] | null) | null;
    id?: (Scalars['GadgetID'] | null) | null;
    createdAt?: Date | Scalars['ISO8601DateString'] | null;
    updatedAt?: Date | Scalars['ISO8601DateString'] | null;
    user?: InternalBelongsToInput | null;
};
export type InternalBelongsToInput = {
    /** Existing ID of another record, which you would like to associate this record with */
    _link?: (Scalars['GadgetID'] | null) | null;
};
export type InternalBookingInput = {
    state?: (Scalars['RecordState'] | null) | null;
    stateHistory?: (Scalars['RecordState'] | null) | null;
    id?: (Scalars['GadgetID'] | null) | null;
    createdAt?: Date | Scalars['ISO8601DateString'] | null;
    updatedAt?: Date | Scalars['ISO8601DateString'] | null;
    bookedBy?: InternalBelongsToInput | null;
    date?: Date | Scalars['ISO8601DateString'] | null;
    depositAmount?: (Scalars['Float'] | null) | null;
    depositPaid?: (Scalars['Boolean'] | null) | null;
    endTime?: (Scalars['String'] | null) | null;
    fullPaymentPaid?: (Scalars['Boolean'] | null) | null;
    isActive?: (Scalars['Boolean'] | null) | null;
    musician?: InternalBelongsToInput | null;
    notes?: (Scalars['String'] | null) | null;
    specialRequirements?: (Scalars['String'] | null) | null;
    startTime?: (Scalars['String'] | null) | null;
    status?: (Scalars['String'] | null) | null;
    totalAmount?: (Scalars['Float'] | null) | null;
    venue?: InternalBelongsToInput | null;
    /** An optional list of atomically applied commands for race-safe mutations of the record */
    _atomics?: InternalBookingAtomicsInput | null;
};
export type InternalBookingAtomicsInput = {
    /** Numeric atomic commands for operating on depositAmount. */
    depositAmount?: (NumericAtomicFieldUpdateInput)[];
    /** Numeric atomic commands for operating on totalAmount. */
    totalAmount?: (NumericAtomicFieldUpdateInput)[];
};
export type NumericAtomicFieldUpdateInput = {
    /** A number to atomically increment the field value by. Can only be used on numeric fields. */
    increment?: (Scalars['Float'] | null) | null;
    /** A number to atomically decrement the field value by. Can only be used on numeric fields. */
    decrement?: (Scalars['Float'] | null) | null;
};
export type InternalEventInput = {
    state?: (Scalars['RecordState'] | null) | null;
    stateHistory?: (Scalars['RecordState'] | null) | null;
    id?: (Scalars['GadgetID'] | null) | null;
    createdAt?: Date | Scalars['ISO8601DateString'] | null;
    updatedAt?: Date | Scalars['ISO8601DateString'] | null;
    availableTickets?: (Scalars['Float'] | null) | null;
    category?: (Scalars['String'] | null) | null;
    createdBy?: InternalBelongsToInput | null;
    date?: Date | Scalars['ISO8601DateString'] | null;
    description?: (Scalars['String'] | null) | null;
    endTime?: (Scalars['String'] | null) | null;
    image?: (Scalars['String'] | null) | null;
    isActive?: (Scalars['Boolean'] | null) | null;
    isPublic?: (Scalars['Boolean'] | null) | null;
    musician?: InternalBelongsToInput | null;
    setlist?: (Scalars['JSON'] | null) | null;
    startTime?: (Scalars['String'] | null) | null;
    status?: (Scalars['String'] | null) | null;
    ticketPrice?: (Scalars['Float'] | null) | null;
    ticketType?: (Scalars['String'] | null) | null;
    title?: (Scalars['String'] | null) | null;
    totalCapacity?: (Scalars['Float'] | null) | null;
    venue?: InternalBelongsToInput | null;
    /** An optional list of atomically applied commands for race-safe mutations of the record */
    _atomics?: InternalEventAtomicsInput | null;
};
export type InternalEventAtomicsInput = {
    /** Numeric atomic commands for operating on availableTickets. */
    availableTickets?: (NumericAtomicFieldUpdateInput)[];
    /** Numeric atomic commands for operating on ticketPrice. */
    ticketPrice?: (NumericAtomicFieldUpdateInput)[];
    /** Numeric atomic commands for operating on totalCapacity. */
    totalCapacity?: (NumericAtomicFieldUpdateInput)[];
};
export type InternalMusicianInput = {
    state?: (Scalars['String'] | null) | null;
    stateHistory?: (Scalars['RecordState'] | null) | null;
    id?: (Scalars['GadgetID'] | null) | null;
    createdAt?: Date | Scalars['ISO8601DateString'] | null;
    updatedAt?: Date | Scalars['ISO8601DateString'] | null;
    availability?: (Scalars['JSON'] | null) | null;
    bio?: (Scalars['String'] | null) | null;
    city?: (Scalars['String'] | null) | null;
    country?: (Scalars['String'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    experience?: (Scalars['String'] | null) | null;
    genre?: (Scalars['String'] | null) | null;
    genres?: (Scalars['JSON'] | null) | null;
    hourlyRate?: (Scalars['Float'] | null) | null;
    instruments?: (Scalars['JSON'] | null) | null;
    isActive?: (Scalars['Boolean'] | null) | null;
    isVerified?: (Scalars['Boolean'] | null) | null;
    location?: (Scalars['String'] | null) | null;
    name?: (Scalars['String'] | null) | null;
    phone?: (Scalars['String'] | null) | null;
    profilePicture?: (Scalars['String'] | null) | null;
    rating?: (Scalars['Float'] | null) | null;
    socialLinks?: (Scalars['JSON'] | null) | null;
    stageName?: (Scalars['String'] | null) | null;
    totalGigs?: (Scalars['Float'] | null) | null;
    user?: InternalBelongsToInput | null;
    website?: (Scalars['String'] | null) | null;
    yearsExperience?: (Scalars['Float'] | null) | null;
    /** An optional list of atomically applied commands for race-safe mutations of the record */
    _atomics?: InternalMusicianAtomicsInput | null;
};
export type InternalMusicianAtomicsInput = {
    /** Numeric atomic commands for operating on hourlyRate. */
    hourlyRate?: (NumericAtomicFieldUpdateInput)[];
    /** Numeric atomic commands for operating on rating. */
    rating?: (NumericAtomicFieldUpdateInput)[];
    /** Numeric atomic commands for operating on totalGigs. */
    totalGigs?: (NumericAtomicFieldUpdateInput)[];
    /** Numeric atomic commands for operating on yearsExperience. */
    yearsExperience?: (NumericAtomicFieldUpdateInput)[];
};
export type AppGraphQLTriggerMutationContext = {
    /** The ID of the session that triggered this mutation. Will be the session that's loaded in the mutation context. */
    sessionID?: (Scalars['GadgetID'] | null) | null;
};
export type InternalReviewInput = {
    state?: (Scalars['RecordState'] | null) | null;
    stateHistory?: (Scalars['RecordState'] | null) | null;
    id?: (Scalars['GadgetID'] | null) | null;
    createdAt?: Date | Scalars['ISO8601DateString'] | null;
    updatedAt?: Date | Scalars['ISO8601DateString'] | null;
    comment?: (Scalars['String'] | null) | null;
    event?: InternalBelongsToInput | null;
    isActive?: (Scalars['Boolean'] | null) | null;
    isVerified?: (Scalars['Boolean'] | null) | null;
    musician?: InternalBelongsToInput | null;
    rating?: (Scalars['Float'] | null) | null;
    reviewer?: InternalBelongsToInput | null;
    reviewType?: (Scalars['String'] | null) | null;
    venue?: InternalBelongsToInput | null;
    /** An optional list of atomically applied commands for race-safe mutations of the record */
    _atomics?: InternalReviewAtomicsInput | null;
};
export type InternalReviewAtomicsInput = {
    /** Numeric atomic commands for operating on rating. */
    rating?: (NumericAtomicFieldUpdateInput)[];
};
export type InternalVenueInput = {
    state?: (Scalars['String'] | null) | null;
    stateHistory?: (Scalars['RecordState'] | null) | null;
    id?: (Scalars['GadgetID'] | null) | null;
    createdAt?: Date | Scalars['ISO8601DateString'] | null;
    updatedAt?: Date | Scalars['ISO8601DateString'] | null;
    address?: (Scalars['String'] | null) | null;
    amenities?: (Scalars['JSON'] | null) | null;
    capacity?: (Scalars['Float'] | null) | null;
    city?: (Scalars['String'] | null) | null;
    country?: (Scalars['String'] | null) | null;
    description?: (Scalars['String'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    genres?: (Scalars['JSON'] | null) | null;
    hours?: (Scalars['JSON'] | null) | null;
    isActive?: (Scalars['Boolean'] | null) | null;
    isVerified?: (Scalars['Boolean'] | null) | null;
    name?: (Scalars['String'] | null) | null;
    owner?: InternalBelongsToInput | null;
    phone?: (Scalars['String'] | null) | null;
    priceRange?: (Scalars['String'] | null) | null;
    profilePicture?: (Scalars['String'] | null) | null;
    rating?: (Scalars['Float'] | null) | null;
    socialLinks?: (Scalars['JSON'] | null) | null;
    type?: (Scalars['String'] | null) | null;
    website?: (Scalars['String'] | null) | null;
    zipCode?: (Scalars['String'] | null) | null;
    /** An optional list of atomically applied commands for race-safe mutations of the record */
    _atomics?: InternalVenueAtomicsInput | null;
};
export type InternalVenueAtomicsInput = {
    /** Numeric atomic commands for operating on capacity. */
    capacity?: (NumericAtomicFieldUpdateInput)[];
    /** Numeric atomic commands for operating on rating. */
    rating?: (NumericAtomicFieldUpdateInput)[];
};
export type InternalUserInput = {
    state?: (Scalars['RecordState'] | null) | null;
    stateHistory?: (Scalars['RecordState'] | null) | null;
    id?: (Scalars['GadgetID'] | null) | null;
    createdAt?: Date | Scalars['ISO8601DateString'] | null;
    updatedAt?: Date | Scalars['ISO8601DateString'] | null;
    password?: (Scalars['String'] | null) | null;
    emailVerified?: (Scalars['Boolean'] | null) | null;
    email?: (Scalars['String'] | null) | null;
    lastSignedIn?: Date | Scalars['ISO8601DateString'] | null;
    firstName?: (Scalars['String'] | null) | null;
    /** A string list of Gadget platform Role keys to assign to this record */
    roles?: ((Scalars['String'] | null))[];
    googleImageUrl?: (Scalars['String'] | null) | null;
    emailVerificationToken?: (Scalars['String'] | null) | null;
    primaryRole?: UserPrimaryRoleEnum | null;
    emailVerificationTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    profilePicture?: InternalStoredFileInput | null;
    resetPasswordTokenExpiration?: Date | Scalars['ISO8601DateString'] | null;
    resetPasswordToken?: (Scalars['String'] | null) | null;
    lastName?: (Scalars['String'] | null) | null;
    googleProfileId?: (Scalars['String'] | null) | null;
};
export type InternalStoredFileInput = {
    /** An opaque identifier used by Gadget internally to uniquely identify this stored file */
    storageToken: (Scalars['String'] | null);
    /** Byte size to report in API calls */
    byteSize: (Scalars['Int'] | null);
    /** File mime type to use when serving the file or making resize operations available */
    mimeType: (Scalars['String'] | null);
    /** Sets this file's stored name, which will then be used when serving the file during read requests. If not set, Gadget will infer a filename if possible. */
    fileName: (Scalars['String'] | null);
    /** Has no effect. Convenience property to allow sending an internal metadata blob back to the Internal API, but doesn't do anything. URLs generated by Gadget expire and are not stored. */
    url?: (Scalars['String'] | null) | null;
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
    /** Represents an amount of some currency. Specified as a string so user's aren't tempted to do math on the value. */
    CurrencyAmount: string;
    /** Represents a UTC date formatted an ISO-8601 formatted 'full-date' string. */
    ISO8601DateString: string;
    /** A file object produced by a browser for uploading to cloud storage */
    Upload: File;
    /** A record's current state for a recordState type field */
    StateValue: Record<string, string>;
    /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
    String: string;
    /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSONObject: JSONObject;
    /** The `Boolean` scalar type represents `true` or `false`. */
    Boolean: boolean;
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: JSONValue;
    /** Integer type that can handle bigints and Big numbers */
    Int: number;
    /** The ID of a record in Gadget */
    GadgetID: string;
    /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
    DateTime: Date;
    /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
    Float: number;
    /** Instructions for a client to turn raw transport types (like strings) into useful client side types (like Dates). Unstable and not intended for developer use. */
    HydrationPlan: unknown;
    /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
    URL: string;
    /** Represents the state of one record in a Gadget database. Represented as either a string or set of strings nested in objects. */
    RecordState: (string | {
        [key: string]: Scalars['RecordState'];
    });
}
/** This Error object is returned for errors which don't have other specific handling. It has a message which is safe to display to users, but is often technical in nature. It also has a `code` field which is documented in the Gadget API Error Codes docs. */
export interface SimpleError extends ExecutionError {
    __typename: 'SimpleError';
    /** The human facing error message for this error. */
    message: Scalars['String'];
    /** The Gadget platform error code for this error. */
    code: Scalars['String'];
    /** The stack for any exception that caused the error */
    stack: (Scalars['String'] | null);
}
export type AvailableSimpleErrorSelection = {
    __typename?: boolean | null | undefined;
    /** The human facing error message for this error. */
    message?: boolean | null | undefined;
    /** The Gadget platform error code for this error. */
    code?: boolean | null | undefined;
    /** The stack for any exception that caused the error */
    stack?: boolean | null | undefined;
};
export type ExecutionError = {
    __typename: 'SimpleError' | 'InvalidRecordError';
    /** The human facing error message for this error. */
    message: Scalars['String'];
    /** The Gadget platform error code for this error. */
    code: Scalars['String'];
    /** The stack for any exception that caused the error. Only available for super users. */
    stack: (Scalars['String'] | null);
};
export type AvailableExecutionErrorSelection = {
    __typename?: boolean | null | undefined;
    /** The human facing error message for this error. */
    message?: boolean | null | undefined;
    /** The Gadget platform error code for this error. */
    code?: boolean | null | undefined;
    /** The stack for any exception that caused the error. Only available for super users. */
    stack?: boolean | null | undefined;
};
/** This object is returned as an error when a record doesn't pass the defined validations on the model. The validation messages for each of the invalid fields are available via the other fields on this error type. */
export interface InvalidRecordError extends ExecutionError {
    __typename: 'InvalidRecordError';
    /** The human facing error message for this error. */
    message: Scalars['String'];
    /** The Gadget platform error code for this InvalidRecordError. */
    code: Scalars['String'];
    /** The stack for any exception that caused the error */
    stack: (Scalars['String'] | null);
    /** An object mapping field apiIdentifiers to arrays of validation error message strings for that field, as a JSON object. The object may have keys that don't correspond exactly to field apiIdentifiers if added by validations, and the object may have missing keys if no errors were encountered for that field. */
    validationErrorsByField: (Scalars['JSONObject'] | null);
    /** A list of InvalidFieldError objects describing each of the errors encountered on the invalid record. */
    validationErrors: InvalidFieldError[];
    /** The record which failed validation, if available. Returns all the owned fields of the record -- no sub-selections are required or possible. Only available for super users. */
    record: (Scalars['JSONObject'] | null);
    /** The model of the record which failed validation */
    model: (GadgetModel | null);
}
export type AvailableInvalidRecordErrorSelection = {
    __typename?: boolean | null | undefined;
    /** The human facing error message for this error. */
    message?: boolean | null | undefined;
    /** The Gadget platform error code for this InvalidRecordError. */
    code?: boolean | null | undefined;
    /** The stack for any exception that caused the error */
    stack?: boolean | null | undefined;
    /** An object mapping field apiIdentifiers to arrays of validation error message strings for that field, as a JSON object. The object may have keys that don't correspond exactly to field apiIdentifiers if added by validations, and the object may have missing keys if no errors were encountered for that field. */
    validationErrorsByField?: boolean | null | undefined;
    /** A list of InvalidFieldError objects describing each of the errors encountered on the invalid record. */
    validationErrors?: AvailableInvalidFieldErrorSelection;
    /** The record which failed validation, if available. Returns all the owned fields of the record -- no sub-selections are required or possible. Only available for super users. */
    record?: boolean | null | undefined;
    /** The model of the record which failed validation */
    model?: AvailableGadgetModelSelection;
};
/** This Error object represents one individual failed validation for a record field. It has a message which is appropriate for display to a user, and lists the apiIdentifier of the field in question. The `apiIdentifier` for the field is not guaranteed to exist on the model. */
export type InvalidFieldError = {
    __typename: 'InvalidFieldError';
    /** The human facing error message for this error. */
    message: Scalars['String'];
    /** The apiIdentifier of the field this error occurred on. */
    apiIdentifier: Scalars['String'];
};
export type AvailableInvalidFieldErrorSelection = {
    __typename?: boolean | null | undefined;
    /** The human facing error message for this error. */
    message?: boolean | null | undefined;
    /** The apiIdentifier of the field this error occurred on. */
    apiIdentifier?: boolean | null | undefined;
};
export type GadgetModel = {
    __typename: 'GadgetModel';
    key: Scalars['String'];
    name: Scalars['String'];
    apiIdentifier: Scalars['String'];
    namespace: Scalars['String'][];
    filterable: Scalars['Boolean'];
    sortable: Scalars['Boolean'];
    searchable: Scalars['Boolean'];
    defaultDisplayField: GadgetModelField;
    fields: GadgetModelField[];
    actions: GadgetAction[];
    action: (GadgetAction | null);
    pluralName: Scalars['String'];
    pluralApiIdentifier: Scalars['String'];
    currentSingletonApiIdentifier: (Scalars['String'] | null);
    defaultRecord: Scalars['JSON'];
    initialCreatedState: (Scalars['String'] | null);
};
export type AvailableGadgetModelSelection = {
    __typename?: boolean | null | undefined;
    key?: boolean | null | undefined;
    name?: boolean | null | undefined;
    apiIdentifier?: boolean | null | undefined;
    namespace?: boolean | null | undefined;
    filterable?: boolean | null | undefined;
    sortable?: boolean | null | undefined;
    searchable?: boolean | null | undefined;
    defaultDisplayField?: AvailableGadgetModelFieldSelection;
    fields?: AvailableGadgetModelFieldSelection;
    actions?: AvailableGadgetActionSelection;
    action?: AvailableGadgetActionSelection;
    pluralName?: boolean | null | undefined;
    pluralApiIdentifier?: boolean | null | undefined;
    currentSingletonApiIdentifier?: boolean | null | undefined;
    defaultRecord?: boolean | null | undefined;
    initialCreatedState?: boolean | null | undefined;
};
/** One field of a Gadget model */
export interface GadgetModelField extends GadgetField {
    __typename: 'GadgetModelField';
    name: Scalars['String'];
    apiIdentifier: Scalars['String'];
    fieldType: GadgetFieldType;
    hasDefault: Scalars['Boolean'];
    required: Scalars['Boolean'];
    requiredArgumentForInput: Scalars['Boolean'];
    configuration: GadgetFieldConfigInterface;
    isUniqueField: Scalars['Boolean'];
    sortable: Scalars['Boolean'];
    filterable: Scalars['Boolean'];
    examples: GadgetModelFieldExamples;
}
export type AvailableGadgetModelFieldSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    apiIdentifier?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    hasDefault?: boolean | null | undefined;
    required?: boolean | null | undefined;
    requiredArgumentForInput?: boolean | null | undefined;
    configuration?: AvailableGadgetFieldConfigInterfaceSelection;
    isUniqueField?: boolean | null | undefined;
    sortable?: boolean | null | undefined;
    filterable?: boolean | null | undefined;
    examples?: AvailableGadgetModelFieldExamplesSelection;
};
export type GadgetField = {
    __typename: 'GadgetModelField' | 'GadgetObjectField';
    name: Scalars['String'];
    apiIdentifier: Scalars['String'];
    fieldType: GadgetFieldType;
    hasDefault: Scalars['Boolean'];
    required: Scalars['Boolean'];
    requiredArgumentForInput: Scalars['Boolean'];
    configuration: GadgetFieldConfigInterface;
};
export type AvailableGadgetFieldSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    apiIdentifier?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    hasDefault?: boolean | null | undefined;
    required?: boolean | null | undefined;
    requiredArgumentForInput?: boolean | null | undefined;
    configuration?: AvailableGadgetFieldConfigInterfaceSelection;
};
/** The common bits that all field configuration types share */
export type GadgetFieldConfigInterface = {
    __typename: 'GadgetGenericFieldConfig' | 'GadgetObjectFieldConfig' | 'GadgetBelongsToConfig' | 'GadgetHasOneConfig' | 'GadgetHasManyConfig' | 'GadgetHasManyThroughConfig' | 'GadgetEnumConfig' | 'GadgetDateTimeConfig' | 'GadgetNumberConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
};
export type AvailableGadgetFieldConfigInterfaceSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
};
export type GadgetModelFieldExamples = {
    __typename: 'GadgetModelFieldExamples';
    linkExistingChild: (GadgetFieldUsageExample | null);
    linkNewChild: (GadgetFieldUsageExample | null);
    linkToExistingParent: (GadgetFieldUsageExample | null);
    createNestedInParent: (GadgetFieldUsageExample | null);
};
export type AvailableGadgetModelFieldExamplesSelection = {
    __typename?: boolean | null | undefined;
    linkExistingChild?: AvailableGadgetFieldUsageExampleSelection;
    linkNewChild?: AvailableGadgetFieldUsageExampleSelection;
    linkToExistingParent?: AvailableGadgetFieldUsageExampleSelection;
    createNestedInParent?: AvailableGadgetFieldUsageExampleSelection;
};
export type GadgetFieldUsageExample = {
    __typename: 'GadgetFieldUsageExample';
    exampleGraphQLMutation: Scalars['String'];
    exampleGraphQLVariables: Scalars['JSON'];
    exampleImperativeInvocation: Scalars['String'];
    exampleReactHook: Scalars['String'];
};
export type AvailableGadgetFieldUsageExampleSelection = {
    __typename?: boolean | null | undefined;
    exampleGraphQLMutation?: boolean | null | undefined;
    exampleGraphQLVariables?: boolean | null | undefined;
    exampleImperativeInvocation?: boolean | null | undefined;
    exampleReactHook?: boolean | null | undefined;
};
export type GadgetAction = {
    __typename: 'GadgetAction';
    name: Scalars['String'];
    apiIdentifier: Scalars['String'];
    namespace: Scalars['String'][];
    requiresInput: Scalars['Boolean'];
    acceptsInput: Scalars['Boolean'];
    /** @deprecated This field will be removed. Use `isDeleteAction` instead. */
    hasDeleteRecordEffect: Scalars['Boolean'];
    /** @deprecated This field will be removed. Use `isCreateOrUpdateAction` instead. */
    hasCreateOrUpdateEffect: Scalars['Boolean'];
    isDeleteAction: Scalars['Boolean'];
    isCreateOrUpdateAction: Scalars['Boolean'];
    isUpsertMetaAction: Scalars['Boolean'];
    operatesWithRecordIdentity: Scalars['Boolean'];
    /** @deprecated This field will be removed. */
    possibleTransitions: Scalars['JSONObject'];
    availableInBulk: Scalars['Boolean'];
    bulkApiIdentifier: (Scalars['String'] | null);
    hasAmbiguousIdentifier: Scalars['Boolean'];
    inputFields: GadgetObjectField[];
    bulkInvokedByIDOnly: Scalars['Boolean'];
    triggers: GadgetTrigger[];
    examples: (GadgetActionGraphQLType | null);
};
export type AvailableGadgetActionSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    apiIdentifier?: boolean | null | undefined;
    namespace?: boolean | null | undefined;
    requiresInput?: boolean | null | undefined;
    acceptsInput?: boolean | null | undefined;
    /** @deprecated This field will be removed. Use `isDeleteAction` instead. */
    hasDeleteRecordEffect?: boolean | null | undefined;
    /** @deprecated This field will be removed. Use `isCreateOrUpdateAction` instead. */
    hasCreateOrUpdateEffect?: boolean | null | undefined;
    isDeleteAction?: boolean | null | undefined;
    isCreateOrUpdateAction?: boolean | null | undefined;
    isUpsertMetaAction?: boolean | null | undefined;
    operatesWithRecordIdentity?: boolean | null | undefined;
    /** @deprecated This field will be removed. */
    possibleTransitions?: boolean | null | undefined;
    availableInBulk?: boolean | null | undefined;
    bulkApiIdentifier?: boolean | null | undefined;
    hasAmbiguousIdentifier?: boolean | null | undefined;
    inputFields?: AvailableGadgetObjectFieldSelection;
    bulkInvokedByIDOnly?: boolean | null | undefined;
    triggers?: AvailableGadgetTriggerSelection;
    examples?: AvailableGadgetActionGraphQLTypeSelection;
};
/** One field of an action input or other transitory object in Gadget */
export interface GadgetObjectField extends GadgetField {
    __typename: 'GadgetObjectField';
    name: Scalars['String'];
    apiIdentifier: Scalars['String'];
    fieldType: GadgetFieldType;
    hasDefault: Scalars['Boolean'];
    required: Scalars['Boolean'];
    requiredArgumentForInput: Scalars['Boolean'];
    configuration: GadgetFieldConfigInterface;
}
export type AvailableGadgetObjectFieldSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    apiIdentifier?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    hasDefault?: boolean | null | undefined;
    required?: boolean | null | undefined;
    requiredArgumentForInput?: boolean | null | undefined;
    configuration?: AvailableGadgetFieldConfigInterfaceSelection;
};
export type GadgetTrigger = {
    __typename: 'GadgetTrigger';
    specID: Scalars['String'];
};
export type AvailableGadgetTriggerSelection = {
    __typename?: boolean | null | undefined;
    specID?: boolean | null | undefined;
};
export type GadgetActionGraphQLType = {
    __typename: 'GadgetActionGraphQLType';
    /** @deprecated moved to exampleGraphQLMutation */
    exampleMutation: Scalars['String'];
    exampleGraphQLMutation: Scalars['String'];
    inputGraphQLTypeSDL: (Scalars['String'] | null);
    outputGraphQLTypeSDL: Scalars['String'];
    inputTypeScriptInterface: (Scalars['String'] | null);
    outputTypeScriptInterface: Scalars['String'];
    exampleGraphQLVariables: Scalars['JSON'];
    exampleJSInputs: Scalars['JSON'];
    exampleImperativeInvocation: Scalars['String'];
    exampleReactHook: Scalars['String'];
    /** @deprecated moved to exampleBulkGraphQLMutation */
    exampleBulkMutation: (Scalars['String'] | null);
    exampleBulkGraphQLMutation: (Scalars['String'] | null);
    exampleBulkGraphQLVariables: (Scalars['JSON'] | null);
    exampleBulkImperativeInvocation: (Scalars['String'] | null);
    exampleBulkReactHook: (Scalars['String'] | null);
    bulkOutputGraphQLTypeSDL: (Scalars['String'] | null);
};
export type AvailableGadgetActionGraphQLTypeSelection = {
    __typename?: boolean | null | undefined;
    /** @deprecated moved to exampleGraphQLMutation */
    exampleMutation?: boolean | null | undefined;
    exampleGraphQLMutation?: boolean | null | undefined;
    inputGraphQLTypeSDL?: boolean | null | undefined;
    outputGraphQLTypeSDL?: boolean | null | undefined;
    inputTypeScriptInterface?: boolean | null | undefined;
    outputTypeScriptInterface?: boolean | null | undefined;
    exampleGraphQLVariables?: boolean | null | undefined;
    exampleJSInputs?: boolean | null | undefined;
    exampleImperativeInvocation?: boolean | null | undefined;
    exampleReactHook?: boolean | null | undefined;
    /** @deprecated moved to exampleBulkGraphQLMutation */
    exampleBulkMutation?: boolean | null | undefined;
    exampleBulkGraphQLMutation?: boolean | null | undefined;
    exampleBulkGraphQLVariables?: boolean | null | undefined;
    exampleBulkImperativeInvocation?: boolean | null | undefined;
    exampleBulkReactHook?: boolean | null | undefined;
    bulkOutputGraphQLTypeSDL?: boolean | null | undefined;
};
export interface GadgetGenericFieldConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetGenericFieldConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
}
export type AvailableGadgetGenericFieldConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
};
export interface GadgetObjectFieldConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetObjectFieldConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
    name: (Scalars['String'] | null);
    fields: GadgetModelField[];
}
export type AvailableGadgetObjectFieldConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
    name?: boolean | null | undefined;
    fields?: AvailableGadgetModelFieldSelection;
};
export interface GadgetBelongsToConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetBelongsToConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
    relatedModelKey: (Scalars['String'] | null);
    relatedModel: (GadgetModel | null);
    isConfigured: Scalars['Boolean'];
    isInverseConfigured: Scalars['Boolean'];
}
export type AvailableGadgetBelongsToConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
    relatedModelKey?: boolean | null | undefined;
    relatedModel?: AvailableGadgetModelSelection;
    isConfigured?: boolean | null | undefined;
    isInverseConfigured?: boolean | null | undefined;
};
export interface GadgetHasOneConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetHasOneConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
    relatedModelKey: (Scalars['String'] | null);
    relatedModel: (GadgetModel | null);
    inverseField: (GadgetModelField | null);
    isConfigured: Scalars['Boolean'];
    isInverseConfigured: Scalars['Boolean'];
}
export type AvailableGadgetHasOneConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
    relatedModelKey?: boolean | null | undefined;
    relatedModel?: AvailableGadgetModelSelection;
    inverseField?: AvailableGadgetModelFieldSelection;
    isConfigured?: boolean | null | undefined;
    isInverseConfigured?: boolean | null | undefined;
};
export interface GadgetHasManyConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetHasManyConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
    relatedModelKey: (Scalars['String'] | null);
    relatedModel: (GadgetModel | null);
    inverseField: (GadgetModelField | null);
    isConfigured: Scalars['Boolean'];
    isInverseConfigured: Scalars['Boolean'];
    isJoinModelHasManyField: Scalars['Boolean'];
}
export type AvailableGadgetHasManyConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
    relatedModelKey?: boolean | null | undefined;
    relatedModel?: AvailableGadgetModelSelection;
    inverseField?: AvailableGadgetModelFieldSelection;
    isConfigured?: boolean | null | undefined;
    isInverseConfigured?: boolean | null | undefined;
    isJoinModelHasManyField?: boolean | null | undefined;
};
export interface GadgetHasManyThroughConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetHasManyThroughConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
    relatedModelKey: (Scalars['String'] | null);
    relatedModel: (GadgetModel | null);
    inverseField: (GadgetModelField | null);
    joinModelKey: (Scalars['String'] | null);
    joinModel: (GadgetModel | null);
    inverseJoinModelField: (GadgetModelField | null);
    inverseRelatedModelField: (GadgetModelField | null);
    isConfigured: Scalars['Boolean'];
    isInverseConfigured: Scalars['Boolean'];
    joinModelHasManyFieldApiIdentifier: (Scalars['String'] | null);
}
export type AvailableGadgetHasManyThroughConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
    relatedModelKey?: boolean | null | undefined;
    relatedModel?: AvailableGadgetModelSelection;
    inverseField?: AvailableGadgetModelFieldSelection;
    joinModelKey?: boolean | null | undefined;
    joinModel?: AvailableGadgetModelSelection;
    inverseJoinModelField?: AvailableGadgetModelFieldSelection;
    inverseRelatedModelField?: AvailableGadgetModelFieldSelection;
    isConfigured?: boolean | null | undefined;
    isInverseConfigured?: boolean | null | undefined;
    joinModelHasManyFieldApiIdentifier?: boolean | null | undefined;
};
export interface GadgetEnumConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetEnumConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
    allowMultiple: Scalars['Boolean'];
    allowOther: Scalars['Boolean'];
    options: GadgetEnumOption[];
}
export type AvailableGadgetEnumConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
    allowMultiple?: boolean | null | undefined;
    allowOther?: boolean | null | undefined;
    options?: AvailableGadgetEnumOptionSelection;
};
export type GadgetEnumOption = {
    __typename: 'GadgetEnumOption';
    name: Scalars['String'];
    color: Scalars['String'];
};
export type AvailableGadgetEnumOptionSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    color?: boolean | null | undefined;
};
export interface GadgetDateTimeConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetDateTimeConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
    includeTime: Scalars['Boolean'];
}
export type AvailableGadgetDateTimeConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
    includeTime?: boolean | null | undefined;
};
export interface GadgetNumberConfig extends GadgetFieldConfigInterface {
    __typename: 'GadgetNumberConfig';
    fieldType: GadgetFieldType;
    validations: (GadgetFieldValidationUnion | null)[];
    decimals: (Scalars['Int'] | null);
}
export type AvailableGadgetNumberConfigSelection = {
    __typename?: boolean | null | undefined;
    fieldType?: boolean | null | undefined;
    validations?: AvailableGadgetFieldValidationUnionSelection;
    decimals?: boolean | null | undefined;
};
export interface GadgetRegexFieldValidation extends GadgetFieldValidationInterface {
    __typename: 'GadgetRegexFieldValidation';
    name: Scalars['String'];
    specID: Scalars['String'];
    pattern: (Scalars['String'] | null);
}
export type AvailableGadgetRegexFieldValidationSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    specID?: boolean | null | undefined;
    pattern?: boolean | null | undefined;
};
/** The common bits that all field validation types share */
export type GadgetFieldValidationInterface = {
    __typename: 'GadgetRegexFieldValidation' | 'GadgetRangeFieldValidation' | 'GadgetOnlyImageFileFieldValidation' | 'GadgetGenericFieldValidation';
    name: Scalars['String'];
    specID: Scalars['String'];
};
export type AvailableGadgetFieldValidationInterfaceSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    specID?: boolean | null | undefined;
};
export interface GadgetRangeFieldValidation extends GadgetFieldValidationInterface {
    __typename: 'GadgetRangeFieldValidation';
    name: Scalars['String'];
    specID: Scalars['String'];
    min: (Scalars['Int'] | null);
    max: (Scalars['Int'] | null);
}
export type AvailableGadgetRangeFieldValidationSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    specID?: boolean | null | undefined;
    min?: boolean | null | undefined;
    max?: boolean | null | undefined;
};
export interface GadgetOnlyImageFileFieldValidation extends GadgetFieldValidationInterface {
    __typename: 'GadgetOnlyImageFileFieldValidation';
    name: Scalars['String'];
    specID: Scalars['String'];
    allowAnimatedImages: Scalars['Boolean'];
}
export type AvailableGadgetOnlyImageFileFieldValidationSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    specID?: boolean | null | undefined;
    allowAnimatedImages?: boolean | null | undefined;
};
export interface GadgetGenericFieldValidation extends GadgetFieldValidationInterface {
    __typename: 'GadgetGenericFieldValidation';
    name: Scalars['String'];
    specID: Scalars['String'];
}
export type AvailableGadgetGenericFieldValidationSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    specID?: boolean | null | undefined;
};
export interface UpsertError extends UpsertMusicianResult, UpsertUserResult {
    __typename: 'UpsertError';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
}
export type AvailableUpsertErrorSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
};
export type UpsertMusicianResult = {
    __typename: 'UpsertError' | 'CreateMusicianResult' | 'UpdateMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
};
export type AvailableUpsertMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
};
export type UpsertUserResult = {
    __typename: 'UpsertError' | 'SignUpUserResult' | 'UpdateUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
};
export type AvailableUpsertUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
};
export type Query = {
    __typename: 'Query';
    session: (Session | null);
    sessions: SessionConnection;
    sessionGellyView: (Scalars['JSON'] | null);
    booking: (Booking | null);
    bookings: BookingConnection;
    bookingGellyView: (Scalars['JSON'] | null);
    event: (Event | null);
    events: EventConnection;
    eventGellyView: (Scalars['JSON'] | null);
    musician: (Musician | null);
    musicians: MusicianConnection;
    musicianGellyView: (Scalars['JSON'] | null);
    review: (Review | null);
    reviews: ReviewConnection;
    reviewGellyView: (Scalars['JSON'] | null);
    venue: (Venue | null);
    venues: VenueConnection;
    venueGellyView: (Scalars['JSON'] | null);
    user: (User | null);
    users: UserConnection;
    userGellyView: (Scalars['JSON'] | null);
    gellyView: (Scalars['JSON'] | null);
    currentSession: (Session | null);
    internal: InternalQueries;
};
export type AvailableQuerySelection = {
    __typename?: boolean | null | undefined;
    session?: AvailableSessionSelection;
    sessions?: AvailableSessionConnectionSelection;
    sessionGellyView?: boolean | null | undefined;
    booking?: AvailableBookingSelection;
    bookings?: AvailableBookingConnectionSelection;
    bookingGellyView?: boolean | null | undefined;
    event?: AvailableEventSelection;
    events?: AvailableEventConnectionSelection;
    eventGellyView?: boolean | null | undefined;
    musician?: AvailableMusicianSelection;
    musicians?: AvailableMusicianConnectionSelection;
    musicianGellyView?: boolean | null | undefined;
    review?: AvailableReviewSelection;
    reviews?: AvailableReviewConnectionSelection;
    reviewGellyView?: boolean | null | undefined;
    venue?: AvailableVenueSelection;
    venues?: AvailableVenueConnectionSelection;
    venueGellyView?: boolean | null | undefined;
    user?: AvailableUserSelection;
    users?: AvailableUserConnectionSelection;
    userGellyView?: boolean | null | undefined;
    gellyView?: boolean | null | undefined;
    currentSession?: AvailableSessionSelection;
    internal?: AvailableInternalQueriesSelection;
};
export type Session = {
    __typename: 'Session';
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id: (Scalars['GadgetID'] | null);
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt: Scalars['DateTime'];
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt: Scalars['DateTime'];
    user: (User | null);
    userId: (Scalars['GadgetID'] | null);
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all: Scalars['JSONObject'];
};
export type AvailableSessionSelection = {
    __typename?: boolean | null | undefined;
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id?: boolean | null | undefined;
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt?: boolean | null | undefined;
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt?: boolean | null | undefined;
    user?: AvailableUserSelection;
    userId?: boolean | null | undefined;
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all?: boolean | null | undefined;
};
export type User = {
    __typename: 'User';
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id: Scalars['GadgetID'];
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt: Scalars['DateTime'];
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt: Scalars['DateTime'];
    emailVerified: (Scalars['Boolean'] | null);
    email: Scalars['String'];
    lastSignedIn: (Scalars['DateTime'] | null);
    firstName: (Scalars['String'] | null);
    roles: Role[];
    googleImageUrl: (Scalars['String'] | null);
    emailVerificationToken: (Scalars['String'] | null);
    primaryRole: UserPrimaryRoleEnum;
    emailVerificationTokenExpiration: (Scalars['DateTime'] | null);
    profilePicture: (StoredFile | null);
    resetPasswordTokenExpiration: (Scalars['DateTime'] | null);
    resetPasswordToken: (Scalars['String'] | null);
    lastName: (Scalars['String'] | null);
    googleProfileId: (Scalars['String'] | null);
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all: Scalars['JSONObject'];
};
export type AvailableUserSelection = {
    __typename?: boolean | null | undefined;
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id?: boolean | null | undefined;
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt?: boolean | null | undefined;
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt?: boolean | null | undefined;
    emailVerified?: boolean | null | undefined;
    email?: boolean | null | undefined;
    lastSignedIn?: boolean | null | undefined;
    firstName?: boolean | null | undefined;
    roles?: AvailableRoleSelection;
    googleImageUrl?: boolean | null | undefined;
    emailVerificationToken?: boolean | null | undefined;
    primaryRole?: boolean | null | undefined;
    emailVerificationTokenExpiration?: boolean | null | undefined;
    profilePicture?: AvailableStoredFileSelection;
    resetPasswordTokenExpiration?: boolean | null | undefined;
    resetPasswordToken?: boolean | null | undefined;
    lastName?: boolean | null | undefined;
    googleProfileId?: boolean | null | undefined;
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all?: boolean | null | undefined;
};
/** A named group of permissions granted to a particular actor in the system. Managed in the Gadget editor. */
export type Role = {
    __typename: 'Role';
    /** The stable identifier for this role. Null if the role has since been deleted. */
    key: Scalars['String'];
    /** The human readable name for this role. Can be changed. */
    name: Scalars['String'];
};
export type AvailableRoleSelection = {
    __typename?: boolean | null | undefined;
    /** The stable identifier for this role. Null if the role has since been deleted. */
    key?: boolean | null | undefined;
    /** The human readable name for this role. Can be changed. */
    name?: boolean | null | undefined;
};
/** One file that has been stored and attached to a record */
export type StoredFile = {
    __typename: 'StoredFile';
    /** The URL to retrieve the attached file. Gets the original, unmodified file. */
    url: Scalars['String'];
    /** The content type of the file. */
    mimeType: Scalars['String'];
    /** The size of this file in bytes. */
    byteSize: Scalars['Int'];
    /** The size of this file in bytes. */
    humanSize: Scalars['String'];
    /** The file name of this file. */
    fileName: Scalars['String'];
};
export type AvailableStoredFileSelection = {
    __typename?: boolean | null | undefined;
    /** The URL to retrieve the attached file. Gets the original, unmodified file. */
    url?: boolean | null | undefined;
    /** The content type of the file. */
    mimeType?: boolean | null | undefined;
    /** The size of this file in bytes. */
    byteSize?: boolean | null | undefined;
    /** The size of this file in bytes. */
    humanSize?: boolean | null | undefined;
    /** The file name of this file. */
    fileName?: boolean | null | undefined;
};
/** A connection to a list of Session items. */
export type SessionConnection = {
    __typename: 'SessionConnection';
    /** A list of edges. */
    edges: SessionEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableSessionConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableSessionEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a Session connection. */
export type SessionEdge = {
    __typename: 'SessionEdge';
    /** The item at the end of the edge */
    node: Session;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableSessionEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: AvailableSessionSelection;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** Information about pagination in a connection. */
export type PageInfo = {
    __typename: 'PageInfo';
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars['Boolean'];
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars['Boolean'];
    /** When paginating backwards, the cursor to continue. */
    startCursor: (Scalars['String'] | null);
    /** When paginating forwards, the cursor to continue. */
    endCursor: (Scalars['String'] | null);
};
export type AvailablePageInfoSelection = {
    __typename?: boolean | null | undefined;
    /** When paginating forwards, are there more items? */
    hasNextPage?: boolean | null | undefined;
    /** When paginating backwards, are there more items? */
    hasPreviousPage?: boolean | null | undefined;
    /** When paginating backwards, the cursor to continue. */
    startCursor?: boolean | null | undefined;
    /** When paginating forwards, the cursor to continue. */
    endCursor?: boolean | null | undefined;
};
export type Booking = {
    __typename: 'Booking';
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id: Scalars['GadgetID'];
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt: Scalars['DateTime'];
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt: Scalars['DateTime'];
    bookedBy: (User | null);
    bookedById: (Scalars['GadgetID'] | null);
    date: (Scalars['DateTime'] | null);
    depositAmount: (Scalars['Float'] | null);
    depositPaid: (Scalars['Boolean'] | null);
    endTime: (Scalars['String'] | null);
    fullPaymentPaid: (Scalars['Boolean'] | null);
    isActive: (Scalars['Boolean'] | null);
    musician: (Musician | null);
    musicianId: (Scalars['GadgetID'] | null);
    notes: (Scalars['String'] | null);
    specialRequirements: (Scalars['String'] | null);
    startTime: (Scalars['String'] | null);
    status: (Scalars['String'] | null);
    totalAmount: (Scalars['Float'] | null);
    venue: (Venue | null);
    venueId: (Scalars['GadgetID'] | null);
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all: Scalars['JSONObject'];
};
export type AvailableBookingSelection = {
    __typename?: boolean | null | undefined;
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id?: boolean | null | undefined;
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt?: boolean | null | undefined;
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt?: boolean | null | undefined;
    bookedBy?: AvailableUserSelection;
    bookedById?: boolean | null | undefined;
    date?: boolean | null | undefined;
    depositAmount?: boolean | null | undefined;
    depositPaid?: boolean | null | undefined;
    endTime?: boolean | null | undefined;
    fullPaymentPaid?: boolean | null | undefined;
    isActive?: boolean | null | undefined;
    musician?: AvailableMusicianSelection;
    musicianId?: boolean | null | undefined;
    notes?: boolean | null | undefined;
    specialRequirements?: boolean | null | undefined;
    startTime?: boolean | null | undefined;
    status?: boolean | null | undefined;
    totalAmount?: boolean | null | undefined;
    venue?: AvailableVenueSelection;
    venueId?: boolean | null | undefined;
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all?: boolean | null | undefined;
};
export type Musician = {
    __typename: 'Musician';
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id: Scalars['GadgetID'];
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt: Scalars['DateTime'];
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt: Scalars['DateTime'];
    state: (Scalars['String'] | null);
    reviews: ReviewConnection;
    bookings: BookingConnection;
    events: EventConnection;
    availability: (Scalars['JSON'] | null);
    bio: (Scalars['String'] | null);
    city: (Scalars['String'] | null);
    country: (Scalars['String'] | null);
    email: (Scalars['String'] | null);
    experience: (Scalars['String'] | null);
    genre: (Scalars['String'] | null);
    genres: (Scalars['JSON'] | null);
    hourlyRate: (Scalars['Float'] | null);
    instruments: (Scalars['JSON'] | null);
    isActive: (Scalars['Boolean'] | null);
    isVerified: (Scalars['Boolean'] | null);
    location: (Scalars['String'] | null);
    name: (Scalars['String'] | null);
    phone: (Scalars['String'] | null);
    profilePicture: (Scalars['String'] | null);
    rating: (Scalars['Float'] | null);
    socialLinks: (Scalars['JSON'] | null);
    stageName: (Scalars['String'] | null);
    totalGigs: (Scalars['Float'] | null);
    user: (User | null);
    userId: (Scalars['GadgetID'] | null);
    website: (Scalars['String'] | null);
    yearsExperience: (Scalars['Float'] | null);
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all: Scalars['JSONObject'];
};
export type AvailableMusicianSelection = {
    __typename?: boolean | null | undefined;
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id?: boolean | null | undefined;
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt?: boolean | null | undefined;
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt?: boolean | null | undefined;
    state?: boolean | null | undefined;
    reviews?: AvailableReviewConnectionSelection;
    bookings?: AvailableBookingConnectionSelection;
    events?: AvailableEventConnectionSelection;
    availability?: boolean | null | undefined;
    bio?: boolean | null | undefined;
    city?: boolean | null | undefined;
    country?: boolean | null | undefined;
    email?: boolean | null | undefined;
    experience?: boolean | null | undefined;
    genre?: boolean | null | undefined;
    genres?: boolean | null | undefined;
    hourlyRate?: boolean | null | undefined;
    instruments?: boolean | null | undefined;
    isActive?: boolean | null | undefined;
    isVerified?: boolean | null | undefined;
    location?: boolean | null | undefined;
    name?: boolean | null | undefined;
    phone?: boolean | null | undefined;
    profilePicture?: boolean | null | undefined;
    rating?: boolean | null | undefined;
    socialLinks?: boolean | null | undefined;
    stageName?: boolean | null | undefined;
    totalGigs?: boolean | null | undefined;
    user?: AvailableUserSelection;
    userId?: boolean | null | undefined;
    website?: boolean | null | undefined;
    yearsExperience?: boolean | null | undefined;
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all?: boolean | null | undefined;
};
/** A connection to a list of Review items. */
export type ReviewConnection = {
    __typename: 'ReviewConnection';
    /** A list of edges. */
    edges: ReviewEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableReviewConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableReviewEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a Review connection. */
export type ReviewEdge = {
    __typename: 'ReviewEdge';
    /** The item at the end of the edge */
    node: Review;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableReviewEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: AvailableReviewSelection;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
export type Review = {
    __typename: 'Review';
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id: Scalars['GadgetID'];
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt: Scalars['DateTime'];
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt: Scalars['DateTime'];
    comment: (Scalars['String'] | null);
    event: (Venue | null);
    eventId: (Scalars['GadgetID'] | null);
    isActive: (Scalars['Boolean'] | null);
    isVerified: (Scalars['Boolean'] | null);
    musician: (Musician | null);
    musicianId: (Scalars['GadgetID'] | null);
    rating: (Scalars['Float'] | null);
    reviewer: (User | null);
    reviewerId: (Scalars['GadgetID'] | null);
    reviewType: (Scalars['String'] | null);
    venue: (Venue | null);
    venueId: (Scalars['GadgetID'] | null);
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all: Scalars['JSONObject'];
};
export type AvailableReviewSelection = {
    __typename?: boolean | null | undefined;
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id?: boolean | null | undefined;
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt?: boolean | null | undefined;
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt?: boolean | null | undefined;
    comment?: boolean | null | undefined;
    event?: AvailableVenueSelection;
    eventId?: boolean | null | undefined;
    isActive?: boolean | null | undefined;
    isVerified?: boolean | null | undefined;
    musician?: AvailableMusicianSelection;
    musicianId?: boolean | null | undefined;
    rating?: boolean | null | undefined;
    reviewer?: AvailableUserSelection;
    reviewerId?: boolean | null | undefined;
    reviewType?: boolean | null | undefined;
    venue?: AvailableVenueSelection;
    venueId?: boolean | null | undefined;
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all?: boolean | null | undefined;
};
export type Venue = {
    __typename: 'Venue';
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id: Scalars['GadgetID'];
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt: Scalars['DateTime'];
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt: Scalars['DateTime'];
    state: (Scalars['String'] | null);
    events: EventConnection;
    bookings: BookingConnection;
    address: (Scalars['String'] | null);
    amenities: (Scalars['JSON'] | null);
    capacity: (Scalars['Float'] | null);
    city: (Scalars['String'] | null);
    country: (Scalars['String'] | null);
    description: (Scalars['String'] | null);
    email: (Scalars['String'] | null);
    genres: (Scalars['JSON'] | null);
    hours: (Scalars['JSON'] | null);
    isActive: (Scalars['Boolean'] | null);
    isVerified: (Scalars['Boolean'] | null);
    name: (Scalars['String'] | null);
    owner: (User | null);
    ownerId: (Scalars['GadgetID'] | null);
    phone: (Scalars['String'] | null);
    priceRange: (Scalars['String'] | null);
    profilePicture: (Scalars['String'] | null);
    rating: (Scalars['Float'] | null);
    socialLinks: (Scalars['JSON'] | null);
    type: (Scalars['String'] | null);
    website: (Scalars['String'] | null);
    zipCode: (Scalars['String'] | null);
    reviews: ReviewConnection;
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all: Scalars['JSONObject'];
};
export type AvailableVenueSelection = {
    __typename?: boolean | null | undefined;
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id?: boolean | null | undefined;
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt?: boolean | null | undefined;
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt?: boolean | null | undefined;
    state?: boolean | null | undefined;
    events?: AvailableEventConnectionSelection;
    bookings?: AvailableBookingConnectionSelection;
    address?: boolean | null | undefined;
    amenities?: boolean | null | undefined;
    capacity?: boolean | null | undefined;
    city?: boolean | null | undefined;
    country?: boolean | null | undefined;
    description?: boolean | null | undefined;
    email?: boolean | null | undefined;
    genres?: boolean | null | undefined;
    hours?: boolean | null | undefined;
    isActive?: boolean | null | undefined;
    isVerified?: boolean | null | undefined;
    name?: boolean | null | undefined;
    owner?: AvailableUserSelection;
    ownerId?: boolean | null | undefined;
    phone?: boolean | null | undefined;
    priceRange?: boolean | null | undefined;
    profilePicture?: boolean | null | undefined;
    rating?: boolean | null | undefined;
    socialLinks?: boolean | null | undefined;
    type?: boolean | null | undefined;
    website?: boolean | null | undefined;
    zipCode?: boolean | null | undefined;
    reviews?: AvailableReviewConnectionSelection;
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all?: boolean | null | undefined;
};
/** A connection to a list of Event items. */
export type EventConnection = {
    __typename: 'EventConnection';
    /** A list of edges. */
    edges: EventEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableEventConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableEventEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a Event connection. */
export type EventEdge = {
    __typename: 'EventEdge';
    /** The item at the end of the edge */
    node: Event;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableEventEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: AvailableEventSelection;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
export type Event = {
    __typename: 'Event';
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id: Scalars['GadgetID'];
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt: Scalars['DateTime'];
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt: Scalars['DateTime'];
    availableTickets: (Scalars['Float'] | null);
    category: (Scalars['String'] | null);
    createdBy: (User | null);
    createdById: (Scalars['GadgetID'] | null);
    date: (Scalars['DateTime'] | null);
    description: (Scalars['String'] | null);
    endTime: (Scalars['String'] | null);
    image: (Scalars['String'] | null);
    isActive: (Scalars['Boolean'] | null);
    isPublic: (Scalars['Boolean'] | null);
    musician: (Musician | null);
    musicianId: (Scalars['GadgetID'] | null);
    setlist: (Scalars['JSON'] | null);
    startTime: (Scalars['String'] | null);
    status: (Scalars['String'] | null);
    ticketPrice: (Scalars['Float'] | null);
    ticketType: (Scalars['String'] | null);
    title: (Scalars['String'] | null);
    totalCapacity: (Scalars['Float'] | null);
    venue: (Venue | null);
    venueId: (Scalars['GadgetID'] | null);
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all: Scalars['JSONObject'];
};
export type AvailableEventSelection = {
    __typename?: boolean | null | undefined;
    /** The globally unique, unchanging identifier for this record. Assigned and managed by Gadget. */
    id?: boolean | null | undefined;
    /** The time at which this record was first created. Set once upon record creation and never changed. Managed by Gadget. */
    createdAt?: boolean | null | undefined;
    /** The time at which this record was last changed. Set each time the record is successfully acted upon by an action. Managed by Gadget. */
    updatedAt?: boolean | null | undefined;
    availableTickets?: boolean | null | undefined;
    category?: boolean | null | undefined;
    createdBy?: AvailableUserSelection;
    createdById?: boolean | null | undefined;
    date?: boolean | null | undefined;
    description?: boolean | null | undefined;
    endTime?: boolean | null | undefined;
    image?: boolean | null | undefined;
    isActive?: boolean | null | undefined;
    isPublic?: boolean | null | undefined;
    musician?: AvailableMusicianSelection;
    musicianId?: boolean | null | undefined;
    setlist?: boolean | null | undefined;
    startTime?: boolean | null | undefined;
    status?: boolean | null | undefined;
    ticketPrice?: boolean | null | undefined;
    ticketType?: boolean | null | undefined;
    title?: boolean | null | undefined;
    totalCapacity?: boolean | null | undefined;
    venue?: AvailableVenueSelection;
    venueId?: boolean | null | undefined;
    /** Get all the fields for this record. Useful for not having to list out all the fields you want to retrieve, but slower. */
    _all?: boolean | null | undefined;
};
/** A connection to a list of Booking items. */
export type BookingConnection = {
    __typename: 'BookingConnection';
    /** A list of edges. */
    edges: BookingEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableBookingConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableBookingEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a Booking connection. */
export type BookingEdge = {
    __typename: 'BookingEdge';
    /** The item at the end of the edge */
    node: Booking;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableBookingEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: AvailableBookingSelection;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of Musician items. */
export type MusicianConnection = {
    __typename: 'MusicianConnection';
    /** A list of edges. */
    edges: MusicianEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableMusicianConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableMusicianEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a Musician connection. */
export type MusicianEdge = {
    __typename: 'MusicianEdge';
    /** The item at the end of the edge */
    node: Musician;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableMusicianEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: AvailableMusicianSelection;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of Venue items. */
export type VenueConnection = {
    __typename: 'VenueConnection';
    /** A list of edges. */
    edges: VenueEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableVenueConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableVenueEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a Venue connection. */
export type VenueEdge = {
    __typename: 'VenueEdge';
    /** The item at the end of the edge */
    node: Venue;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableVenueEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: AvailableVenueSelection;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of User items. */
export type UserConnection = {
    __typename: 'UserConnection';
    /** A list of edges. */
    edges: UserEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableUserConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableUserEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a User connection. */
export type UserEdge = {
    __typename: 'UserEdge';
    /** The item at the end of the edge */
    node: User;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableUserEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: AvailableUserSelection;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** Represents one of the roles an identity in the system can be entitled to */
export type GadgetRole = {
    __typename: 'GadgetRole';
    key: Scalars['String'];
    name: Scalars['String'];
    selectable: Scalars['Boolean'];
    order: Scalars['Int'];
};
export type AvailableGadgetRoleSelection = {
    __typename?: boolean | null | undefined;
    key?: boolean | null | undefined;
    name?: boolean | null | undefined;
    selectable?: boolean | null | undefined;
    order?: boolean | null | undefined;
};
export type GadgetGlobalAction = {
    __typename: 'GadgetGlobalAction';
    name: Scalars['String'];
    apiIdentifier: Scalars['String'];
    namespace: Scalars['String'][];
    requiresInput: Scalars['Boolean'];
    acceptsInput: Scalars['Boolean'];
    triggers: GadgetTrigger[];
    inputFields: GadgetObjectField[];
    examples: (GadgetGlobalActionGraphQLType | null);
};
export type AvailableGadgetGlobalActionSelection = {
    __typename?: boolean | null | undefined;
    name?: boolean | null | undefined;
    apiIdentifier?: boolean | null | undefined;
    namespace?: boolean | null | undefined;
    requiresInput?: boolean | null | undefined;
    acceptsInput?: boolean | null | undefined;
    triggers?: AvailableGadgetTriggerSelection;
    inputFields?: AvailableGadgetObjectFieldSelection;
    examples?: AvailableGadgetGlobalActionGraphQLTypeSelection;
};
export type GadgetGlobalActionGraphQLType = {
    __typename: 'GadgetGlobalActionGraphQLType';
    /** @deprecated moved to exampleGraphQLMutation */
    exampleMutation: Scalars['String'];
    exampleGraphQLMutation: Scalars['String'];
    inputGraphQLTypeSDL: (Scalars['String'] | null);
    outputGraphQLTypeSDL: Scalars['String'];
    inputTypeScriptInterface: (Scalars['String'] | null);
    outputTypeScriptInterface: Scalars['String'];
    exampleGraphQLVariables: Scalars['JSON'];
    exampleJSInputs: Scalars['JSON'];
    exampleImperativeInvocation: Scalars['String'];
    exampleReactHook: Scalars['String'];
};
export type AvailableGadgetGlobalActionGraphQLTypeSelection = {
    __typename?: boolean | null | undefined;
    /** @deprecated moved to exampleGraphQLMutation */
    exampleMutation?: boolean | null | undefined;
    exampleGraphQLMutation?: boolean | null | undefined;
    inputGraphQLTypeSDL?: boolean | null | undefined;
    outputGraphQLTypeSDL?: boolean | null | undefined;
    inputTypeScriptInterface?: boolean | null | undefined;
    outputTypeScriptInterface?: boolean | null | undefined;
    exampleGraphQLVariables?: boolean | null | undefined;
    exampleJSInputs?: boolean | null | undefined;
    exampleImperativeInvocation?: boolean | null | undefined;
    exampleReactHook?: boolean | null | undefined;
};
/** One upload target to use for the Direct Upload style of sending files to Gadget */
export type DirectUploadToken = {
    __typename: 'DirectUploadToken';
    /** The URL to upload a file to. */
    url: Scalars['String'];
    /** The token to pass to an action to reference the uploaded file. */
    token: Scalars['String'];
};
export type AvailableDirectUploadTokenSelection = {
    __typename?: boolean | null | undefined;
    /** The URL to upload a file to. */
    url?: boolean | null | undefined;
    /** The token to pass to an action to reference the uploaded file. */
    token?: boolean | null | undefined;
};
export type InternalQueries = {
    __typename: 'InternalQueries';
    session: (InternalSessionRecord | null);
    listSession: InternalSessionRecordConnection;
    /** Currently open platform transaction details, or null if no transaction is open */
    currentTransactionDetails: (Scalars['JSONObject'] | null);
    booking: (InternalBookingRecord | null);
    listBooking: InternalBookingRecordConnection;
    event: (InternalEventRecord | null);
    listEvent: InternalEventRecordConnection;
    musician: (InternalMusicianRecord | null);
    listMusician: InternalMusicianRecordConnection;
    review: (InternalReviewRecord | null);
    listReview: InternalReviewRecordConnection;
    venue: (InternalVenueRecord | null);
    listVenue: InternalVenueRecordConnection;
    user: (InternalUserRecord | null);
    listUser: InternalUserRecordConnection;
    gellyView: (Scalars['JSON'] | null);
};
export type AvailableInternalQueriesSelection = {
    __typename?: boolean | null | undefined;
    session?: boolean | null | undefined;
    listSession?: AvailableInternalSessionRecordConnectionSelection;
    /** Currently open platform transaction details, or null if no transaction is open */
    currentTransactionDetails?: boolean | null | undefined;
    booking?: boolean | null | undefined;
    listBooking?: AvailableInternalBookingRecordConnectionSelection;
    event?: boolean | null | undefined;
    listEvent?: AvailableInternalEventRecordConnectionSelection;
    musician?: boolean | null | undefined;
    listMusician?: AvailableInternalMusicianRecordConnectionSelection;
    review?: boolean | null | undefined;
    listReview?: AvailableInternalReviewRecordConnectionSelection;
    venue?: boolean | null | undefined;
    listVenue?: AvailableInternalVenueRecordConnectionSelection;
    user?: boolean | null | undefined;
    listUser?: AvailableInternalUserRecordConnectionSelection;
    gellyView?: boolean | null | undefined;
};
/** A connection to a list of InternalSessionRecord items. */
export type InternalSessionRecordConnection = {
    __typename: 'InternalSessionRecordConnection';
    /** A list of edges. */
    edges: InternalSessionRecordEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableInternalSessionRecordConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableInternalSessionRecordEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a InternalSessionRecord connection. */
export type InternalSessionRecordEdge = {
    __typename: 'InternalSessionRecordEdge';
    /** The item at the end of the edge */
    node: InternalSessionRecord;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableInternalSessionRecordEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: boolean | null | undefined;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of InternalBookingRecord items. */
export type InternalBookingRecordConnection = {
    __typename: 'InternalBookingRecordConnection';
    /** A list of edges. */
    edges: InternalBookingRecordEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableInternalBookingRecordConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableInternalBookingRecordEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a InternalBookingRecord connection. */
export type InternalBookingRecordEdge = {
    __typename: 'InternalBookingRecordEdge';
    /** The item at the end of the edge */
    node: InternalBookingRecord;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableInternalBookingRecordEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: boolean | null | undefined;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of InternalEventRecord items. */
export type InternalEventRecordConnection = {
    __typename: 'InternalEventRecordConnection';
    /** A list of edges. */
    edges: InternalEventRecordEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableInternalEventRecordConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableInternalEventRecordEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a InternalEventRecord connection. */
export type InternalEventRecordEdge = {
    __typename: 'InternalEventRecordEdge';
    /** The item at the end of the edge */
    node: InternalEventRecord;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableInternalEventRecordEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: boolean | null | undefined;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of InternalMusicianRecord items. */
export type InternalMusicianRecordConnection = {
    __typename: 'InternalMusicianRecordConnection';
    /** A list of edges. */
    edges: InternalMusicianRecordEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableInternalMusicianRecordConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableInternalMusicianRecordEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a InternalMusicianRecord connection. */
export type InternalMusicianRecordEdge = {
    __typename: 'InternalMusicianRecordEdge';
    /** The item at the end of the edge */
    node: InternalMusicianRecord;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableInternalMusicianRecordEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: boolean | null | undefined;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of InternalReviewRecord items. */
export type InternalReviewRecordConnection = {
    __typename: 'InternalReviewRecordConnection';
    /** A list of edges. */
    edges: InternalReviewRecordEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableInternalReviewRecordConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableInternalReviewRecordEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a InternalReviewRecord connection. */
export type InternalReviewRecordEdge = {
    __typename: 'InternalReviewRecordEdge';
    /** The item at the end of the edge */
    node: InternalReviewRecord;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableInternalReviewRecordEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: boolean | null | undefined;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of InternalVenueRecord items. */
export type InternalVenueRecordConnection = {
    __typename: 'InternalVenueRecordConnection';
    /** A list of edges. */
    edges: InternalVenueRecordEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableInternalVenueRecordConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableInternalVenueRecordEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a InternalVenueRecord connection. */
export type InternalVenueRecordEdge = {
    __typename: 'InternalVenueRecordEdge';
    /** The item at the end of the edge */
    node: InternalVenueRecord;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableInternalVenueRecordEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: boolean | null | undefined;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
/** A connection to a list of InternalUserRecord items. */
export type InternalUserRecordConnection = {
    __typename: 'InternalUserRecordConnection';
    /** A list of edges. */
    edges: InternalUserRecordEdge[];
    /** Information to aid in pagination. */
    pageInfo: PageInfo;
};
export type AvailableInternalUserRecordConnectionSelection = {
    __typename?: boolean | null | undefined;
    /** A list of edges. */
    edges?: AvailableInternalUserRecordEdgeSelection;
    /** Information to aid in pagination. */
    pageInfo?: AvailablePageInfoSelection;
};
/** An edge in a InternalUserRecord connection. */
export type InternalUserRecordEdge = {
    __typename: 'InternalUserRecordEdge';
    /** The item at the end of the edge */
    node: InternalUserRecord;
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
};
export type AvailableInternalUserRecordEdgeSelection = {
    __typename?: boolean | null | undefined;
    /** The item at the end of the edge */
    node?: boolean | null | undefined;
    /** A cursor for use in pagination */
    cursor?: boolean | null | undefined;
};
export type Mutation = {
    __typename: 'Mutation';
    createMusician: (CreateMusicianResult | null);
    bulkCreateMusicians: (BulkCreateMusiciansResult | null);
    updateMusician: (UpdateMusicianResult | null);
    bulkUpdateMusicians: (BulkUpdateMusiciansResult | null);
    findFirstMusician: (FindFirstMusicianResult | null);
    bulkFindFirstMusicians: (BulkFindFirstMusiciansResult | null);
    upsertMusician: (UpsertMusicianResult | null);
    bulkUpsertMusicians: BulkUpsertMusiciansResult;
    signUpUser: (SignUpUserResult | null);
    bulkSignUpUsers: (BulkSignUpUsersResult | null);
    signInUser: (SignInUserResult | null);
    bulkSignInUsers: (BulkSignInUsersResult | null);
    signOutUser: (SignOutUserResult | null);
    bulkSignOutUsers: (BulkSignOutUsersResult | null);
    updateUser: (UpdateUserResult | null);
    bulkUpdateUsers: (BulkUpdateUsersResult | null);
    deleteUser: (DeleteUserResult | null);
    bulkDeleteUsers: (BulkDeleteUsersResult | null);
    sendVerifyEmailUser: (SendVerifyEmailUserResult | null);
    bulkSendVerifyEmailUsers: (BulkSendVerifyEmailUsersResult | null);
    verifyEmailUser: (VerifyEmailUserResult | null);
    bulkVerifyEmailUsers: (BulkVerifyEmailUsersResult | null);
    sendResetPasswordUser: (SendResetPasswordUserResult | null);
    bulkSendResetPasswordUsers: (BulkSendResetPasswordUsersResult | null);
    resetPasswordUser: (ResetPasswordUserResult | null);
    bulkResetPasswordUsers: (BulkResetPasswordUsersResult | null);
    changePasswordUser: (ChangePasswordUserResult | null);
    bulkChangePasswordUsers: (BulkChangePasswordUsersResult | null);
    updateRoleUser: (UpdateRoleUserResult | null);
    bulkUpdateRoleUsers: (BulkUpdateRoleUsersResult | null);
    upsertUser: (UpsertUserResult | null);
    bulkUpsertUsers: BulkUpsertUsersResult;
    background: BackgroundMutations;
    internal: InternalMutations;
    seed: SeedMutations;
};
export type AvailableMutationSelection = {
    __typename?: boolean | null | undefined;
    createMusician?: AvailableCreateMusicianResultSelection;
    bulkCreateMusicians?: AvailableBulkCreateMusiciansResultSelection;
    updateMusician?: AvailableUpdateMusicianResultSelection;
    bulkUpdateMusicians?: AvailableBulkUpdateMusiciansResultSelection;
    findFirstMusician?: AvailableFindFirstMusicianResultSelection;
    bulkFindFirstMusicians?: AvailableBulkFindFirstMusiciansResultSelection;
    upsertMusician?: AvailableUpsertMusicianResultSelection;
    bulkUpsertMusicians?: AvailableBulkUpsertMusiciansResultSelection;
    signUpUser?: AvailableSignUpUserResultSelection;
    bulkSignUpUsers?: AvailableBulkSignUpUsersResultSelection;
    signInUser?: AvailableSignInUserResultSelection;
    bulkSignInUsers?: AvailableBulkSignInUsersResultSelection;
    signOutUser?: AvailableSignOutUserResultSelection;
    bulkSignOutUsers?: AvailableBulkSignOutUsersResultSelection;
    updateUser?: AvailableUpdateUserResultSelection;
    bulkUpdateUsers?: AvailableBulkUpdateUsersResultSelection;
    deleteUser?: AvailableDeleteUserResultSelection;
    bulkDeleteUsers?: AvailableBulkDeleteUsersResultSelection;
    sendVerifyEmailUser?: AvailableSendVerifyEmailUserResultSelection;
    bulkSendVerifyEmailUsers?: AvailableBulkSendVerifyEmailUsersResultSelection;
    verifyEmailUser?: AvailableVerifyEmailUserResultSelection;
    bulkVerifyEmailUsers?: AvailableBulkVerifyEmailUsersResultSelection;
    sendResetPasswordUser?: AvailableSendResetPasswordUserResultSelection;
    bulkSendResetPasswordUsers?: AvailableBulkSendResetPasswordUsersResultSelection;
    resetPasswordUser?: AvailableResetPasswordUserResultSelection;
    bulkResetPasswordUsers?: AvailableBulkResetPasswordUsersResultSelection;
    changePasswordUser?: AvailableChangePasswordUserResultSelection;
    bulkChangePasswordUsers?: AvailableBulkChangePasswordUsersResultSelection;
    updateRoleUser?: AvailableUpdateRoleUserResultSelection;
    bulkUpdateRoleUsers?: AvailableBulkUpdateRoleUsersResultSelection;
    upsertUser?: AvailableUpsertUserResultSelection;
    bulkUpsertUsers?: AvailableBulkUpsertUsersResultSelection;
    background?: AvailableBackgroundMutationsSelection;
    internal?: AvailableInternalMutationsSelection;
    seed?: AvailableSeedMutationsSelection;
};
export interface CreateMusicianResult extends UpsertMusicianResult {
    __typename: 'CreateMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
}
export type AvailableCreateMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the create on the musician model in bulk. */
export type BulkCreateMusiciansResult = {
    __typename: 'BulkCreateMusiciansResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkCreateMusiciansResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
export interface UpdateMusicianResult extends UpsertMusicianResult {
    __typename: 'UpdateMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
}
export type AvailableUpdateMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the update on the musician model in bulk. */
export type BulkUpdateMusiciansResult = {
    __typename: 'BulkUpdateMusiciansResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkUpdateMusiciansResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
export type FindFirstMusicianResult = {
    __typename: 'FindFirstMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
};
export type AvailableFindFirstMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the findFirst on the musician model in bulk. */
export type BulkFindFirstMusiciansResult = {
    __typename: 'BulkFindFirstMusiciansResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkFindFirstMusiciansResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
/** The result of a bulk upsert operation for the musician model */
export type BulkUpsertMusiciansResult = {
    __typename: 'BulkUpsertMusiciansResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The results of each upsert action in the bulk operation */
    musicians: (UpsertMusicianReturnType | null)[];
};
export type AvailableBulkUpsertMusiciansResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The results of each upsert action in the bulk operation */
    musicians?: AvailableUpsertMusicianReturnTypeSelection;
};
export type UpsertMusicianReturnType = {
    __typename: 'UpsertMusicianReturnType';
    result: (Scalars['JSON'] | null);
};
export type AvailableUpsertMusicianReturnTypeSelection = {
    __typename?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
export interface SignUpUserResult extends UpsertUserResult {
    __typename: 'SignUpUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
}
export type AvailableSignUpUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the signUp on the user model in bulk. */
export type BulkSignUpUsersResult = {
    __typename: 'BulkSignUpUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkSignUpUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
export type SignInUserResult = {
    __typename: 'SignInUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    user: (User | null);
};
export type AvailableSignInUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    user?: AvailableUserSelection;
};
/** The output when running the signIn on the user model in bulk. */
export type BulkSignInUsersResult = {
    __typename: 'BulkSignInUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of all changed user records by each sent bulk action. Returned in the same order as the input bulk action params. */
    users: (User | null)[];
};
export type AvailableBulkSignInUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of all changed user records by each sent bulk action. Returned in the same order as the input bulk action params. */
    users?: AvailableUserSelection;
};
export type SignOutUserResult = {
    __typename: 'SignOutUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    user: (User | null);
};
export type AvailableSignOutUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    user?: AvailableUserSelection;
};
/** The output when running the signOut on the user model in bulk. */
export type BulkSignOutUsersResult = {
    __typename: 'BulkSignOutUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of all changed user records by each sent bulk action. Returned in the same order as the input bulk action params. */
    users: (User | null)[];
};
export type AvailableBulkSignOutUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of all changed user records by each sent bulk action. Returned in the same order as the input bulk action params. */
    users?: AvailableUserSelection;
};
export interface UpdateUserResult extends UpsertUserResult {
    __typename: 'UpdateUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
}
export type AvailableUpdateUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the update on the user model in bulk. */
export type BulkUpdateUsersResult = {
    __typename: 'BulkUpdateUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkUpdateUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
export type DeleteUserResult = {
    __typename: 'DeleteUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
};
export type AvailableDeleteUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
};
/** The output when running the delete on the user model in bulk. */
export type BulkDeleteUsersResult = {
    __typename: 'BulkDeleteUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
};
export type AvailableBulkDeleteUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
};
export type SendVerifyEmailUserResult = {
    __typename: 'SendVerifyEmailUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
};
export type AvailableSendVerifyEmailUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the sendVerifyEmail on the user model in bulk. */
export type BulkSendVerifyEmailUsersResult = {
    __typename: 'BulkSendVerifyEmailUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkSendVerifyEmailUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
export type VerifyEmailUserResult = {
    __typename: 'VerifyEmailUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
};
export type AvailableVerifyEmailUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the verifyEmail on the user model in bulk. */
export type BulkVerifyEmailUsersResult = {
    __typename: 'BulkVerifyEmailUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkVerifyEmailUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
export type SendResetPasswordUserResult = {
    __typename: 'SendResetPasswordUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
};
export type AvailableSendResetPasswordUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the sendResetPassword on the user model in bulk. */
export type BulkSendResetPasswordUsersResult = {
    __typename: 'BulkSendResetPasswordUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkSendResetPasswordUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
export type ResetPasswordUserResult = {
    __typename: 'ResetPasswordUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
};
export type AvailableResetPasswordUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the resetPassword on the user model in bulk. */
export type BulkResetPasswordUsersResult = {
    __typename: 'BulkResetPasswordUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkResetPasswordUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
export type ChangePasswordUserResult = {
    __typename: 'ChangePasswordUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    user: (User | null);
};
export type AvailableChangePasswordUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    user?: AvailableUserSelection;
};
/** The output when running the changePassword on the user model in bulk. */
export type BulkChangePasswordUsersResult = {
    __typename: 'BulkChangePasswordUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of all changed user records by each sent bulk action. Returned in the same order as the input bulk action params. */
    users: (User | null)[];
};
export type AvailableBulkChangePasswordUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of all changed user records by each sent bulk action. Returned in the same order as the input bulk action params. */
    users?: AvailableUserSelection;
};
export type UpdateRoleUserResult = {
    __typename: 'UpdateRoleUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    actionRun: (Scalars['String'] | null);
    result: (Scalars['JSON'] | null);
};
export type AvailableUpdateRoleUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    actionRun?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
/** The output when running the updateRole on the user model in bulk. */
export type BulkUpdateRoleUsersResult = {
    __typename: 'BulkUpdateRoleUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results: (Scalars['JSON'] | null)[];
};
export type AvailableBulkUpdateRoleUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The list of returned values for each action executed in the set of bulk actions. Returned in the same order as the input bulk action params. */
    results?: boolean | null | undefined;
};
/** The result of a bulk upsert operation for the user model */
export type BulkUpsertUsersResult = {
    __typename: 'BulkUpsertUsersResult';
    /** Boolean describing if all the bulk actions succeeded or not */
    success: Scalars['Boolean'];
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors: ExecutionError[];
    /** The results of each upsert action in the bulk operation */
    users: (UpsertUserReturnType | null)[];
};
export type AvailableBulkUpsertUsersResultSelection = {
    __typename?: boolean | null | undefined;
    /** Boolean describing if all the bulk actions succeeded or not */
    success?: boolean | null | undefined;
    /** Aggregated list of errors that any bulk action encountered while processing */
    errors?: AvailableExecutionErrorSelection;
    /** The results of each upsert action in the bulk operation */
    users?: AvailableUpsertUserReturnTypeSelection;
};
export type UpsertUserReturnType = {
    __typename: 'UpsertUserReturnType';
    result: (Scalars['JSON'] | null);
};
export type AvailableUpsertUserReturnTypeSelection = {
    __typename?: boolean | null | undefined;
    result?: boolean | null | undefined;
};
export type BackgroundMutations = {
    __typename: 'BackgroundMutations';
    createMusician: EnqueueBackgroundActionResult;
    bulkCreateMusicians: BulkEnqueueBackgroundActionResult;
    updateMusician: EnqueueBackgroundActionResult;
    bulkUpdateMusicians: BulkEnqueueBackgroundActionResult;
    findFirstMusician: EnqueueBackgroundActionResult;
    bulkFindFirstMusicians: BulkEnqueueBackgroundActionResult;
    upsertMusician: EnqueueBackgroundActionResult;
    bulkUpsertMusicians: BulkEnqueueBackgroundActionResult;
    signUpUser: EnqueueBackgroundActionResult;
    bulkSignUpUsers: BulkEnqueueBackgroundActionResult;
    signInUser: EnqueueBackgroundActionResult;
    bulkSignInUsers: BulkEnqueueBackgroundActionResult;
    signOutUser: EnqueueBackgroundActionResult;
    bulkSignOutUsers: BulkEnqueueBackgroundActionResult;
    updateUser: EnqueueBackgroundActionResult;
    bulkUpdateUsers: BulkEnqueueBackgroundActionResult;
    deleteUser: EnqueueBackgroundActionResult;
    bulkDeleteUsers: BulkEnqueueBackgroundActionResult;
    sendVerifyEmailUser: EnqueueBackgroundActionResult;
    bulkSendVerifyEmailUsers: BulkEnqueueBackgroundActionResult;
    verifyEmailUser: EnqueueBackgroundActionResult;
    bulkVerifyEmailUsers: BulkEnqueueBackgroundActionResult;
    sendResetPasswordUser: EnqueueBackgroundActionResult;
    bulkSendResetPasswordUsers: BulkEnqueueBackgroundActionResult;
    resetPasswordUser: EnqueueBackgroundActionResult;
    bulkResetPasswordUsers: BulkEnqueueBackgroundActionResult;
    changePasswordUser: EnqueueBackgroundActionResult;
    bulkChangePasswordUsers: BulkEnqueueBackgroundActionResult;
    updateRoleUser: EnqueueBackgroundActionResult;
    bulkUpdateRoleUsers: BulkEnqueueBackgroundActionResult;
    upsertUser: EnqueueBackgroundActionResult;
    bulkUpsertUsers: BulkEnqueueBackgroundActionResult;
    seed: BackgroundSeedMutations;
};
export type AvailableBackgroundMutationsSelection = {
    __typename?: boolean | null | undefined;
    createMusician?: AvailableEnqueueBackgroundActionResultSelection;
    bulkCreateMusicians?: AvailableBulkEnqueueBackgroundActionResultSelection;
    updateMusician?: AvailableEnqueueBackgroundActionResultSelection;
    bulkUpdateMusicians?: AvailableBulkEnqueueBackgroundActionResultSelection;
    findFirstMusician?: AvailableEnqueueBackgroundActionResultSelection;
    bulkFindFirstMusicians?: AvailableBulkEnqueueBackgroundActionResultSelection;
    upsertMusician?: AvailableEnqueueBackgroundActionResultSelection;
    bulkUpsertMusicians?: AvailableBulkEnqueueBackgroundActionResultSelection;
    signUpUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkSignUpUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    signInUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkSignInUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    signOutUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkSignOutUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    updateUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkUpdateUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    deleteUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkDeleteUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    sendVerifyEmailUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkSendVerifyEmailUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    verifyEmailUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkVerifyEmailUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    sendResetPasswordUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkSendResetPasswordUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    resetPasswordUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkResetPasswordUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    changePasswordUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkChangePasswordUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    updateRoleUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkUpdateRoleUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    upsertUser?: AvailableEnqueueBackgroundActionResultSelection;
    bulkUpsertUsers?: AvailableBulkEnqueueBackgroundActionResultSelection;
    seed?: AvailableBackgroundSeedMutationsSelection;
};
/** The value returned from enqueuing an action to run in the background */
export type EnqueueBackgroundActionResult = {
    __typename: 'EnqueueBackgroundActionResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    backgroundAction: (BackgroundActionHandle | null);
};
export type AvailableEnqueueBackgroundActionResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    backgroundAction?: AvailableBackgroundActionHandleSelection;
};
/** One action enqueued for execution in the background */
export type BackgroundActionHandle = {
    __typename: 'BackgroundActionHandle';
    /** The ID of the background action */
    id: Scalars['String'];
};
export type AvailableBackgroundActionHandleSelection = {
    __typename?: boolean | null | undefined;
    /** The ID of the background action */
    id?: boolean | null | undefined;
};
/** The value returned from bulk enqueuing actions to run in the background */
export type BulkEnqueueBackgroundActionResult = {
    __typename: 'BulkEnqueueBackgroundActionResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    backgroundActions: BackgroundActionHandle[];
};
export type AvailableBulkEnqueueBackgroundActionResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    backgroundActions?: AvailableBackgroundActionHandleSelection;
};
export type BackgroundSeedMutations = {
    __typename: 'BackgroundSeedMutations';
    createEvents: EnqueueBackgroundActionResult;
    createMusicians: EnqueueBackgroundActionResult;
    createReviews: EnqueueBackgroundActionResult;
    createUsers: EnqueueBackgroundActionResult;
    createVenues: EnqueueBackgroundActionResult;
    debugSeed: EnqueueBackgroundActionResult;
    quickSeed: EnqueueBackgroundActionResult;
    seedAllData: EnqueueBackgroundActionResult;
    seedData: EnqueueBackgroundActionResult;
    simpleSeed: EnqueueBackgroundActionResult;
    testContext: EnqueueBackgroundActionResult;
};
export type AvailableBackgroundSeedMutationsSelection = {
    __typename?: boolean | null | undefined;
    createEvents?: AvailableEnqueueBackgroundActionResultSelection;
    createMusicians?: AvailableEnqueueBackgroundActionResultSelection;
    createReviews?: AvailableEnqueueBackgroundActionResultSelection;
    createUsers?: AvailableEnqueueBackgroundActionResultSelection;
    createVenues?: AvailableEnqueueBackgroundActionResultSelection;
    debugSeed?: AvailableEnqueueBackgroundActionResultSelection;
    quickSeed?: AvailableEnqueueBackgroundActionResultSelection;
    seedAllData?: AvailableEnqueueBackgroundActionResultSelection;
    seedData?: AvailableEnqueueBackgroundActionResultSelection;
    simpleSeed?: AvailableEnqueueBackgroundActionResultSelection;
    testContext?: AvailableEnqueueBackgroundActionResultSelection;
};
export type InternalMutations = {
    __typename: 'InternalMutations';
    startTransaction: Scalars['String'];
    commitTransaction: Scalars['String'];
    rollbackTransaction: Scalars['String'];
    /** Acquire a backend lock, returning only once the lock has been acquired */
    acquireLock: LockOperationResult;
    createSession: (InternalCreateSessionResult | null);
    updateSession: (InternalUpdateSessionResult | null);
    deleteSession: (InternalDeleteSessionResult | null);
    deleteManySession: (InternalDeleteManySessionResult | null);
    bulkCreateSessions: (InternalBulkCreateSessionsResult | null);
    upsertSession: (InternalUpsertSessionResult | null);
    createBooking: (InternalCreateBookingResult | null);
    updateBooking: (InternalUpdateBookingResult | null);
    deleteBooking: (InternalDeleteBookingResult | null);
    deleteManyBooking: (InternalDeleteManyBookingResult | null);
    bulkCreateBookings: (InternalBulkCreateBookingsResult | null);
    upsertBooking: (InternalUpsertBookingResult | null);
    createEvent: (InternalCreateEventResult | null);
    updateEvent: (InternalUpdateEventResult | null);
    deleteEvent: (InternalDeleteEventResult | null);
    deleteManyEvent: (InternalDeleteManyEventResult | null);
    bulkCreateEvents: (InternalBulkCreateEventsResult | null);
    upsertEvent: (InternalUpsertEventResult | null);
    createMusician: (InternalCreateMusicianResult | null);
    updateMusician: (InternalUpdateMusicianResult | null);
    deleteMusician: (InternalDeleteMusicianResult | null);
    deleteManyMusician: (InternalDeleteManyMusicianResult | null);
    bulkCreateMusicians: (InternalBulkCreateMusiciansResult | null);
    upsertMusician: (InternalUpsertMusicianResult | null);
    triggerCreateMusician: (CreateMusicianResult | null);
    triggerUpdateMusician: (UpdateMusicianResult | null);
    triggerFindFirstMusician: (FindFirstMusicianResult | null);
    createReview: (InternalCreateReviewResult | null);
    updateReview: (InternalUpdateReviewResult | null);
    deleteReview: (InternalDeleteReviewResult | null);
    deleteManyReview: (InternalDeleteManyReviewResult | null);
    bulkCreateReviews: (InternalBulkCreateReviewsResult | null);
    upsertReview: (InternalUpsertReviewResult | null);
    createVenue: (InternalCreateVenueResult | null);
    updateVenue: (InternalUpdateVenueResult | null);
    deleteVenue: (InternalDeleteVenueResult | null);
    deleteManyVenue: (InternalDeleteManyVenueResult | null);
    bulkCreateVenues: (InternalBulkCreateVenuesResult | null);
    upsertVenue: (InternalUpsertVenueResult | null);
    createUser: (InternalCreateUserResult | null);
    updateUser: (InternalUpdateUserResult | null);
    deleteUser: (InternalDeleteUserResult | null);
    deleteManyUser: (InternalDeleteManyUserResult | null);
    bulkCreateUsers: (InternalBulkCreateUsersResult | null);
    upsertUser: (InternalUpsertUserResult | null);
    triggerSignUpUser: (SignUpUserResult | null);
    triggerSignInUser: (SignInUserResult | null);
    triggerSignOutUser: (SignOutUserResult | null);
    triggerUpdateUser: (UpdateUserResult | null);
    triggerDeleteUser: (DeleteUserResult | null);
    triggerSendVerifyEmailUser: (SendVerifyEmailUserResult | null);
    triggerVerifyEmailUser: (VerifyEmailUserResult | null);
    triggerSendResetPasswordUser: (SendResetPasswordUserResult | null);
    triggerResetPasswordUser: (ResetPasswordUserResult | null);
    triggerChangePasswordUser: (ChangePasswordUserResult | null);
    triggerUpdateRoleUser: (UpdateRoleUserResult | null);
    cancelBackgroundAction: CancelBackgroundActionResult;
    bulkCancelBackgroundActions: BulkCancelBackgroundActionResult;
    seed: InternalSeedMutations;
};
export type AvailableInternalMutationsSelection = {
    __typename?: boolean | null | undefined;
    startTransaction?: boolean | null | undefined;
    commitTransaction?: boolean | null | undefined;
    rollbackTransaction?: boolean | null | undefined;
    /** Acquire a backend lock, returning only once the lock has been acquired */
    acquireLock?: AvailableLockOperationResultSelection;
    createSession?: AvailableInternalCreateSessionResultSelection;
    updateSession?: AvailableInternalUpdateSessionResultSelection;
    deleteSession?: AvailableInternalDeleteSessionResultSelection;
    deleteManySession?: AvailableInternalDeleteManySessionResultSelection;
    bulkCreateSessions?: AvailableInternalBulkCreateSessionsResultSelection;
    upsertSession?: AvailableInternalUpsertSessionResultSelection;
    createBooking?: AvailableInternalCreateBookingResultSelection;
    updateBooking?: AvailableInternalUpdateBookingResultSelection;
    deleteBooking?: AvailableInternalDeleteBookingResultSelection;
    deleteManyBooking?: AvailableInternalDeleteManyBookingResultSelection;
    bulkCreateBookings?: AvailableInternalBulkCreateBookingsResultSelection;
    upsertBooking?: AvailableInternalUpsertBookingResultSelection;
    createEvent?: AvailableInternalCreateEventResultSelection;
    updateEvent?: AvailableInternalUpdateEventResultSelection;
    deleteEvent?: AvailableInternalDeleteEventResultSelection;
    deleteManyEvent?: AvailableInternalDeleteManyEventResultSelection;
    bulkCreateEvents?: AvailableInternalBulkCreateEventsResultSelection;
    upsertEvent?: AvailableInternalUpsertEventResultSelection;
    createMusician?: AvailableInternalCreateMusicianResultSelection;
    updateMusician?: AvailableInternalUpdateMusicianResultSelection;
    deleteMusician?: AvailableInternalDeleteMusicianResultSelection;
    deleteManyMusician?: AvailableInternalDeleteManyMusicianResultSelection;
    bulkCreateMusicians?: AvailableInternalBulkCreateMusiciansResultSelection;
    upsertMusician?: AvailableInternalUpsertMusicianResultSelection;
    triggerCreateMusician?: AvailableCreateMusicianResultSelection;
    triggerUpdateMusician?: AvailableUpdateMusicianResultSelection;
    triggerFindFirstMusician?: AvailableFindFirstMusicianResultSelection;
    createReview?: AvailableInternalCreateReviewResultSelection;
    updateReview?: AvailableInternalUpdateReviewResultSelection;
    deleteReview?: AvailableInternalDeleteReviewResultSelection;
    deleteManyReview?: AvailableInternalDeleteManyReviewResultSelection;
    bulkCreateReviews?: AvailableInternalBulkCreateReviewsResultSelection;
    upsertReview?: AvailableInternalUpsertReviewResultSelection;
    createVenue?: AvailableInternalCreateVenueResultSelection;
    updateVenue?: AvailableInternalUpdateVenueResultSelection;
    deleteVenue?: AvailableInternalDeleteVenueResultSelection;
    deleteManyVenue?: AvailableInternalDeleteManyVenueResultSelection;
    bulkCreateVenues?: AvailableInternalBulkCreateVenuesResultSelection;
    upsertVenue?: AvailableInternalUpsertVenueResultSelection;
    createUser?: AvailableInternalCreateUserResultSelection;
    updateUser?: AvailableInternalUpdateUserResultSelection;
    deleteUser?: AvailableInternalDeleteUserResultSelection;
    deleteManyUser?: AvailableInternalDeleteManyUserResultSelection;
    bulkCreateUsers?: AvailableInternalBulkCreateUsersResultSelection;
    upsertUser?: AvailableInternalUpsertUserResultSelection;
    triggerSignUpUser?: AvailableSignUpUserResultSelection;
    triggerSignInUser?: AvailableSignInUserResultSelection;
    triggerSignOutUser?: AvailableSignOutUserResultSelection;
    triggerUpdateUser?: AvailableUpdateUserResultSelection;
    triggerDeleteUser?: AvailableDeleteUserResultSelection;
    triggerSendVerifyEmailUser?: AvailableSendVerifyEmailUserResultSelection;
    triggerVerifyEmailUser?: AvailableVerifyEmailUserResultSelection;
    triggerSendResetPasswordUser?: AvailableSendResetPasswordUserResultSelection;
    triggerResetPasswordUser?: AvailableResetPasswordUserResultSelection;
    triggerChangePasswordUser?: AvailableChangePasswordUserResultSelection;
    triggerUpdateRoleUser?: AvailableUpdateRoleUserResultSelection;
    cancelBackgroundAction?: AvailableCancelBackgroundActionResultSelection;
    bulkCancelBackgroundActions?: AvailableBulkCancelBackgroundActionResultSelection;
    seed?: AvailableInternalSeedMutationsSelection;
};
export type LockOperationResult = {
    __typename: 'LockOperationResult';
    /** Whether the lock operation succeeded */
    success: Scalars['Boolean'];
    /** Any errors encountered during the locking/unlocking operation */
    errors: ExecutionError[];
};
export type AvailableLockOperationResultSelection = {
    __typename?: boolean | null | undefined;
    /** Whether the lock operation succeeded */
    success?: boolean | null | undefined;
    /** Any errors encountered during the locking/unlocking operation */
    errors?: AvailableExecutionErrorSelection;
};
export type InternalCreateSessionResult = {
    __typename: 'InternalCreateSessionResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    session: (InternalSessionRecord | null);
};
export type AvailableInternalCreateSessionResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    session?: boolean | null | undefined;
};
export type InternalUpdateSessionResult = {
    __typename: 'InternalUpdateSessionResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    session: (InternalSessionRecord | null);
};
export type AvailableInternalUpdateSessionResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    session?: boolean | null | undefined;
};
export type InternalDeleteSessionResult = {
    __typename: 'InternalDeleteSessionResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    session: (InternalSessionRecord | null);
};
export type AvailableInternalDeleteSessionResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    session?: boolean | null | undefined;
};
export type InternalDeleteManySessionResult = {
    __typename: 'InternalDeleteManySessionResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
};
export type AvailableInternalDeleteManySessionResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
};
export type InternalBulkCreateSessionsResult = {
    __typename: 'InternalBulkCreateSessionsResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    sessions: (InternalSessionRecord | null)[];
};
export type AvailableInternalBulkCreateSessionsResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    sessions?: boolean | null | undefined;
};
export type InternalUpsertSessionResult = {
    __typename: 'InternalUpsertSessionResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    session: (InternalSessionRecord | null);
};
export type AvailableInternalUpsertSessionResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    session?: boolean | null | undefined;
};
export type InternalCreateBookingResult = {
    __typename: 'InternalCreateBookingResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    booking: (InternalBookingRecord | null);
};
export type AvailableInternalCreateBookingResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    booking?: boolean | null | undefined;
};
export type InternalUpdateBookingResult = {
    __typename: 'InternalUpdateBookingResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    booking: (InternalBookingRecord | null);
};
export type AvailableInternalUpdateBookingResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    booking?: boolean | null | undefined;
};
export type InternalDeleteBookingResult = {
    __typename: 'InternalDeleteBookingResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    booking: (InternalBookingRecord | null);
};
export type AvailableInternalDeleteBookingResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    booking?: boolean | null | undefined;
};
export type InternalDeleteManyBookingResult = {
    __typename: 'InternalDeleteManyBookingResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
};
export type AvailableInternalDeleteManyBookingResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
};
export type InternalBulkCreateBookingsResult = {
    __typename: 'InternalBulkCreateBookingsResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    bookings: (InternalBookingRecord | null)[];
};
export type AvailableInternalBulkCreateBookingsResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    bookings?: boolean | null | undefined;
};
export type InternalUpsertBookingResult = {
    __typename: 'InternalUpsertBookingResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    booking: (InternalBookingRecord | null);
};
export type AvailableInternalUpsertBookingResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    booking?: boolean | null | undefined;
};
export type InternalCreateEventResult = {
    __typename: 'InternalCreateEventResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    event: (InternalEventRecord | null);
};
export type AvailableInternalCreateEventResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    event?: boolean | null | undefined;
};
export type InternalUpdateEventResult = {
    __typename: 'InternalUpdateEventResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    event: (InternalEventRecord | null);
};
export type AvailableInternalUpdateEventResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    event?: boolean | null | undefined;
};
export type InternalDeleteEventResult = {
    __typename: 'InternalDeleteEventResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    event: (InternalEventRecord | null);
};
export type AvailableInternalDeleteEventResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    event?: boolean | null | undefined;
};
export type InternalDeleteManyEventResult = {
    __typename: 'InternalDeleteManyEventResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
};
export type AvailableInternalDeleteManyEventResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
};
export type InternalBulkCreateEventsResult = {
    __typename: 'InternalBulkCreateEventsResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    events: (InternalEventRecord | null)[];
};
export type AvailableInternalBulkCreateEventsResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    events?: boolean | null | undefined;
};
export type InternalUpsertEventResult = {
    __typename: 'InternalUpsertEventResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    event: (InternalEventRecord | null);
};
export type AvailableInternalUpsertEventResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    event?: boolean | null | undefined;
};
export type InternalCreateMusicianResult = {
    __typename: 'InternalCreateMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    musician: (InternalMusicianRecord | null);
};
export type AvailableInternalCreateMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    musician?: boolean | null | undefined;
};
export type InternalUpdateMusicianResult = {
    __typename: 'InternalUpdateMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    musician: (InternalMusicianRecord | null);
};
export type AvailableInternalUpdateMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    musician?: boolean | null | undefined;
};
export type InternalDeleteMusicianResult = {
    __typename: 'InternalDeleteMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    musician: (InternalMusicianRecord | null);
};
export type AvailableInternalDeleteMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    musician?: boolean | null | undefined;
};
export type InternalDeleteManyMusicianResult = {
    __typename: 'InternalDeleteManyMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
};
export type AvailableInternalDeleteManyMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
};
export type InternalBulkCreateMusiciansResult = {
    __typename: 'InternalBulkCreateMusiciansResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    musicians: (InternalMusicianRecord | null)[];
};
export type AvailableInternalBulkCreateMusiciansResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    musicians?: boolean | null | undefined;
};
export type InternalUpsertMusicianResult = {
    __typename: 'InternalUpsertMusicianResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    musician: (InternalMusicianRecord | null);
};
export type AvailableInternalUpsertMusicianResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    musician?: boolean | null | undefined;
};
export type InternalCreateReviewResult = {
    __typename: 'InternalCreateReviewResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    review: (InternalReviewRecord | null);
};
export type AvailableInternalCreateReviewResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    review?: boolean | null | undefined;
};
export type InternalUpdateReviewResult = {
    __typename: 'InternalUpdateReviewResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    review: (InternalReviewRecord | null);
};
export type AvailableInternalUpdateReviewResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    review?: boolean | null | undefined;
};
export type InternalDeleteReviewResult = {
    __typename: 'InternalDeleteReviewResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    review: (InternalReviewRecord | null);
};
export type AvailableInternalDeleteReviewResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    review?: boolean | null | undefined;
};
export type InternalDeleteManyReviewResult = {
    __typename: 'InternalDeleteManyReviewResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
};
export type AvailableInternalDeleteManyReviewResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
};
export type InternalBulkCreateReviewsResult = {
    __typename: 'InternalBulkCreateReviewsResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    reviews: (InternalReviewRecord | null)[];
};
export type AvailableInternalBulkCreateReviewsResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    reviews?: boolean | null | undefined;
};
export type InternalUpsertReviewResult = {
    __typename: 'InternalUpsertReviewResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    review: (InternalReviewRecord | null);
};
export type AvailableInternalUpsertReviewResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    review?: boolean | null | undefined;
};
export type InternalCreateVenueResult = {
    __typename: 'InternalCreateVenueResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    venue: (InternalVenueRecord | null);
};
export type AvailableInternalCreateVenueResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    venue?: boolean | null | undefined;
};
export type InternalUpdateVenueResult = {
    __typename: 'InternalUpdateVenueResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    venue: (InternalVenueRecord | null);
};
export type AvailableInternalUpdateVenueResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    venue?: boolean | null | undefined;
};
export type InternalDeleteVenueResult = {
    __typename: 'InternalDeleteVenueResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    venue: (InternalVenueRecord | null);
};
export type AvailableInternalDeleteVenueResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    venue?: boolean | null | undefined;
};
export type InternalDeleteManyVenueResult = {
    __typename: 'InternalDeleteManyVenueResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
};
export type AvailableInternalDeleteManyVenueResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
};
export type InternalBulkCreateVenuesResult = {
    __typename: 'InternalBulkCreateVenuesResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    venues: (InternalVenueRecord | null)[];
};
export type AvailableInternalBulkCreateVenuesResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    venues?: boolean | null | undefined;
};
export type InternalUpsertVenueResult = {
    __typename: 'InternalUpsertVenueResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    venue: (InternalVenueRecord | null);
};
export type AvailableInternalUpsertVenueResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    venue?: boolean | null | undefined;
};
export type InternalCreateUserResult = {
    __typename: 'InternalCreateUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    user: (InternalUserRecord | null);
};
export type AvailableInternalCreateUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    user?: boolean | null | undefined;
};
export type InternalUpdateUserResult = {
    __typename: 'InternalUpdateUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    user: (InternalUserRecord | null);
};
export type AvailableInternalUpdateUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    user?: boolean | null | undefined;
};
export type InternalDeleteUserResult = {
    __typename: 'InternalDeleteUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    user: (InternalUserRecord | null);
};
export type AvailableInternalDeleteUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    user?: boolean | null | undefined;
};
export type InternalDeleteManyUserResult = {
    __typename: 'InternalDeleteManyUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
};
export type AvailableInternalDeleteManyUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
};
export type InternalBulkCreateUsersResult = {
    __typename: 'InternalBulkCreateUsersResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    users: (InternalUserRecord | null)[];
};
export type AvailableInternalBulkCreateUsersResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    users?: boolean | null | undefined;
};
export type InternalUpsertUserResult = {
    __typename: 'InternalUpsertUserResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    /** Whether the record was created by this upsert operation */
    created: Scalars['Boolean'];
    user: (InternalUserRecord | null);
};
export type AvailableInternalUpsertUserResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    /** Whether the record was created by this upsert operation */
    created?: boolean | null | undefined;
    user?: boolean | null | undefined;
};
/** The value returned from cancelling a background action */
export type CancelBackgroundActionResult = {
    __typename: 'CancelBackgroundActionResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    backgroundAction: (BackgroundActionHandle | null);
};
export type AvailableCancelBackgroundActionResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    backgroundAction?: AvailableBackgroundActionHandleSelection;
};
/** The value returned from cancelling a background action */
export type BulkCancelBackgroundActionResult = {
    __typename: 'BulkCancelBackgroundActionResult';
    successCount: Scalars['Int'];
    failedCount: Scalars['Int'];
};
export type AvailableBulkCancelBackgroundActionResultSelection = {
    __typename?: boolean | null | undefined;
    successCount?: boolean | null | undefined;
    failedCount?: boolean | null | undefined;
};
export type InternalSeedMutations = {
    __typename: 'InternalSeedMutations';
    triggerCreateEvents: (SeedCreateEventsResult | null);
    triggerCreateMusicians: (SeedCreateMusiciansResult | null);
    triggerCreateReviews: (SeedCreateReviewsResult | null);
    triggerCreateUsers: (SeedCreateUsersResult | null);
    triggerCreateVenues: (SeedCreateVenuesResult | null);
    triggerDebugSeed: (SeedDebugSeedResult | null);
    triggerQuickSeed: (SeedQuickSeedResult | null);
    triggerSeedAllData: (SeedSeedAllDataResult | null);
    triggerSeedData: (SeedSeedDataResult | null);
    triggerSimpleSeed: (SeedSimpleSeedResult | null);
    triggerTestContext: (SeedTestContextResult | null);
};
export type AvailableInternalSeedMutationsSelection = {
    __typename?: boolean | null | undefined;
    triggerCreateEvents?: AvailableSeedCreateEventsResultSelection;
    triggerCreateMusicians?: AvailableSeedCreateMusiciansResultSelection;
    triggerCreateReviews?: AvailableSeedCreateReviewsResultSelection;
    triggerCreateUsers?: AvailableSeedCreateUsersResultSelection;
    triggerCreateVenues?: AvailableSeedCreateVenuesResultSelection;
    triggerDebugSeed?: AvailableSeedDebugSeedResultSelection;
    triggerQuickSeed?: AvailableSeedQuickSeedResultSelection;
    triggerSeedAllData?: AvailableSeedSeedAllDataResultSelection;
    triggerSeedData?: AvailableSeedSeedDataResultSelection;
    triggerSimpleSeed?: AvailableSeedSimpleSeedResultSelection;
    triggerTestContext?: AvailableSeedTestContextResultSelection;
};
export type SeedCreateEventsResult = {
    __typename: 'SeedCreateEventsResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedCreateEventsResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedCreateMusiciansResult = {
    __typename: 'SeedCreateMusiciansResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedCreateMusiciansResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedCreateReviewsResult = {
    __typename: 'SeedCreateReviewsResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedCreateReviewsResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedCreateUsersResult = {
    __typename: 'SeedCreateUsersResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedCreateUsersResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedCreateVenuesResult = {
    __typename: 'SeedCreateVenuesResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedCreateVenuesResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedDebugSeedResult = {
    __typename: 'SeedDebugSeedResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedDebugSeedResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedQuickSeedResult = {
    __typename: 'SeedQuickSeedResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedQuickSeedResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedSeedAllDataResult = {
    __typename: 'SeedSeedAllDataResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedSeedAllDataResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedSeedDataResult = {
    __typename: 'SeedSeedDataResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedSeedDataResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedSimpleSeedResult = {
    __typename: 'SeedSimpleSeedResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedSimpleSeedResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedTestContextResult = {
    __typename: 'SeedTestContextResult';
    success: Scalars['Boolean'];
    errors: ExecutionError[];
    result: (Scalars['JSON'] | null);
};
export type AvailableSeedTestContextResultSelection = {
    __typename?: boolean | null | undefined;
    success?: boolean | null | undefined;
    errors?: AvailableExecutionErrorSelection;
    result?: boolean | null | undefined;
};
export type SeedMutations = {
    __typename: 'SeedMutations';
    createEvents: (SeedCreateEventsResult | null);
    createMusicians: (SeedCreateMusiciansResult | null);
    createReviews: (SeedCreateReviewsResult | null);
    createUsers: (SeedCreateUsersResult | null);
    createVenues: (SeedCreateVenuesResult | null);
    debugSeed: (SeedDebugSeedResult | null);
    quickSeed: (SeedQuickSeedResult | null);
    seedAllData: (SeedSeedAllDataResult | null);
    seedData: (SeedSeedDataResult | null);
    simpleSeed: (SeedSimpleSeedResult | null);
    testContext: (SeedTestContextResult | null);
};
export type AvailableSeedMutationsSelection = {
    __typename?: boolean | null | undefined;
    createEvents?: AvailableSeedCreateEventsResultSelection;
    createMusicians?: AvailableSeedCreateMusiciansResultSelection;
    createReviews?: AvailableSeedCreateReviewsResultSelection;
    createUsers?: AvailableSeedCreateUsersResultSelection;
    createVenues?: AvailableSeedCreateVenuesResultSelection;
    debugSeed?: AvailableSeedDebugSeedResultSelection;
    quickSeed?: AvailableSeedQuickSeedResultSelection;
    seedAllData?: AvailableSeedSeedAllDataResultSelection;
    seedData?: AvailableSeedSeedDataResultSelection;
    simpleSeed?: AvailableSeedSimpleSeedResultSelection;
    testContext?: AvailableSeedTestContextResultSelection;
};
export type Subscription = {
    __typename: 'Subscription';
    /** Subscribe to events about the application for the development harness */
    gadgetMetaHarnessEvents: GadgetApplicationHarnessEvent;
    backgroundAction: (BackgroundAction | null);
};
export type AvailableSubscriptionSelection = {
    __typename?: boolean | null | undefined;
    /** Subscribe to events about the application for the development harness */
    gadgetMetaHarnessEvents?: AvailableGadgetApplicationHarnessEventSelection;
    backgroundAction?: AvailableBackgroundActionSelection;
};
export type GadgetApplicationHarnessEvent = {
    __typename: 'GadgetApplicationHarnessEvent';
    id: Scalars['String'];
    event: Scalars['JSON'];
};
export type AvailableGadgetApplicationHarnessEventSelection = {
    __typename?: boolean | null | undefined;
    id?: boolean | null | undefined;
    event?: boolean | null | undefined;
};
export type BackgroundAction = {
    __typename: 'BackgroundAction';
    /** The ID of the background action */
    id: Scalars['String'];
    outcome: (BackgroundActionOutcome | null);
    result: (BackgroundActionResult | null);
};
export type AvailableBackgroundActionSelection = {
    __typename?: boolean | null | undefined;
    /** The ID of the background action */
    id?: boolean | null | undefined;
    outcome?: boolean | null | undefined;
    result?: AvailableBackgroundActionResultSelection;
};
export type ExplicitNestingRequired = never;
export type DeepFilterNever<T> = T extends Record<string, unknown> ? FilterNever<{
    [Key in keyof T]: T[Key] extends Record<string, unknown> ? DeepFilterNever<T[Key]> : T[Key];
}> : T;
/**
 * Given a schema we can select values from, apply a given selection to that schema to get the output type.
 **/
export type Select<Schema, Selection extends FieldSelection | null | undefined> = Selection extends null | undefined ? never : Schema extends (infer T)[] ? Select<T, Selection>[] : Schema extends null ? Select<Exclude<Schema, null>, Selection> | null : {
    [Key in keyof Selection & keyof Schema]: Selection[Key] extends true ? Schema[Key] : Selection[Key] extends FieldSelection ? Select<Schema[Key], Selection[Key]> : never;
};
export type IDsList = {
    ids: string[];
};
/**
 * For finder functions which accept the `live: true` argument, this type decides if the return type will be one value or an async iterable stream of values
 * If {live: true}, returns an AsyncIterable<Result>
 * Anything else, returns a Promise<Result>
 **/
export type PromiseOrLiveIterator<Options extends {
    live?: boolean;
}, Result> = Options extends {
    live: true;
} ? AsyncIterable<Result> : Promise<Result>;
export type { ComputedViewWithoutVariables, ComputedViewWithVariables, ComputedViewFunctionWithoutVariables, ComputedViewFunctionWithVariables };
