// All the generated types for the "booking" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger, TriggerWithType } from "../types";
import type { Scalars } from "@gadget-client/livelocalgadget3";
import { GadgetRecord, Booking } from "@gadget-client/livelocalgadget3";
import { Select } from "@gadgetinc/api-client-core";

export type DefaultBookingServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly bookedById: true;
    readonly bookedBy: false;
      readonly date: true;
      readonly depositAmount: true;
      readonly depositPaid: true;
      readonly endTime: true;
      readonly fullPaymentPaid: true;
      readonly isActive: true;
      readonly musicianId: true;
    readonly musician: false;
      readonly notes: true;
      readonly specialRequirements: true;
      readonly startTime: true;
      readonly status: true;
      readonly totalAmount: true;
      readonly venueId: true;
    readonly venue: false;
  };

