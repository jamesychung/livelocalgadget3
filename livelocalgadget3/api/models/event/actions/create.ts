import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

/**
 * Action to create a new event
 */
export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  try {
    // Debug: Log the parameters being received
    logger.info(`Event create parameters: ${JSON.stringify(params)}`);
    logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
    logger.info(`Session user: ${JSON.stringify(session?.user)}`);
    
    // Apply the parameters to the record
    applyParams(params, record);
    
    logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
    
    // Set the createdBy from the session user if not already set
    if (session?.user && !record.createdBy) {
      record.createdBy = { connect: { id: session.user.id } };
      logger.info(`Set createdBy to user ID: ${session.user.id}`);
    }
    
    // Set default values for required fields if not provided
    if (!record.isActive) record.isActive = true;
    if (!record.isPublic) record.isPublic = true;
    if (!record.status) record.status = "confirmed";
    if (!record.availableTickets && record.totalCapacity) {
      record.availableTickets = record.totalCapacity;
    }
    
    // Ensure string fields have defaults
    if (!record.title) record.title = "Untitled Event";
    if (!record.description) record.description = "";
    if (!record.category) record.category = "";
    if (!record.ticketType) record.ticketType = "general";
    
    // Ensure genres field has default
    if (!record.genres) record.genres = [];
    
    // Ensure equipment field has default
    if (!record.equipment) record.equipment = [];
    
    // Ensure recurring event fields have defaults
    if (!record.isRecurring) record.isRecurring = false;
    if (!record.recurringPattern) record.recurringPattern = "weekly";
    if (!record.recurringInterval) record.recurringInterval = 1;
    if (!record.recurringDays) record.recurringDays = [];
    
    // Ensure numeric fields have defaults
    if (!record.ticketPrice) record.ticketPrice = 0;
    if (!record.totalCapacity) record.totalCapacity = 0;
    if (!record.availableTickets) record.availableTickets = 0;
    
    logger.info(`Record after setting defaults: ${JSON.stringify(record)}`);
    
    // Validate required fields
    if (!record.title) {
      throw new Error("Event title is required");
    }
    if (!record.date) {
      throw new Error("Event date is required");
    }
    if (!record.venue) {
      throw new Error("Event venue is required");
    }
    if (!record.createdBy) {
      throw new Error("Event creator is required");
    }
    
    // Validate recurring event fields if recurring is enabled
    if (record.isRecurring) {
      if (!record.recurringPattern) {
        throw new Error("Recurring pattern is required for recurring events");
      }
      
      // Validate based on pattern type
      switch (record.recurringPattern) {
        case "weekly":
          if (!record.recurringDays || record.recurringDays.length === 0) {
            throw new Error("Recurring days are required for weekly recurring events");
          }
          break;
        case "bi-weekly":
          // No additional validation needed - repeats every 2 weeks automatically
          break;
        case "monthly":
          if (!record.recurringDays || record.recurringDays.length === 0) {
            throw new Error("Recurring days of month are required for monthly recurring events");
          }
          break;
        case "daily":
          // No additional validation needed for daily
          break;
        default:
          throw new Error(`Invalid recurring pattern: ${record.recurringPattern}`);
      }
    }
    
    logger.info("All validations passed, saving record...");
    
    // Save the record to the database
    await save(record);
    
    logger.info(`Created event with ID: ${record.id}`);
    logger.info(`Event title: ${record.title}, Status: ${record.status}`);
    logger.info(`Event genres: ${JSON.stringify(record.genres)}`);
    logger.info(`Event equipment: ${JSON.stringify(record.equipment)}`);
    logger.info(`Event recurring: ${record.isRecurring}, Pattern: ${record.recurringPattern}`);
    
    return {
      result: "ok"
    };
  } catch (error) {
    logger.error(`Error creating event: ${error}`);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
}; 