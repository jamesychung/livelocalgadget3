import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

/**
 * Action to update an existing review
 */
export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  try {
    // Debug: Log the parameters being received
    logger.info(`Review update parameters: ${JSON.stringify(params)}`);
    logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
    logger.info(`Session user: ${JSON.stringify(session?.user)}`);
    
    // Apply the parameters to the record
    applyParams(params, record);
    
    logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
    
    // Validate required fields
    if (!record.rating) {
      throw new Error("Review rating is required");
    }
    
    logger.info("All validations passed, saving record...");
    
    // Save the record to the database
    await save(record);
    
    logger.info(`Updated review with ID: ${record.id}`);
    logger.info(`Review rating: ${record.rating}`);
    
    return {
      result: "ok"
    };
  } catch (error) {
    logger.error(`Error updating review: ${error}`);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
}; 