import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

// Powers the form in the the 'sign in' page

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  logger.info(`Signing in user with parameters: ${JSON.stringify(params)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  // Update last signed in time
  record.lastSignedIn = new Date();
  
  // Ensure user has the "signed-in" role
  if (!record.roles?.includes("signed-in")) {
    record.roles = [...(record.roles || []), "signed-in"];
  }
  
  await save(record);
  
  // Assigns the signed-in user to the active session
  session?.set("user", { _link: record.id });
  
  logger.info(`User signed in successfully with ID: ${record.id}`);
  
  return {
    result: "ok"
  };
};

export const onSuccess = async ({ params, record, logger, api, session }) => {
  logger.info(`User ${record.email} signed in successfully`);
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: {
    googleOAuthSignIn: true,
    emailSignIn: true,
  },
};
