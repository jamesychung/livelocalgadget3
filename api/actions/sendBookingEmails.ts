import { ActionOptions, SendBookingEmailsActionContext } from "gadget-server";
import * as nodemailer from 'nodemailer';

/**
 * Action to send booking confirmation and rejection emails
 */
export const run = async (ctx: SendBookingEmailsActionContext) => {
  const { bookingId, confirmedMusician, eventDetails, otherApplicants } = ctx.params;

  // Initialize nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GOOGLE_EMAIL_ADDRESS,
      pass: process.env.GOOGLE_APP_PASSWORD_KEY
    }
  });

  try {
    // Send confirmation email to selected musician
    if (confirmedMusician && confirmedMusician.email && confirmedMusician.name !== "No Musician Selected") {
      const confirmationEmail = {
        from: process.env.GOOGLE_EMAIL_ADDRESS,
        to: confirmedMusician.email,
        subject: `🎉 Congratulations! You've been confirmed for ${eventDetails.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">🎉 Booking Confirmed!</h2>
            
            <p>Hi ${confirmedMusician.name},</p>
            
            <p>Thank you for applying to our event on <strong>${eventDetails.date}</strong>.</p>
            
            <p>We are excited to inform you that you have been <strong>selected</strong> to perform at:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${eventDetails.title}</h3>
              <p><strong>Venue:</strong> ${eventDetails.venueName}</p>
              <p><strong>Date:</strong> ${eventDetails.date}</p>
              <p><strong>Rate:</strong> $${confirmedMusician.proposedRate}/hour</p>
            </div>
            
            <p>Please review the event details and contact us if you have any questions.</p>
            
            <p>Best regards,<br>The LiveLocal Team</p>
          </div>
        `
      };

      await transporter.sendMail(confirmationEmail);
      console.log('Confirmation email sent to:', confirmedMusician.email);
    }

    // Send rejection emails to other applicants
    for (const applicant of otherApplicants) {
      const rejectionEmail = {
        from: process.env.GOOGLE_EMAIL_ADDRESS,
        to: applicant.email,
        subject: `Update on your application for ${eventDetails.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Application Update</h2>
            
            <p>Hi ${applicant.name},</p>
            
            <p>Thank you for applying to our event on <strong>${eventDetails.date}</strong>.</p>
            
            <p>We have selected another musician for this event, but we are interested in working with you in the future.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${eventDetails.title}</h3>
              <p><strong>Venue:</strong> ${eventDetails.venueName}</p>
              <p><strong>Date:</strong> ${eventDetails.date}</p>
            </div>
            
            <p>We encourage you to continue applying for other events on our platform. Your talent is valuable to our community!</p>
            
            <p>Best regards,<br>The LiveLocal Team</p>
          </div>
        `
      };

      await transporter.sendMail(rejectionEmail);
      console.log('Rejection email sent to:', applicant.email);
    }

    return {
      success: true,
      message: 'All emails sent successfully',
      details: {
        confirmationSent: confirmedMusician && confirmedMusician.email && confirmedMusician.name !== "No Musician Selected",
        rejectionsSent: otherApplicants.length
      }
    };

  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      success: false,
      error: error.message || 'Failed to send emails'
    };
  }
};

export const options = {
  actionType: "custom",
  exposeToApi: true, // This makes it available to the frontend
  params: {
    bookingId: { type: "string", required: true },
    confirmedMusician: {
      type: "object",
      required: true,
      properties: {
        email: { type: "string", required: true },
        name: { type: "string", required: true },
        proposedRate: { type: "number", required: true }
      }
    },
    eventDetails: {
      type: "object", 
      required: true,
      properties: {
        title: { type: "string", required: true },
        venueName: { type: "string", required: true },
        date: { type: "string", required: true }
      }
    },
    otherApplicants: {
      type: "array",
      required: true,
      items: {
        type: "object",
        properties: {
          email: { type: "string", required: true },
          name: { type: "string", required: true }
        }
      }
    }
  }
} satisfies ActionOptions; 