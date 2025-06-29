# Testing Guide for Event Progression System

## The Problem

You're getting this error because you're using **mock data** with fake IDs like `"booking-4"`, but Gadget expects real database IDs that are numeric strings (like `"123"`).

```
Variable "$id" got invalid value "booking-4"; Expected type "GadgetID". 
GGT_INVALID_ID: Couldn't convert $[[RichText::booking-4]]$ to a Gadget ID, 
it must be a string containing only digits.
```

## Solution: Use Real Database Data

### Step 1: Create Test Musicians First

Before you can create bookings, you need musicians in the database. You can:

1. **Use the existing seed data** if you have it
2. **Create musicians manually** through the Gadget admin interface
3. **Use the seed functions** in your codebase

### Step 2: Create Test Bookings

I've added a "Test Data" tab to the venue event page that includes:

- **Create Single Test Booking** - Creates one test booking
- **Create Multiple Test Bookings** - Creates several test bookings
- **Refresh Bookings** - Refreshes the data from the database

### Step 3: Test the Status Changes

Once you have real bookings with valid IDs:

1. Go to the "History" tab
2. You'll see real bookings with valid IDs (like `"123"`, `"456"`, etc.)
3. Click "Reject", "Confirm", or "Communicate" buttons
4. The status changes will work because you're using real database IDs

## Quick Setup Steps

### Option 1: Use Existing Seed Data
```bash
# If you have seed functions, run them first
# Check your api/actions/seed/ directory
```

### Option 2: Create Test Data Manually
1. Go to your Gadget admin interface
2. Create a few musicians with basic info
3. Note their IDs (they'll be numeric strings like "1", "2", "3")
4. Update the `musicianId` values in the `createMultipleTestBookings` function

### Option 3: Use the Test Data Tab
1. Navigate to `/venue-event/2` (or any event ID)
2. Click the "Test Data" tab
3. Click "Create Single Test Booking" or "Create Multiple Test Bookings"
4. Check the console for any errors
5. Click "Refresh Bookings" to see the new data

## Expected Behavior

### With Real Data:
- ✅ Booking IDs will be numeric strings like `"123"`
- ✅ Status changes will work properly
- ✅ Event history will be logged
- ✅ Email notifications will be sent
- ✅ No "invalid ID" errors

### With Mock Data:
- ❌ Booking IDs will be fake like `"booking-4"`
- ❌ Status changes will fail with "invalid ID" errors
- ❌ No real database updates
- ❌ No email notifications

## Troubleshooting

### Error: "Musician not found"
- Make sure you have musicians in the database
- Update the `musicianId` values in the test functions
- Check the console for specific error messages

### Error: "Event not found"
- Make sure the event ID in the URL exists
- Create a test event if needed

### No bookings showing up
- Click "Refresh Bookings" to fetch latest data
- Check the console for any fetch errors
- Make sure the event has bookings associated with it

## Database Structure

### Required Models:
1. **Event** - The event being managed
2. **Musician** - Musicians who can apply
3. **Booking** - Applications from musicians to events
4. **EventHistory** - Audit trail (created automatically)

### Required Fields for Testing:
- **Event**: `id`, `title`, `status`
- **Musician**: `id`, `stageName`, `email`
- **Booking**: `id`, `status`, `eventId`, `musicianId`

## Testing Checklist

- [ ] Musicians exist in database
- [ ] Event exists in database
- [ ] Test bookings created successfully
- [ ] Booking IDs are numeric strings
- [ ] Status change buttons work
- [ ] Event history is logged
- [ ] Email notifications sent
- [ ] No "invalid ID" errors

## Next Steps

Once you have real data working:

1. **Test all status transitions**: applied → communicating → confirmed/rejected
2. **Test event history logging**: Check the "Event History" tab
3. **Test email notifications**: Check if emails are sent
4. **Test search and filter**: Use the history viewer features
5. **Test user attribution**: Verify who made what changes

The system is designed to work with real database data and will provide complete audit trails once you have valid IDs! 