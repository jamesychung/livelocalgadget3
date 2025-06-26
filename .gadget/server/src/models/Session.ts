// All the generated types for the "session" model preconditions, actions, params, etc
import { AmbientContext } from "../AmbientContext";
import { ActionExecutionScope, NotYetTyped, ValidationErrors, ActionTrigger, TriggerWithType } from "../types";
import type { Scalars } from "@gadget-client/livelocalgadget6";
import { GadgetRecord, Session } from "@gadget-client/livelocalgadget6";
import { Select } from "@gadgetinc/api-client-core";

export type DefaultSessionServerSelection = {
  readonly __typename: true;
      readonly id: true;
      readonly createdAt: true;
      readonly updatedAt: true;
      readonly userId: true;
    readonly user: false;
  };

