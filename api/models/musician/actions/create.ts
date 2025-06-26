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
  
  // Assign the musician role to the user immediately after creating the profile
  if (session?.userId) {
    try {
      logger.info(`Attempting to add musician role to user ${session.userId}`);
      
      // Get current user to see existing roles
      const currentUser = await api.user.findOne(session.userId);
      logger.info(`Current user roles: ${JSON.stringify(currentUser?.roles)}`);
      
      // Add musician role using array approach
      const currentRoles = currentUser?.roles || [];
      const updatedRoles = [...currentRoles, "musician"];
      
      await api.user.update(session.userId, {
        roles: updatedRoles
      });
      
      logger.info(`Successfully added musician role to user ${session.userId}. New roles: ${JSON.stringify(updatedRoles)}`);
    } catch (error) {
      logger.error(`Failed to add musician role: ${error}`);
    }
  }
  
  return {
    result: "ok"
  };
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
}; 