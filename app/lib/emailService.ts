import { supabase } from './supabase';

export interface SendEmailParams {
  emailType: 'test' | 'confirmation' | 'rejection';
  recipientEmail: string;
  recipientName?: string;
  eventTitle?: string;
  venueName?: string;
  eventDate?: string;
  proposedRate?: number;
}

export interface SendBookingEmailsParams {
  bookingId: string;
  confirmedMusician: {
    email: string;
    name: string;
    proposedRate: number;
  };
  eventDetails: {
    title: string;
    venueName: string;
    date: string;
  };
  otherApplicants: Array<{
    email: string;
    name: string;
  }>;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: any;
}

/**
 * Send a single email using the Supabase Edge Function
 */
export async function sendEmail(params: SendEmailParams): Promise<EmailResponse> {
  try {
    console.log('Sending email with params:', params);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: params
    });

    console.log('Function response - data:', data);
    console.log('Function response - error:', error);

    if (error) {
      console.error('Error calling send-email function:', error);
      
      // Try to get more detailed error information
      if (error.message) {
        console.error('Error message:', error.message);
      }
      
      if (error.context) {
        console.error('Error context:', error.context);
        
        // Try to extract error details from the response
        if (error.context instanceof Response) {
          try {
            const errorText = await error.context.text();
            console.error('Response error body:', errorText);
            
            // Try to parse as JSON
            try {
              const errorJson = JSON.parse(errorText);
              console.error('Parsed error JSON:', errorJson);
              
              if (errorJson.error) {
                return {
                  success: false,
                  error: errorJson.error
                };
              }
            } catch (parseError) {
              console.error('Could not parse error as JSON:', parseError);
            }
          } catch (textError) {
            console.error('Could not read response text:', textError);
          }
        }
      }
      
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }

    return data as EmailResponse;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Send booking confirmation and rejection emails using the Supabase Edge Function
 */
export async function sendBookingEmails(params: SendBookingEmailsParams): Promise<EmailResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('send-booking-emails', {
      body: params
    });

    if (error) {
      console.error('Error calling send-booking-emails function:', error);
      return {
        success: false,
        error: error.message || 'Failed to send booking emails'
      };
    }

    return data as EmailResponse;
  } catch (error) {
    console.error('Error in sendBookingEmails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Test basic Edge Function connectivity
 */
export async function testBasicFunction(): Promise<EmailResponse> {
  try {
    console.log('Testing basic function connectivity...');
    
    const { data, error } = await supabase.functions.invoke('test-simple', {
      body: {}
    });

    console.log('Basic function response - data:', data);
    console.log('Basic function response - error:', error);

    if (error) {
      console.error('Error calling test-simple function:', error);
      return {
        success: false,
        error: error.message || 'Failed to call test function'
      };
    }

    return data as EmailResponse;
  } catch (error) {
    console.error('Error in testBasicFunction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Send a test email to verify the email system is working
 */
export async function sendTestEmail(recipientEmail: string, recipientName?: string): Promise<EmailResponse> {
  return sendEmail({
    emailType: 'test',
    recipientEmail,
    recipientName
  });
}

/**
 * Send a confirmation email to a musician who has been selected for an event
 */
export async function sendConfirmationEmail(
  recipientEmail: string,
  recipientName: string,
  eventTitle: string,
  venueName: string,
  eventDate: string,
  proposedRate: number
): Promise<EmailResponse> {
  return sendEmail({
    emailType: 'confirmation',
    recipientEmail,
    recipientName,
    eventTitle,
    venueName,
    eventDate,
    proposedRate
  });
}

/**
 * Send a rejection email to a musician who was not selected for an event
 */
export async function sendRejectionEmail(
  recipientEmail: string,
  recipientName: string,
  eventTitle: string,
  venueName: string,
  eventDate: string
): Promise<EmailResponse> {
  return sendEmail({
    emailType: 'rejection',
    recipientEmail,
    recipientName,
    eventTitle,
    venueName,
    eventDate
  });
} 