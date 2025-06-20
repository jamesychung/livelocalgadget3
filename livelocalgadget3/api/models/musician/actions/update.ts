import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Apply the parameters to the record
  applyParams(params, record);
  
  // Save the record to the database
  await save(record);
  
  logger.info(`Updated musician profile with ID: ${record.id}`);
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
}; 