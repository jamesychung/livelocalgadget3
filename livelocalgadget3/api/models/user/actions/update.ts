import { applyParams, save, ActionOptions } from "gadget-server";

export const run = async ({ params, record, logger, api, session }) => {
  // Allow primaryRole changes if the user doesn't have a role set yet (profile setup)
  const isProfileSetup = !record.primaryRole || record.primaryRole === "user";
  
  if (params.primaryRole && params.primaryRole !== record.primaryRole && !isProfileSetup) {
    throw new Error("Primary role cannot be changed after profile setup");
  }
  
  applyParams(params, record);
  
  // If this is a role change during profile setup, assign appropriate roles
  if (params.primaryRole && isProfileSetup) {
    const baseRoles = ["signed-in"];
    
    if (record.primaryRole === "musician") {
      record.roles = [...baseRoles, "musician"];
    } else if (record.primaryRole === "venue") {
      record.roles = [...baseRoles, "venueOwner"];
    } else {
      // Default to "user" role
      record.roles = baseRoles;
    }
    
    logger.info(`User ${record.email} set primary role to: ${record.primaryRole}`);
  }
  
  await save(record);
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
};
