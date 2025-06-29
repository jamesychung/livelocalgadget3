import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface BookingNotificationData {
  musicianEmail: string;
  musicianName: string;
  venueName: string;
  eventTitle: string;
  eventDate: string;
  status: 'confirmed' | 'rejected' | 'invited';
  proposedRate?: number;
}

export class EmailService {
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const msg = {
        to: emailData.to,
        from: process.env.FROM_EMAIL || 'noreply@livelocalgadget.com', // Replace with your verified sender
        subject: emailData.subject,
        text: emailData.text || '',
        html: emailData.html,
      };

      await sgMail.send(msg);
      console.log('Email sent successfully to:', emailData.to);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  static async sendBookingConfirmation(data: BookingNotificationData): Promise<boolean> {
    const subject = `🎉 Congratulations! You've been confirmed for ${data.eventTitle}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🎉 Booking Confirmed!</h2>
        
        <p>Hi ${data.musicianName},</p>
        
        <p>Great news! Your application has been <strong>confirmed</strong> for the following event:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${data.eventTitle}</h3>
          <p><strong>Venue:</strong> ${data.venueName}</p>
          <p><strong>Date:</strong> ${data.eventDate}</p>
          ${data.proposedRate ? `<p><strong>Rate:</strong> $${data.proposedRate}/hour</p>` : ''}
        </div>
        
        <p>Please review the event details and contact the venue if you have any questions.</p>
        
        <p>Best regards,<br>The LiveLocal Team</p>
      </div>
    `;

    return this.sendEmail({
      to: data.musicianEmail,
      subject,
      html
    });
  }

  static async sendBookingRejection(data: BookingNotificationData): Promise<boolean> {
    const subject = `Update on your application for ${data.eventTitle}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Application Update</h2>
        
        <p>Hi ${data.musicianName},</p>
        
        <p>Thank you for your interest in performing at <strong>${data.eventTitle}</strong>.</p>
        
        <p>After careful consideration, we regret to inform you that another musician has been selected for this event.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${data.eventTitle}</h3>
          <p><strong>Venue:</strong> ${data.venueName}</p>
          <p><strong>Date:</strong> ${data.eventDate}</p>
        </div>
        
        <p>We encourage you to continue applying for other events on our platform. Your talent is valuable to our community!</p>
        
        <p>Best regards,<br>The LiveLocal Team</p>
      </div>
    `;

    return this.sendEmail({
      to: data.musicianEmail,
      subject,
      html
    });
  }

  static async sendBookingInvitation(data: BookingNotificationData): Promise<boolean> {
    const subject = `🎵 You're invited to perform at ${data.eventTitle}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">🎵 Performance Invitation</h2>
        
        <p>Hi ${data.musicianName},</p>
        
        <p>You've been <strong>invited</strong> to perform at the following event:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${data.eventTitle}</h3>
          <p><strong>Venue:</strong> ${data.venueName}</p>
          <p><strong>Date:</strong> ${data.eventDate}</p>
          ${data.proposedRate ? `<p><strong>Proposed Rate:</strong> $${data.proposedRate}/hour</p>` : ''}
        </div>
        
        <p>Please log into your account to review the details and respond to this invitation.</p>
        
        <p>Best regards,<br>The LiveLocal Team</p>
      </div>
    `;

    return this.sendEmail({
      to: data.musicianEmail,
      subject,
      html
    });
  }

  static async notifyAllApplicants(
    confirmedMusician: BookingNotificationData,
    otherApplicants: BookingNotificationData[]
  ): Promise<void> {
    // Send confirmation to the selected musician
    await this.sendBookingConfirmation(confirmedMusician);
    
    // Send rejection emails to other applicants
    const rejectionPromises = otherApplicants.map(applicant => 
      this.sendBookingRejection(applicant)
    );
    
    await Promise.all(rejectionPromises);
  }
} 