import { ActionOptions, UpdateBookingActionContext } from "gadget-server";
import * as nodemailer from 'nodemailer';

/**
 * Action to send emails when bookings are updated and log event history
 */
export const run = async (ctx: UpdateBookingActionContext) => {
  console.log('=== BOOKING UPDATE ACTION DEBUG ===');
  console.log('Record:', ctx.record);
  console.log('Previous record:', ctx.previousRecord);
  console.log('Changes:', ctx.changes);
  console.log('=== END DEBUG ===');

  // Only send emails and log history if the status changed
  if (!ctx.changes.status) {
    console.log('No status change, skipping email and history logging');
    return;
  }

  const newStatus = ctx.changes.status;
  const previousStatus = ctx.previousRecord?.status;
  
  console.log(`Status changed from ${previousStatus} to ${newStatus}`);

  // Log the status change in event history
  try {
    await ctx.api.eventHistory.create({
      event: {
        _link: ctx.record.eventId
      },
      booking: {
        _link: ctx.record.id
      },
      changedBy: {
        _link: ctx.session?.user?.id || 'system'
      },
      changeType: 'booking_status',
      previousValue: previousStatus || 'none',
      newValue: newStatus,
      description: `Booking status changed from "${previousStatus || 'none'}" to "${newStatus}"`,
      context: {
        bookingId: ctx.record.id,
        musicianId: ctx.record.musicianId,
        venueId: ctx.record.venueId,
        eventId: ctx.record.eventId,
        changeReason: 'venue_action'
      },
      metadata: {
        sessionId: ctx.session?.id,
        userAgent: ctx.request?.headers?.['user-agent'],
        ipAddress: ctx.request?.headers?.['x-forwarded-for'] || ctx.request?.headers?.['x-real-ip']
      }
    });

    console.log('✅ Event history entry created for booking status change');
  } catch (error) {
    console.error('❌ Error creating event history entry:', error);
  }

  // Only send emails for confirmation or rejection
  if (newStatus !== 'confirmed' && newStatus !== 'rejected') {
    console.log('Status is not confirmation or rejection, skipping email');
    return;
  }

  try {
    // Get the related data
    const booking = await ctx.api.booking.findOne(ctx.record.id, {
      select: {
        id: true,
        status: true,
        musician: {
          select: {
            id: true,
            stageName: true,
            email: true
          }
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!booking || !booking.musician || !booking.event) {
      console.error('Missing required booking data');
      return;
    }

    // Initialize nodemailer transporter
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_EMAIL_ADDRESS,
        pass: process.env.GOOGLE_APP_PASSWORD_KEY
      }
    });

    let emailContent;

    if (newStatus === 'confirmed') {
      emailContent = {
        from: process.env.GOOGLE_EMAIL_ADDRESS,
        to: booking.musician.email,
        subject: `🎉 Congratulations! You've been confirmed for ${booking.event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">🎉 Booking Confirmed!</h2>
            
            <p>Hi ${booking.musician.stageName},</p>
            
            <p>Thank you for applying to our event on <strong>${booking.event.date}</strong>.</p>
            
            <p>We are excited to inform you that you have been <strong>selected</strong> to perform at:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${booking.event.title}</h3>
              <p><strong>Venue:</strong> ${booking.event.venue?.name}</p>
              <p><strong>Date:</strong> ${booking.event.date}</p>
            </div>
            
            <p>Please review the event details and contact us if you have any questions.</p>
            
            <p>Best regards,<br>The LiveLocal Team</p>
          </div>
        `
      };
    } else if (newStatus === 'rejected') {
      emailContent = {
        from: process.env.GOOGLE_EMAIL_ADDRESS,
        to: booking.musician.email,
        subject: `Update on your application for ${booking.event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Application Update</h2>
            
            <p>Hi ${booking.musician.stageName},</p>
            
            <p>Thank you for applying to our event on <strong>${booking.event.date}</strong>.</p>
            
            <p>We have selected another musician for this event, but we are interested in working with you in the future.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${booking.event.title}</h3>
              <p><strong>Venue:</strong> ${booking.event.venue?.name}</p>
              <p><strong>Date:</strong> ${booking.event.date}</p>
            </div>
            
            <p>We encourage you to continue applying for other events on our platform. Your talent is valuable to our community!</p>
            
            <p>Best regards,<br>The LiveLocal Team</p>
          </div>
        `
      };
    }

    if (emailContent) {
      await transporter.sendMail(emailContent);
      console.log(`${newStatus} email sent to:`, booking.musician.email);
    }

  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const options = {
  actionType: "update",
  triggers: {
    onSuccess: true
  }
} satisfies ActionOptions; 