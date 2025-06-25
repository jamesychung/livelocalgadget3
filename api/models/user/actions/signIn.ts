import { applyParams, save, ActionOptions } from "gadget-server";

// Powers the form in the the 'sign in' page

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  applyParams(params, record);
  record.lastSignedIn = new Date();
  
  // Ensure user has the "signed-in" role
  if (!record.roles?.includes("signed-in")) {
    record.roles = [...(record.roles || []), "signed-in"];
  }
  
  await save(record);
  // Assigns the signed-in user to the active session
  session?.set("user", { _link: record.id });
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, session }) => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: {
    googleOAuthSignIn: true,
    emailSignIn: true,
  },
};
