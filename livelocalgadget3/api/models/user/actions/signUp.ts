import { applyParams, save, ActionOptions } from "gadget-server";

// Powers the form in the 'sign up' page

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Applies new 'email' and 'password' to the user record and saves to database
  applyParams(params, record);
  record.lastSignedIn = new Date();
  
  // Assign roles based on primaryRole
  const baseRoles = ["signed-in"];
  
  if (record.primaryRole === "musician") {
    record.roles = [...baseRoles, "musician"];
  } else if (record.primaryRole === "venue") {
    record.roles = [...baseRoles, "venueOwner"];
  } else {
    // Default to "user" role
    record.roles = baseRoles;
  }
  
  await save(record);
  
  // Only set session if email is verified (for immediate sign-in)
  if (record.emailVerified) {
    // Assigns the signed-in user to the active session
    session?.set("user", { _link: record.id });
  }
  
  return {
    result: "ok"
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, session }) => {
  if (!record.emailVerified) {
    // Sends verification email by calling api/models/users/actions/sendVerifyEmail.ts
    await api.user.sendVerifyEmail({ email: record.email });
  }
  
  // Log the role assignment
  logger.info(`User ${record.email} signed up with primary role: ${record.primaryRole}`);
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
  triggers: {
    googleOAuthSignUp: true,
    emailSignUp: true,
  },
};
