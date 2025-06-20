import { applyParams, save, ActionOptions } from "gadget-server";

// Powers the form in the 'sign up' page

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Debug: Log the parameters being received
  logger.info(`Signup parameters: ${JSON.stringify(params)}`);
  logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
  
  // Handle primaryRole explicitly since it might not be included in the default parameters
  if (params.primaryRole) {
    record.primaryRole = params.primaryRole;
    logger.info(`Set primaryRole from params: ${params.primaryRole}`);
  }
  
  // Applies new 'email' and 'password' to the user record and saves to database
  applyParams(params, record);
  
  logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
  logger.info(`Primary role from record: ${record.primaryRole}`);
  
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
  
  // Always set session for immediate access to dashboard
  // Users can still verify their email later
  session?.set("user", { _link: record.id });
  
  return {
    result: "ok"
  }
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, session }) => {
  if (!record.emailVerified) {
    // Sends verification email by calling api/models/users/actions/sendVerifyEmail.ts
    await api.user.sendVerifyEmail({ email: record.email });
  }
  
  // Create role-specific profile records
  if (record.primaryRole === "musician") {
    try {
      await api.musician.create({
        user: record.id,
        name: `${record.firstName} ${record.lastName}`,
        isActive: true,
        isVerified: false,
        rating: 0,
        totalGigs: 0,
      });
      logger.info(`Created musician profile for user ${record.email}`);
    } catch (error) {
      logger.error(`Failed to create musician profile for user ${record.email}: ${error}`);
    }
  } else if (record.primaryRole === "venue") {
    try {
      await api.venue.create({
        user: record.id,
        name: `${record.firstName} ${record.lastName}`,
        isActive: true,
        isVerified: false,
        rating: 0,
        totalEvents: 0,
      });
      logger.info(`Created venue profile for user ${record.email}`);
    } catch (error) {
      logger.error(`Failed to create venue profile for user ${record.email}: ${error}`);
    }
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
