import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Debug: Log the parameters being received
  logger.info(`Event findFirst parameters: ${JSON.stringify(params)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
  
  return {
    result: "ok"
  };
};

export const options: ActionOptions = {
  actionType: "findFirst",
  returnType: true,
}; 