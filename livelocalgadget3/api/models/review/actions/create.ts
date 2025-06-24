import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

/**
 * Action to create a new review
 */
export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  try {
    // Debug: Log the parameters being received
    logger.info(`Review create parameters: ${JSON.stringify(params)}`);
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
    if (!record.rating) record.rating = 5;
    
    // Ensure string fields have defaults
    if (!record.comment) record.comment = "";
    
    logger.info(`Record after setting defaults: ${JSON.stringify(record)}`);
    
    // Validate required fields
    if (!record.rating) {
      throw new Error("Review rating is required");
    }
    if (!record.createdBy) {
      throw new Error("Review creator is required");
    }
    
    logger.info("All validations passed, saving record...");
    
    // Save the record to the database
    await save(record);
    
    logger.info(`Created review with ID: ${record.id}`);
    logger.info(`Review rating: ${record.rating}`);
    
    return {
      result: "ok"
    };
  } catch (error) {
    logger.error(`Error creating review: ${error}`);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
}; 