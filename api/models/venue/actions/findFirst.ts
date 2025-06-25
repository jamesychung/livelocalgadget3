import { findFirst, ActionOptions, ActionRun } from "gadget-server";

export const run: ActionRun = async ({ params, logger, api, session }) => {
  // Find the first record matching the filter
  const result = await findFirst(params);
  
  logger.info(`Found venue profile: ${result ? result.id : 'none'}`);
  
  return result;
};

export const options: ActionOptions = {
  actionType: "findFirst",
  returnType: true,
}; 