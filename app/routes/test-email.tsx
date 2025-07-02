import React from 'react';
import { EmailTestComponent } from '../components/shared/EmailTestComponent';

export default function TestEmailPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Email System Test</h1>
        <p className="text-gray-600 mb-8">
          Use this page to test the email system functionality. Make sure you've set up your Resend API key 
          and Google email address in the Supabase environment variables.
        </p>
        
        <EmailTestComponent />
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Testing Instructions:</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Enter a valid email address to receive test emails</li>
            <li>• Try the "Test Email" first to verify basic functionality</li>
            <li>• Use "Confirmation Email" to test booking confirmations</li>
            <li>• Use "Rejection Email" to test application rejections</li>
            <li>• Check your email inbox for the test messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
