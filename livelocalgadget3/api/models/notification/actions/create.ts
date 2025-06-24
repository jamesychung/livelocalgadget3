import { CreateNotificationActionContext } from "gadget-server";

export const run = async (params: CreateNotificationActionContext) => {
  const { record, scope } = params;
  
  // Validate required fields
  if (!record.type || !record.user) {
    throw new Error("Notification type and user are required");
  }
  
  // Set default values
  if (!record.isRead) {
    record.isRead = false;
  }
  
  if (!record.isActive) {
    record.isActive = true;
  }
}; 