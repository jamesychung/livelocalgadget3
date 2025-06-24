import { UpdateNotificationActionContext } from "gadget-server";

export const run = async (params: UpdateNotificationActionContext) => {
  const { record, scope } = params;
  
  // If marking as read, also mark related messages as read
  if (record.isRead && record.booking) {
    const messages = await scope.api.message.findMany({
      filter: {
        booking: { equals: record.booking },
        recipient: { equals: record.user },
        isRead: { equals: false }
      }
    });
    
    for (const message of messages) {
      await scope.api.message.update(message.id, { isRead: true });
    }
  }
}; 