import { applyParams, save, ActionOptions } from "gadget-server";

export const run = async ({ params, record, logger, api, session }) => {
  logger.info(`Updating user with parameters: ${JSON.stringify(params)}`);
  
  applyParams(params, record);
  
  await save(record);
  
  logger.info(`User updated successfully`);
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
};
