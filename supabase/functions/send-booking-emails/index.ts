import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConfirmedMusician {
  email: string;
  name: string;
  proposedRate: number;
}

interface EventDetails {
  title: string;
  venueName: string;
  date: string;
}

interface Applicant {
  email: string;
  name: string;
}

interface BookingEmailParams {
  bookingId: string;
  confirmedMusician: ConfirmedMusician;
  eventDetails: EventDetails;
  otherApplicants: Applicant[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingId, confirmedMusician, eventDetails, otherApplicants }: BookingEmailParams = await req.json()

    // Validate required parameters
    if (!bookingId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameter: bookingId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!confirmedMusician || !eventDetails) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters: confirmedMusician or eventDetails' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get environment variables
    const googleEmail = Deno.env.get('GOOGLE_EMAIL_ADDRESS')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!googleEmail || !resendApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email configuration not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    let confirmationSent = false;
    let rejectionsSent = 0;

    // Send confirmation email to selected musician
    if (confirmedMusician && confirmedMusician.email && confirmedMusician.name !== "No Musician Selected") {
      const confirmationEmail = {
        from: googleEmail,
        to: [confirmedMusician.email],
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

      const confirmationResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmationEmail),
      });

      if (confirmationResponse.ok) {
        console.log('Confirmation email sent to:', confirmedMusician.email);
        confirmationSent = true;
      } else {
        console.error('Failed to send confirmation email:', await confirmationResponse.text());
      }
    }

    // Send rejection emails to other applicants
    for (const applicant of otherApplicants) {
      const rejectionEmail = {
        from: googleEmail,
        to: [applicant.email],
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

      const rejectionResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rejectionEmail),
      });

      if (rejectionResponse.ok) {
        console.log('Rejection email sent to:', applicant.email);
        rejectionsSent++;
      } else {
        console.error('Failed to send rejection email to:', applicant.email, await rejectionResponse.text());
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'All emails sent successfully',
        details: {
          confirmationSent,
          rejectionsSent
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-booking-emails function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}) 