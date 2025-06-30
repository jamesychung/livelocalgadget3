import { applyParams, save, ActionOptions, ActionRun, createGadgetRecord } from "gadget-server";

/**
 * Action to log event history when events are updated
 */
export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Debug: Log the parameters being received
  logger.info(`=== EVENT UPDATE ACTION START ===`);
  logger.info(`Event ID: ${record.id}`);
  logger.info(`Event update parameters: ${JSON.stringify(params)}`);
  logger.info(`Record before applyParams: ${JSON.stringify(record)}`);
  
  // Store the previous values for history logging
  const previousValues = {
    title: record.title,
    description: record.description,
    date: record.date,
    startTime: record.startTime,
    endTime: record.endTime,
    status: record.status,
    ticketPrice: record.ticketPrice,
    totalCapacity: record.totalCapacity
  };
  
  // Apply the parameters to the record
  applyParams(params, record);
  
  logger.info(`Record after applyParams: ${JSON.stringify(record)}`);
  logger.info(`About to save record with ID: ${record.id}`);
  
  try {
    // Save the record to the database
    await save(record);
    
    logger.info(`✅ Save operation completed successfully`);
    logger.info(`Updated event with ID: ${record.id}`);
    logger.info(`Event title: ${record.title}, Date: ${record.date}`);
    logger.info(`Event status: ${record.status}, Start time: ${record.startTime}`);
    
    // TEST: Check if we reach this point
    logger.info(`🔍 TEST: About to start event history creation logic`);
    
    // Create event history entries for changed fields
    const changes = params.event || params;
    logger.info(`Changes detected: ${JSON.stringify(changes)}`);
    logger.info(`Previous values: ${JSON.stringify(previousValues)}`);
    
    for (const [field, newValue] of Object.entries(changes)) {
      if (field === 'updatedAt' || field === 'id') continue; // Skip system fields
      
      const previousValue = previousValues[field];
      logger.info(`Checking field ${field}: previous=${previousValue}, new=${newValue}`);
      
      // Only log if the value actually changed
      if (previousValue !== newValue) {
        logger.info(`📝 Field ${field} changed from "${previousValue}" to "${newValue}"`);
        try {
          logger.info(`📝 Creating history entry for ${field} change`);
          
          // Create a new event history record using createGadgetRecord
          const historyRecord = createGadgetRecord("eventHistory", {
            event: { _link: record.id },
            changedBy: { _link: session?.user?.id || "28" },
            changeType: `event_${field}`,
            previousValue: String(previousValue || ""),
            newValue: String(newValue || ""),
            description: `Event ${field} updated from "${previousValue}" to "${newValue}"`
          });
          
          logger.info(`📝 Creating history record with eventId: ${record.id} (type: ${typeof record.id})`);
          logger.info(`Created history record: ${JSON.stringify(historyRecord)}`);
          
          // Save the history record
          await save(historyRecord);
          
          logger.info(`✅ Event history entry created for ${field} change: ${historyRecord.id}`);
          logger.info(`✅ Saved history record eventId: ${historyRecord.eventId}`);
        } catch (error) {
          logger.error(`❌ Error creating event history entry for ${field}: ${error}`);
          logger.error(`Error details: ${JSON.stringify(error)}`);
          // Don't throw the error - let the update continue
        }
      } else {
        logger.info(`Field ${field} unchanged: ${previousValue}`);
      }
    }
    
    // Verify the record was actually saved by fetching it again
    const savedEvent = await api.event.findOne(record.id);
    logger.info(`Verification - fetched saved event: ${JSON.stringify(savedEvent)}`);
    
    // Return the updated record
    return record;
    
  } catch (error) {
    logger.error(`❌ Error saving event: ${error}`);
    logger.error(`Error details: ${JSON.stringify(error)}`);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "update",
  returnType: true,
};