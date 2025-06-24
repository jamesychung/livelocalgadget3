import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

/**
 * Action to update an existing booking
 */
export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  try {
    // Debug: Log the parameters being received
    logger.info(`Booking update parameters: ${JSON.stringify(params)}`);
    logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
    logger.info(`Session user: ${JSON.stringify(session?.user)}`);
    
    // Store the original status before applying params
    const originalStatus = record.status;
    
    // Apply the parameters to the record
    applyParams(params, record);
    
    logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
    
    // Validate required fields
    if (!record.musician) {
      throw new Error("Booking musician is required");
    }
    if (!record.venue) {
      throw new Error("Booking venue is required");
    }
    if (!record.date) {
      throw new Error("Booking date is required");
    }
    
    logger.info("All validations passed, saving record...");
    
    // Save the record to the database
    await save(record);
    
    // Create notification if status changed
    if (originalStatus !== record.status) {
      const statusMessages = {
        "pending": "Your application is under review",
        "accepted": "Your application has been accepted!",
        "rejected": "Your application was not selected",
        "confirmed": "Your booking has been confirmed!",
        "cancelled": "Your booking has been cancelled"
      };
      
      const message = statusMessages[record.status] || `Your booking status changed to ${record.status}`;
      
      // Create notification for musician
      await api.notification.create({
        type: "booking_status_change",
        title: "Booking Status Update",
        content: message,
        user: record.musician.user,
        booking: record.id,
        event: record.event,
        musician: record.musician.id,
        venue: record.venue.id,
        isRead: false,
        isActive: true
      });
    }
    
    logger.info(`Updated booking with ID: ${record.id}`);
    logger.info(`Booking status: ${record.status}, Type: ${record.bookingType}`);
    
    return {
      result: "ok"
    };
  } catch (error) {
    logger.error(`Error updating booking: ${error}`);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
}; 