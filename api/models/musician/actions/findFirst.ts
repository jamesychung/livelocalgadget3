import { findFirst, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, logger, api, session }) => {
  // Find the first record matching the filter
  const result = await findFirst(params);
  
  logger.info(`Found musician profile: ${result ? result.id : 'none'}`);
  
  return result;
};

export const options: ActionOptions = {
  actionType: "findFirst",
  returnType: true,
}; 