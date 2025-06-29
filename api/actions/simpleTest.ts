import { ActionOptions, SimpleTestActionContext } from "gadget-server";

export const run = async (ctx: SimpleTestActionContext) => {
  console.log('=== SIMPLE TEST ACTION ===');
  console.log('Params received:', ctx.params);
  console.log('Param keys:', Object.keys(ctx.params));
  console.log('Message value:', ctx.params.message);
  
  return {
    success: true,
    receivedParams: ctx.params,
    message: `Received: ${ctx.params.message || 'no message'}`
  };
};

export const options = {
  actionType: "custom",
  exposeToApi: true,
  params: {
    message: { type: "string", required: true }
  }
} satisfies ActionOptions; 