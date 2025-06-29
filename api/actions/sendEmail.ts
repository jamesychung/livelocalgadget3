import { ActionOptions, SendEmailActionContext } from "gadget-server";
import * as nodemailer from 'nodemailer';

/**
 * Action to send various types of emails
 */
export const run = async (ctx: SendEmailActionContext) => {
  // Debug logging
  console.log('=== SEND EMAIL ACTION DEBUG ===');
  console.log('All params:', ctx.params);
  console.log('Params type:', typeof ctx.params);
  console.log('Params keys:', Object.keys(ctx.params));
  console.log('=== END DEBUG ===');

  // Extract parameters with fallbacks
  const emailType = ctx.params.emailType;
  const recipientEmail = ctx.params.recipientEmail;
  const recipientName = ctx.params.recipientName;
  const eventTitle = ctx.params.eventTitle;
  const venueName = ctx.params.venueName;
  const eventDate = ctx.params.eventDate;
  const proposedRate = ctx.params.proposedRate;

  // Validate required parameters
  if (!emailType) {
    console.error('Missing required parameter: emailType');
    return {
      success: false,
      error: 'Missing required parameter: emailType'
    };
  }

  if (!recipientEmail) {
    console.error('Missing required parameter: recipientEmail');
    return {
      success: false,
      error: 'Missing required parameter: recipientEmail'
    };
  }

  console.log('Validated parameters:');
  console.log('- emailType:', emailType);
  console.log('- recipientEmail:', recipientEmail);
  console.log('- recipientName:', recipientName);
  console.log('- eventTitle:', eventTitle);
  console.log('- venueName:', venueName);
  console.log('- eventDate:', eventDate);
  console.log('- proposedRate:', proposedRate);

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
    let emailContent;

    switch (emailType) {
      case 'test':
        emailContent = {
          from: process.env.GOOGLE_EMAIL_ADDRESS,
          to: recipientEmail,
          subject: '🧪 Test Email from LiveLocal',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">🧪 Test Email</h2>
              
              <p>Hi ${recipientName || 'there'},</p>
              
              <p>This is a test email from the LiveLocal platform to verify that our email system is working correctly.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Email System Status</h3>
                <p><strong>Status:</strong> ✅ Working</p>
                <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>From:</strong> LiveLocal Platform</p>
              </div>
              
              <p>If you received this email, our email notification system is functioning properly!</p>
              
              <p>Best regards,<br>The LiveLocal Team</p>
            </div>
          `
        };
        break;

      case 'confirmation':
        emailContent = {
          from: process.env.GOOGLE_EMAIL_ADDRESS,
          to: recipientEmail,
          subject: `🎉 Congratulations! You've been confirmed for ${eventTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">🎉 Booking Confirmed!</h2>
              
              <p>Hi ${recipientName},</p>
              
              <p>Thank you for applying to our event on <strong>${eventDate}</strong>.</p>
              
              <p>We are excited to inform you that you have been <strong>selected</strong> to perform at:</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${eventTitle}</h3>
                <p><strong>Venue:</strong> ${venueName}</p>
                <p><strong>Date:</strong> ${eventDate}</p>
                <p><strong>Rate:</strong> $${proposedRate}/hour</p>
              </div>
              
              <p>Please review the event details and contact us if you have any questions.</p>
              
              <p>Best regards,<br>The LiveLocal Team</p>
            </div>
          `
        };
        break;

      case 'rejection':
        emailContent = {
          from: process.env.GOOGLE_EMAIL_ADDRESS,
          to: recipientEmail,
          subject: `Update on your application for ${eventTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Application Update</h2>
              
              <p>Hi ${recipientName},</p>
              
              <p>Thank you for applying to our event on <strong>${eventDate}</strong>.</p>
              
              <p>We have selected another musician for this event, but we are interested in working with you in the future.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${eventTitle}</h3>
                <p><strong>Venue:</strong> ${venueName}</p>
                <p><strong>Date:</strong> ${eventDate}</p>
              </div>
              
              <p>We encourage you to continue applying for other events on our platform. Your talent is valuable to our community!</p>
              
              <p>Best regards,<br>The LiveLocal Team</p>
            </div>
          `
        };
        break;

      default:
        throw new Error(`Unknown email type: ${emailType}`);
    }

    await transporter.sendMail(emailContent);
    console.log(`${emailType} email sent to:`, recipientEmail);

    return {
      success: true,
      message: `${emailType} email sent successfully`,
      details: {
        emailType,
        recipientEmail,
        sentAt: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: (error as Error).message || 'Failed to send email'
    };
  }
};

export const options = {
  actionType: "custom",
  exposeToApi: true, // This makes it available to the frontend
  params: {
    emailType: { 
      type: "string", 
      required: true
    },
    recipientEmail: { type: "string", required: true },
    recipientName: { type: "string", required: false },
    eventTitle: { type: "string", required: false },
    venueName: { type: "string", required: false },
    eventDate: { type: "string", required: false },
    proposedRate: { type: "number", required: false }
  }
} satisfies ActionOptions; 