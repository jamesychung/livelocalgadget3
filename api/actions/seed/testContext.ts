export const run = async (params: any, record: any, context: any) => {
  console.log("TestContext action started");
  console.log("Params:", params);
  console.log("Record:", record);
  console.log("Context keys:", context ? Object.keys(context) : "No context");
  console.log("API available:", !!context?.api);
  console.log("Logger available:", !!context?.logger);
  
  return {
    success: true,
    message: "Context test completed",
    contextInfo: {
      hasContext: !!context,
      hasApi: !!context?.api,
      hasLogger: !!context?.logger,
      contextKeys: context ? Object.keys(context) : [],
      apiKeys: context?.api ? Object.keys(context.api) : []
    }
  };
};

export const options = {
  actionType: "custom"
}; 