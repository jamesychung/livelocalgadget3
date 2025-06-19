import { applyParams, save, ActionOptions } from "gadget-server";

// Allows users to update their primary role (e.g., become a musician, venue owner, etc.)

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  applyParams(params, record);
  
  // Validate that the user is updating their own record
  if (session?.user?.id !== record.id) {
    throw new Error("You can only update your own roles");
  }
  
  // Ensure user always has the "signed-in" role
  const baseRoles = ["signed-in"];
  
  // Assign appropriate roles based on primaryRole
  if (record.primaryRole === "musician") {
    record.roles = [...baseRoles, "musician"];
  } else if (record.primaryRole === "venue") {
    record.roles = [...baseRoles, "venueOwner"];
  } else {
    // Default to "user" role (just signed-in)
    record.roles = baseRoles;
  }
  
  await save(record);
  
  return {
    result: "ok"
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, session }) => {
  logger.info(`User ${record.email} updated their primary role to: ${record.primaryRole}`);
  
  // Optionally create profile records based on role
  if (record.primaryRole === "musician") {
    // Check if musician profile already exists
    const existingMusician = await api.musician.findFirst({
      filter: { user: { equals: record.id } }
    });
    
    if (!existingMusician) {
      await api.musician.create({
        user: { _link: record.id },
        name: `${record.firstName} ${record.lastName}`.trim(),
        email: record.email,
        isActive: true
      });
    }
  } else if (record.primaryRole === "venue") {
    // Check if venue profile already exists
    const existingVenue = await api.venue.findFirst({
      filter: { owner: { equals: record.id } }
    });
    
    if (!existingVenue) {
      await api.venue.create({
        owner: { _link: record.id },
        name: `${record.firstName} ${record.lastName}`.trim(),
        email: record.email,
        isActive: true
      });
    }
  }
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
}; 