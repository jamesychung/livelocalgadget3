import { applyParams, save, ActionOptions } from "gadget-server";

// Simple signup - just creates user with signed-in role
// No custom role logic - users get roles when they create profiles

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  logger.info(`Signup parameters: ${JSON.stringify(params)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  record.lastSignedIn = new Date();
  
  // Just set signed-in role - that's it!
  record.roles = ["signed-in"];
  
  await save(record);
  
  // Set session for immediate access
  session?.set("user", { _link: record.id });
  
  return {
    result: "ok"
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, session }) => {
  if (!record.emailVerified) {
    await api.user.sendVerifyEmail({ email: record.email });
  }
  
  logger.info(`User ${record.email} signed up successfully`);
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
  triggers: {
    googleOAuthSignUp: true,
    emailSignUp: true,
  },
};
