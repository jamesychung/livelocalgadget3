import { ActionOptions, TestActionActionContext } from "gadget-server";

/**
 * Simple test action to verify custom actions work
 */
export const run = async (ctx: TestActionActionContext) => {
  const { message } = ctx.params;

  console.log('Test action called with message:', message);

  return {
    success: true,
    message: `Test action received: ${message}`,
    timestamp: new Date().toISOString()
  };
};

export const options = {
  actionType: "custom",
  exposeToApi: true,
  params: {
    message: { type: "string", required: true }
  }
} satisfies ActionOptions; 