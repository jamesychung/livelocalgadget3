import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Debug: Log the parameters being received
  logger.info(`Event update parameters: ${JSON.stringify(params)}`);
  logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
  
  // Ensure available tickets doesn't exceed total capacity
  if (record.totalCapacity && record.availableTickets > record.totalCapacity) {
    record.availableTickets = record.totalCapacity;
  }
  
  // Ensure numeric fields are valid
  if (record.ticketPrice && record.ticketPrice < 0) {
    record.ticketPrice = 0;
  }
  if (record.totalCapacity && record.totalCapacity < 0) {
    record.totalCapacity = 0;
  }
  if (record.availableTickets && record.availableTickets < 0) {
    record.availableTickets = 0;
  }
  
  logger.info(`Record after validation: ${JSON.stringify(record)}`);
  
  // Save the record to the database
  await save(record);
  
  logger.info(`Updated event with ID: ${record.id}`);
  logger.info(`Event title: ${record.title}, Status: ${record.status}`);
  
  return {
    result: "ok"
  };
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
}; 