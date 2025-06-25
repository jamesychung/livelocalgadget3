import { applyParams, save, ActionOptions, ActionRun, ActionOnSuccess } from "gadget-server";

// Allows users to update their primary role (e.g., become a musician, venue owner, etc.)

/**
 * Action to update user roles based on their profiles
 */
export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  try {
    logger.info(`Update role parameters: ${JSON.stringify(params)}`);
    logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
    
    // Apply the parameters to the record
    applyParams(params, record);
    
    logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
    
    // Check if user has a venue profile
    const venues = await api.venue.findMany({
      filter: { owner: { id: { equals: record.id } } },
      first: 1
    });
    
    // Check if user has a musician profile
    const musicians = await api.musician.findMany({
      filter: { user: { id: { equals: record.id } } },
      first: 1
    });
    
    const currentRoles = record.roles || [];
    let updatedRoles = [...currentRoles];
    let primaryRole = record.primaryRole || 'user';
    
    // Add venueOwner role if user has a venue
    if (venues.length > 0 && !currentRoles.includes('venueOwner')) {
      updatedRoles.push('venueOwner');
      primaryRole = 'venue';
      logger.info(`Adding venueOwner role to user ${record.id}`);
    }
    
    // Add musician role if user has a musician profile
    if (musicians.length > 0 && !currentRoles.includes('musician')) {
      updatedRoles.push('musician');
      if (primaryRole === 'user') {
        primaryRole = 'musician';
      }
      logger.info(`Adding musician role to user ${record.id}`);
    }
    
    // Update the record with new roles
    record.roles = updatedRoles;
    record.primaryRole = primaryRole;
    
    logger.info(`Updated user ${record.id} roles to: ${updatedRoles.join(', ')}`);
    logger.info(`Updated user ${record.id} primary role to: ${primaryRole}`);
    
    // Save the record to the database
    await save(record);
    
    return {
      result: "ok"
    };
  } catch (error) {
    logger.error(`Error updating user roles: ${error}`);
    throw error;
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, session }) => {
  logger.info(`User ${record.email} updated their primary role to: ${record.primaryRole}`);
  
  // Optionally create profile records based on role
  if (record.primaryRole === "musician") {
    // Check if musician profile already exists
    const existingMusicians = await api.musician.findMany({
      filter: { userId: { equals: record.id } },
      first: 1
    });
    
    if (existingMusicians.length === 0) {
      await api.musician.create({
        user: { _link: record.id },
        name: `${record.firstName} ${record.lastName}`.trim(),
        email: record.email,
        isActive: true
      });
    }
  } else if (record.primaryRole === "venue") {
    // Check if venue profile already exists
    const existingVenues = await api.venue.findMany({
      filter: { ownerId: { equals: record.id } },
      first: 1
    });
    
    if (existingVenues.length === 0) {
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