import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Debug: Log the parameters being received
  logger.info(`Venue update parameters: ${JSON.stringify(params)}`);
  logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
  
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
  
  // Save the record to the database
  await save(record);
  
  logger.info(`Updated venue profile with ID: ${record.id}`);
  logger.info(`Venue name: ${record.name}, Type: ${record.type}`);
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
}; 