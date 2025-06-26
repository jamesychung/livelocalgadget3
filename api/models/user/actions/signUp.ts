import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

// Simple signup - just creates user with signed-in role
// No custom role logic - users get roles when they create profiles

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  logger.info(`Signing up user with parameters: ${JSON.stringify(params)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  // Set default roles for new users
  record.roles = ["signed-in"];
  
  await save(record);
  
  logger.info(`User signed up successfully with ID: ${record.id}`);
  
  return {
    result: "ok"
  };
};

export const onSuccess = async ({ params, record, logger, api, session }) => {
  // Send email verification if not already verified
  if (!record.emailVerified) {
    try {
      await api.user.sendVerifyEmail({ email: record.email });
      logger.info(`Verification email sent to ${record.email}`);
    } catch (error) {
      logger.error(`Failed to send verification email: ${error}`);
    }
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
