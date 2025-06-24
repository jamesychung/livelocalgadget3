import { UpdateMessageActionContext } from "gadget-server";

export const run = async (params: UpdateMessageActionContext) => {
  const { record, scope } = params;
  
  // If marking as read, also mark related notifications as read
  if (record.isRead) {
    const notifications = await scope.api.notification.findMany({
      filter: {
        booking: { equals: record.booking },
        user: { equals: scope.currentUser?.id },
        type: { equals: "new_message" },
        isRead: { equals: false }
      }
    });
    
    for (const notification of notifications) {
      await scope.api.notification.update(notification.id, { isRead: true });
    }
  }
}; 