import { ActionOptions, CreateEventHistoryActionContext } from "gadget-server";

/**
 * Action to create event history entries
 */
export const run = async (ctx: CreateEventHistoryActionContext) => {
  console.log('=== EVENT HISTORY CREATE ACTION ===');
  console.log('Record:', ctx.record);
  console.log('Changes:', ctx.changes);
  console.log('=== END EVENT HISTORY CREATE ===');

  // The history entry is already created, we just need to ensure it's properly formatted
  const historyEntry = ctx.record;
  
  // Log the history entry creation
  console.log(`📝 Event History Entry Created:`, {
    id: historyEntry.id,
    eventId: historyEntry.eventId,
    bookingId: historyEntry.bookingId,
    changeType: historyEntry.changeType,
    description: historyEntry.description,
    timestamp: historyEntry.createdAt
  });

  return historyEntry;
};

export const options = {
  actionType: "create",
  triggers: {
    onSuccess: true
  }
} satisfies ActionOptions; 