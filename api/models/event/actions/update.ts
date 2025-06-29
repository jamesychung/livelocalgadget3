import { applyParams, save, ActionOptions, ActionRun, UpdateEventActionContext } from "gadget-server";

/**
 * Action to log event history when events are updated
 */
export const run = async (ctx: UpdateEventActionContext) => {
  console.log('=== EVENT UPDATE ACTION DEBUG ===');
  console.log('Record:', ctx.record);
  console.log('Previous record:', ctx.previousRecord);
  console.log('Changes:', ctx.changes);
  console.log('=== END DEBUG ===');

  // Log all changes to event history
  const changes = ctx.changes;
  const previousRecord = ctx.previousRecord;
  
  for (const [field, newValue] of Object.entries(changes)) {
    if (field === 'updatedAt' || field === 'id') continue; // Skip system fields
    
    const previousValue = previousRecord?.[field];
    
    // Only log if the value actually changed
    if (previousValue !== newValue) {
      try {
        await ctx.api.eventHistory.create({
          event: {
            _link: ctx.record.id
          },
          changedBy: {
            _link: ctx.session?.user?.id || 'system'
          },
          changeType: `event_${field}`,
          previousValue: previousValue ? String(previousValue) : 'none',
          newValue: newValue ? String(newValue) : 'none',
          description: `Event ${field} changed from "${previousValue || 'none'}" to "${newValue || 'none'}"`,
          context: {
            eventId: ctx.record.id,
            venueId: ctx.record.venueId,
            changeReason: 'venue_edit'
          },
          metadata: {
            sessionId: ctx.session?.id,
            userAgent: ctx.request?.headers?.['user-agent'],
            ipAddress: ctx.request?.headers?.['x-forwarded-for'] || ctx.request?.headers?.['x-real-ip']
          }
        });

        console.log(`✅ Event history entry created for ${field} change`);
      } catch (error) {
        console.error(`❌ Error creating event history entry for ${field}:`, error);
      }
    }
  }
};

export const options = {
  actionType: "update",
  triggers: {
    onSuccess: true
  }
} satisfies ActionOptions; 