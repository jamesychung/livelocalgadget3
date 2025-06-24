import { applyParams, save, ActionOptions, ActionRun } from "gadget-server";

/**
 * Action to create a new booking
 */
export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  try {
    // Debug: Log the parameters being received
    logger.info(`Booking create parameters: ${JSON.stringify(params)}`);
    logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
    logger.info(`Session user: ${JSON.stringify(session?.user)}`);
    
    // Apply the parameters to the record
    applyParams(params, record);
    
    logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
    
    // Set the bookedBy from the session user if not already set
    if (session?.user && !record.bookedBy) {
      record.bookedBy = { connect: { id: session.user.id } };
      logger.info(`Set bookedBy to user ID: ${session.user.id}`);
    }
    
    // Set default values for required fields if not provided
    if (!record.isActive) record.isActive = true;
    if (!record.status) record.status = "interest_expressed";
    if (!record.bookingType) record.bookingType = "interest_expression";
    
    // Ensure string fields have defaults
    if (!record.musicianPitch) record.musicianPitch = "";
    if (!record.notes) record.notes = "";
    if (!record.specialRequirements) record.specialRequirements = "";
    
    // Ensure equipment field has default
    if (!record.equipmentProvided) record.equipmentProvided = [];
    
    // Ensure numeric fields have defaults
    if (!record.proposedRate) record.proposedRate = 0;
    if (!record.totalAmount) record.totalAmount = 0;
    if (!record.depositAmount) record.depositAmount = 0;
    
    // Ensure boolean fields have defaults
    if (!record.depositPaid) record.depositPaid = false;
    if (!record.fullPaymentPaid) record.fullPaymentPaid = false;
    
    logger.info(`Record after setting defaults: ${JSON.stringify(record)}`);
    
    // Validate required fields
    if (!record.musician) {
      throw new Error("Booking musician is required");
    }
    if (!record.venue) {
      throw new Error("Booking venue is required");
    }
    if (!record.event) {
      throw new Error("Booking event is required");
    }
    if (!record.date) {
      throw new Error("Booking date is required");
    }
    if (!record.bookedBy) {
      throw new Error("Booking creator is required");
    }
    
    logger.info("All validations passed, saving record...");
    logger.info(`Booking event: ${record.event}, Musician: ${record.musician}, Venue: ${record.venue}`);
    
    // Save the record to the database
    await save(record);
    
    // Create notification for venue about new application
    await api.notification.create({
      type: "new_application",
      title: "New Musician Application",
      content: `A musician has applied for your event`,
      user: record.venue.owner,
      booking: record.id,
      event: record.event,
      musician: record.musician.id,
      venue: record.venue.id,
      isRead: false,
      isActive: true
    });
    
    logger.info(`Created booking with ID: ${record.id}`);
    logger.info(`Booking status: ${record.status}, Type: ${record.bookingType}`);
    logger.info(`Booking event: ${record.event}, Musician: ${record.musician}, Venue: ${record.venue}`);
    
    return {
      result: "ok"
    };
  } catch (error) {
    logger.error(`Error creating booking: ${error}`);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
}; 