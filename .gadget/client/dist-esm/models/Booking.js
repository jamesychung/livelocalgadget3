import { buildModelManager } from "../builder.js";
const DefaultBookingSelection = {
  __typename: true,
  id: true,
  bookedById: true,
  createdAt: true,
  date: true,
  depositAmount: true,
  depositPaid: true,
  endTime: true,
  eventId: true,
  fullPaymentPaid: true,
  isActive: true,
  musicianId: true,
  musicianPitch: true,
  notes: true,
  proposedRate: true,
  specialRequirements: true,
  startTime: true,
  status: true,
  totalAmount: true,
  updatedAt: true,
  venueId: true
};
const modelApiIdentifier = "booking";
const pluralModelApiIdentifier = "bookings";
;
;
;
;
;
;
const BookingManager = buildModelManager(
  modelApiIdentifier,
  pluralModelApiIdentifier,
  DefaultBookingSelection,
  [
    {
      type: "findOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: modelApiIdentifier,
      modelApiIdentifier,
      findByVariableName: "id",
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: "findMany",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: "findFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: "maybeFindFirst",
      operationName: pluralModelApiIdentifier,
      modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: "findOne",
      operationName: pluralModelApiIdentifier,
      functionName: "findById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: "maybeFindOne",
      operationName: pluralModelApiIdentifier,
      functionName: "maybeFindById",
      findByField: "id",
      findByVariableName: "id",
      modelApiIdentifier,
      defaultSelection: DefaultBookingSelection,
      namespace: null
    },
    {
      type: "action",
      operationName: "updateBooking",
      operationReturnType: "UpdateBooking",
      functionName: "update",
      namespace: null,
      modelApiIdentifier,
      operatesWithRecordIdentity: true,
      modelSelectionField: modelApiIdentifier,
      isBulk: false,
      isDeleter: false,
      variables: { id: { required: true, type: "GadgetID" } },
      hasAmbiguousIdentifier: false,
      paramOnlyVariables: [],
      hasReturnType: false,
      acceptsModelInput: false,
      hasCreateOrUpdateEffect: false,
      defaultSelection: DefaultBookingSelection
    },
    {
      type: "action",
      operationName: "bulkUpdateBookings",
      functionName: "bulkUpdate",
      isBulk: true,
      isDeleter: false,
      hasReturnType: false,
      acceptsModelInput: false,
      operatesWithRecordIdentity: true,
      singleActionFunctionName: "update",
      modelApiIdentifier,
      modelSelectionField: pluralModelApiIdentifier,
      namespace: null,
      variables: { ids: { required: true, type: "[GadgetID!]" } },
      paramOnlyVariables: [],
      defaultSelection: DefaultBookingSelection
    },
    {
      type: "computedView",
      operationName: "view",
      functionName: "view",
      gqlFieldName: "bookingGellyView",
      namespace: null,
      variables: {
        query: { type: "String", required: true },
        args: { type: "JSONObject" }
      }
    }
  ]
);
export {
  BookingManager,
  DefaultBookingSelection
};
//# sourceMappingURL=Booking.js.map
