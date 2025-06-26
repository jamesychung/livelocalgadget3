import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

/**
 * @param { CreateMusicianActionContext } context - Everything for running this action, like the apiClient, current session, etc
 */
export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  logger.info(`Creating musician with parameters: ${JSON.stringify(params)}`);
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  // Set the user field to the current user's ID
  record.userId = session?.userId;
  
  await save(record);
  
  logger.info(`Musician created successfully with ID: ${record.id}`);
  
  return {
    result: "ok"
  };
};

export const onSuccess = async ({ params, record, logger, api, session }) => {
  // Assign the musician role to the user
  if (session?.userId) {
    await api.user.update(session.userId, {
      roles: {
        add: ["musician"]
      }
    });
  }
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
}; 