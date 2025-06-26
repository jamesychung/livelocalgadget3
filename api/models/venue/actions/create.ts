import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  logger.info(`Creating venue with parameters: ${JSON.stringify(params)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  // Set the owner field to the current user's ID
  record.ownerId = session?.userId;
  
  await save(record);
  
  logger.info(`Venue created successfully with ID: ${record.id}`);
  
  return {
    result: "ok"
  };
};

export const onSuccess = async ({ params, record, logger, api, session }) => {
  // Assign the venueOwner role to the user
  if (session?.userId) {
    await api.user.update(session.userId, {
      roles: {
        add: ["venueOwner"]
      }
    });
  }
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
}; 