# Email Setup Guide for LiveLocal Gadget

## Overview
This guide explains how to set up email notifications for when venues confirm musicians for events.

## Email Service Options

### 1. **SendGrid (Recommended)**
- **Free tier**: 100 emails/day
- **Pros**: Easy setup, good deliverability, simple API
- **Cons**: Limited free tier

### 2. **Mailgun**
- **Free tier**: 5,000 emails/month for 3 months
- **Pros**: Developer-friendly, good pricing
- **Cons**: Requires credit card for verification

### 3. **AWS SES**
- **Free tier**: 62,000 emails/month
- **Pros**: Very cost-effective, high deliverability
- **Cons**: More complex setup

### 4. **Resend**
- **Free tier**: 3,000 emails/month
- **Pros**: Modern API, great developer experience
- **Cons**: Newer service

## Setup Instructions

### Step 1: Install Dependencies
```bash
yarn add @sendgrid/mail
```

### Step 2: Get SendGrid API Key
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Go to Settings → API Keys
3. Create a new API Key with "Mail Send" permissions
4. Copy the API key

### Step 3: Set Environment Variables
Create a `.env` file in your project root:
```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

**Important**: The `FROM_EMAIL` must be a verified sender in SendGrid.

### Step 4: Verify Sender Email
1. In SendGrid dashboard, go to Settings → Sender Authentication
2. Verify your sender email address
3. Or set up domain authentication for better deliverability

### Step 5: Test the Setup
The email service is now integrated into your venue event management page. When a venue confirms a musician:

1. **Confirmation email** is sent to the selected musician
2. **Rejection emails** are sent to all other applicants
3. **Invitation emails** can be sent when inviting musicians

## Email Templates Created

### 1. Confirmation Email
- Subject: "🎉 Congratulations! You've been confirmed for [Event Title]"
- Includes: Event details, venue info, rate, date

### 2. Rejection Email
- Subject: "Update on your application for [Event Title]"
- Professional tone, encourages future applications

### 3. Invitation Email
- Subject: "🎵 You're invited to perform at [Event Title]"
- For when venues invite specific musicians

## How It Works

### Flow:
1. **Venue clicks "Confirm"** on a musician application
2. **System checks** if another musician is already confirmed
3. **If no conflict**: 
   - Updates booking status (in real implementation)
   - Sends confirmation email to selected musician
   - Sends rejection emails to other applicants
4. **If conflict**: Shows error, prevents confirmation

### Code Integration:
- `EmailService` class handles all email operations
- `handleBookMusician` function triggers emails
- Templates are HTML-formatted with inline styles
- Error handling included for failed email sends

## Production Considerations

### 1. **Rate Limiting**
- SendGrid: 100 emails/day (free), 100 emails/second (paid)
- Implement queuing for high-volume scenarios

### 2. **Error Handling**
- Log failed email sends
- Implement retry logic
- Show user feedback for email status

### 3. **Email Deliverability**
- Use verified sender domains
- Monitor bounce rates
- Implement unsubscribe functionality

### 4. **Testing**
- Use SendGrid's test mode
- Test with real email addresses
- Monitor email delivery in SendGrid dashboard

## Alternative: No Email Service (Development)

For development/testing without setting up email:
```typescript
// In emailService.ts, replace the sendEmail method:
static async sendEmail(emailData: EmailData): Promise<boolean> {
  console.log('📧 Email would be sent:', {
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html
  });
  return true;
}
```

This will log email details to console instead of actually sending them.

## Next Steps

1. **Install SendGrid**: `yarn add @sendgrid/mail`
2. **Set up API key** and environment variables
3. **Test the functionality** by confirming a musician
4. **Monitor email delivery** in SendGrid dashboard
5. **Customize email templates** as needed

The email system is now ready to automatically notify musicians when their booking status changes! 