import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Debug: Log the parameters being received
  logger.info(`Venue create parameters: ${JSON.stringify(params)}`);
  logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
  logger.info(`Session user: ${JSON.stringify(session?.user)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
  
  // Set the owner from the session user if not already set
  if (session?.user && !record.owner) {
    record.owner = { connect: { id: session.user.id } };
  }
  
  // Set default values for required fields if not provided
  if (!record.isActive) record.isActive = true;
  if (!record.isVerified) record.isVerified = false;
  if (!record.rating) record.rating = 0;
  if (!record.capacity) record.capacity = 0;
  
  // Ensure arrays are properly formatted
  if (!record.genres || !Array.isArray(record.genres)) {
    record.genres = [];
  }
  if (!record.amenities || !Array.isArray(record.amenities)) {
    record.amenities = [];
  }
  if (!record.socialLinks || !Array.isArray(record.socialLinks)) {
    record.socialLinks = [];
  }
  if (!record.additionalPictures || !Array.isArray(record.additionalPictures)) {
    record.additionalPictures = [];
  }
  if (!record.hours || typeof record.hours !== 'object') {
    record.hours = {};
  }
  
  // Ensure string fields have defaults
  if (!record.description) record.description = "";
  if (!record.type) record.type = "";
  if (!record.city) record.city = "";
  if (!record.state) record.state = "";
  if (!record.country) record.country = "";
  if (!record.phone) record.phone = "";
  if (!record.address) record.address = "";
  if (!record.zipCode) record.zipCode = "";
  if (!record.priceRange) record.priceRange = "";
  
  // Build location string if not provided
  if (!record.location && record.city && record.state && record.country) {
    record.location = `${record.city}, ${record.state}, ${record.country}`;
  }
  
  // Ensure name is set
  if (!record.name) {
    record.name = "Unnamed Venue";
  }
  
  logger.info(`Record after setting defaults: ${JSON.stringify(record)}`);
  
  // Save the record to the database
  await save(record);
  
  logger.info(`Created venue profile with ID: ${record.id}`);
  logger.info(`Venue name: ${record.name}, Type: ${record.type}`);
  
  // Add venueOwner role to user if they don't already have it
  if (session?.user) {
    try {
      const user = await api.user.findOne(session.user.id);
      if (user) {
        const currentRoles = user.roles || [];
        if (!currentRoles.includes('venueOwner')) {
          const updatedRoles = [...currentRoles, 'venueOwner'];
          await api.user.update(session.user.id, {
            roles: updatedRoles
          });
          logger.info(`Added venueOwner role to user ${session.user.id}`);
        }
      }
    } catch (error) {
      logger.error(`Failed to add venueOwner role: ${error}`);
    }
  }
  
  return {
    result: "ok"
  };
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
}; 