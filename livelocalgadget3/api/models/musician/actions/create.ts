import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Debug: Log the parameters being received
  logger.info(`Musician create parameters: ${JSON.stringify(params)}`);
  logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
  logger.info(`Session user: ${JSON.stringify(session?.user)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
  
  // Set default values for required fields if not provided
  if (!record.isActive) record.isActive = true;
  if (!record.isVerified) record.isVerified = false;
  if (!record.rating) record.rating = 0;
  if (!record.totalGigs) record.totalGigs = 0;
  if (!record.yearsExperience) record.yearsExperience = 0;
  if (!record.hourlyRate) record.hourlyRate = 0;
  
  // Ensure arrays are properly formatted
  if (!record.genres || !Array.isArray(record.genres)) {
    record.genres = [];
  }
  if (!record.instruments || !Array.isArray(record.instruments)) {
    record.instruments = [];
  }
  if (!record.socialLinks || !Array.isArray(record.socialLinks)) {
    record.socialLinks = [];
  }
  if (!record.availability || typeof record.availability !== 'object') {
    record.availability = {};
  }
  
  // Ensure string fields have defaults
  if (!record.bio) record.bio = "";
  if (!record.experience) record.experience = "";
  if (!record.genre) record.genre = "";
  if (!record.stageName) record.stageName = "";
  if (!record.city) record.city = "";
  if (!record.state) record.state = "";
  if (!record.country) record.country = "";
  if (!record.phone) record.phone = "";
  if (!record.location) record.location = "";
  
  // Build location string if not provided
  if (!record.location && record.city && record.state && record.country) {
    record.location = `${record.city}, ${record.state}, ${record.country}`;
  }
  
  // Ensure name is set
  if (!record.name) {
    record.name = record.stageName || "Unnamed Musician";
  }
  
  logger.info(`Record after setting defaults: ${JSON.stringify(record)}`);
  
  // Save the record to the database
  await save(record);
  
  logger.info(`Created musician profile with ID: ${record.id}`);
  logger.info(`Musician name: ${record.name}, Stage name: ${record.stageName}`);
  
  return {
    result: "ok"
  };
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
}; 