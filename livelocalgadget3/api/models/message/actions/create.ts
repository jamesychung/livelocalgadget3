import { CreateMessageActionContext } from "gadget-server";

export const run = async (params: CreateMessageActionContext) => {
  const { record, scope } = params;
  
  console.log("=== MESSAGE CREATION ACTION START ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Record received:", record);
  console.log("Current user:", scope.currentUser?.id);
  console.log("Scope:", scope);
  
  try {
    // Set sender to current user (required field)
    record.sender = scope.currentUser?.id;
    
    console.log("=== MESSAGE CREATION ACTION SUCCESS ===");
    console.log("Final record:", record);
    console.log("Sender set to:", record.sender);
  } catch (error) {
    console.error("=== MESSAGE CREATION ACTION ERROR ===");
    console.error("Error in action:", error);
    throw error;
  }
};

export const options = {
  actionType: "create",
  returnType: true,
}; 