import { ActionOptions, CreateBookingActionContext } from "gadget-server";

/**
 * Action to set timestamps when bookings are created
 */
export const run = async (ctx: CreateBookingActionContext) => {
  console.log('=== BOOKING CREATE ACTION DEBUG ===');
  console.log('Record:', ctx.record);
  console.log('=== END DEBUG ===');

  // Set timestamps based on status
  const status = ctx.record.status;
  const now = new Date();
  
  if (status === 'applied') {
    // When a musician applies to an event
    ctx.record.applied_at = now;
    console.log('✅ Set applied_at timestamp:', now);
  } else if (status === 'invited') {
    // When a venue invites a musician
    ctx.record.invited_at = now;
    console.log('✅ Set invited_at timestamp:', now);
  } else if (status === 'selected') {
    // When a venue selects a musician
    ctx.record.selected_at = now;
    console.log('✅ Set selected_at timestamp:', now);
  } else if (status === 'confirmed') {
    // When a booking is confirmed
    ctx.record.confirmed_at = now;
    console.log('✅ Set confirmed_at timestamp:', now);
  }
  
  console.log('🎯 Final record status:', ctx.record.status);
};

export const options = {
  actionType: "create",
  triggers: {
    onSuccess: true
  }
} satisfies ActionOptions; 