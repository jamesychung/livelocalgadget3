// All the generated types for the "review" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger, TriggerWithType } from "../types";
import type { Scalars } from "@gadget-client/livelocalgadget6";
import { GadgetRecord, Review } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";

export type DefaultReviewServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly comment: true;
      readonly eventId: true;
    readonly event: false;
      readonly isActive: true;
      readonly isVerified: true;
      readonly musicianId: true;
    readonly musician: false;
      readonly rating: true;
      readonly reviewerId: true;
    readonly reviewer: false;
      readonly reviewType: true;
      readonly venueId: true;
    readonly venue: false;
  };

