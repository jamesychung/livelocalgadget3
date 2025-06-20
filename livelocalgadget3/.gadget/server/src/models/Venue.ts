// All the generated types for the "venue" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger, TriggerWithType } from "../types";
import type { Scalars } from "@gadget-client/livelocalgadget3";
import { GadgetRecord, Venue } from "@gadget-client/livelocalgadget3";
import { Select } from "@gadgetinc/api-client-core";

export type DefaultVenueServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly state: true;
      readonly events: false;
      readonly bookings: false;
      readonly address: true;
      readonly amenities: true;
      readonly capacity: true;
      readonly city: true;
      readonly country: true;
      readonly description: true;
      readonly email: true;
      readonly genres: true;
      readonly hours: true;
      readonly isActive: true;
      readonly isVerified: true;
      readonly name: true;
      readonly ownerId: true;
    readonly owner: false;
      readonly phone: true;
      readonly priceRange: true;
      readonly profilePicture: true;
      readonly rating: true;
      readonly socialLinks: true;
      readonly type: true;
      readonly website: true;
      readonly zipCode: true;
      readonly reviews: false;
  };

