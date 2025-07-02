import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { sendTestEmail, sendConfirmationEmail, sendRejectionEmail, testBasicFunction } from '../../lib/emailService';
import { useAuth } from '../../lib/auth';

export function EmailTestComponent() {
  const { user, session, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading2, setLoading2] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleBasicTest = async () => {
    if (!user || !session) {
      setResult({ success: false, error: 'You must be signed in to test functions' });
      return;
    }

    setLoading2(true);
    setResult(null);

    try {
      const response = await testBasicFunction();
      setResult(response);
    } catch (error) {
      setResult({ success: false, error: 'Failed to test basic function' });
    } finally {
      setLoading2(false);
    }
  };

  const handleTestEmail = async () => {
    if (!email) {
      setResult({ success: false, error: 'Please enter an email address' });
      return;
    }

    if (!user || !session) {
      setResult({ success: false, error: 'You must be signed in to send emails' });
      return;
    }

    setLoading2(true);
    setResult(null);

    try {
      const response = await sendTestEmail(email, name || undefined);
      setResult(response);
    } catch (error) {
      setResult({ success: false, error: 'Failed to send test email' });
    } finally {
      setLoading2(false);
    }
  };

  const handleConfirmationEmail = async () => {
    if (!email || !name) {
      setResult({ success: false, error: 'Please enter both email and name' });
      return;
    }

    if (!user || !session) {
      setResult({ success: false, error: 'You must be signed in to send emails' });
      return;
    }

    setLoading2(true);
    setResult(null);

    try {
      const response = await sendConfirmationEmail(
        email,
        name,
        'Test Event',
        'Test Venue',
        '2024-12-25',
        150
      );
      setResult(response);
    } catch (error) {
      setResult({ success: false, error: 'Failed to send confirmation email' });
    } finally {
      setLoading2(false);
    }
  };

  const handleRejectionEmail = async () => {
    if (!email || !name) {
      setResult({ success: false, error: 'Please enter both email and name' });
      return;
    }

    if (!user || !session) {
      setResult({ success: false, error: 'You must be signed in to send emails' });
      return;
    }

    setLoading2(true);
    setResult(null);

    try {
      const response = await sendRejectionEmail(
        email,
        name,
        'Test Event',
        'Test Venue',
        '2024-12-25'
      );
      setResult(response);
    } catch (error) {
      setResult({ success: false, error: 'Failed to send rejection email' });
    } finally {
      setLoading2(false);
    }
  };

  // Debug information
  console.log('Auth state:', { user, session, loading });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email System Test</CardTitle>
        <CardDescription>
          Test the email system functionality with different email types
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Debug Information */}
        <div className="p-3 bg-gray-100 rounded text-xs">
          <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
          <div><strong>User:</strong> {user ? user.email : 'None'}</div>
          <div><strong>Session:</strong> {session ? 'Active' : 'None'}</div>
          <div><strong>User ID:</strong> {user?.id || 'None'}</div>
        </div>

        {/* Authentication Status */}
        {loading ? (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              🔄 Loading authentication state...
            </AlertDescription>
          </Alert>
        ) : user && session ? (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              ✅ Authenticated as: {user.email}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              ❌ You must be signed in to send emails
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="recipient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name (Optional)</Label>
          <Input
            id="name"
            type="text"
            placeholder="Recipient Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleBasicTest}
            disabled={loading2 || !user || loading}
            className="w-full"
            variant="secondary"
          >
            {loading2 ? 'Testing...' : 'Test Basic Function'}
          </Button>

          <Button
            onClick={handleTestEmail}
            disabled={loading2 || !email || !user || loading}
            className="w-full"
          >
            {loading2 ? 'Sending...' : 'Send Test Email'}
          </Button>

          <Button
            onClick={handleConfirmationEmail}
            disabled={loading2 || !email || !name || !user || loading}
            variant="outline"
            className="w-full"
          >
            {loading2 ? 'Sending...' : 'Send Confirmation Email'}
          </Button>

          <Button
            onClick={handleRejectionEmail}
            disabled={loading2 || !email || !name || !user || loading}
            variant="outline"
            className="w-full"
          >
            {loading2 ? 'Sending...' : 'Send Rejection Email'}
          </Button>
        </div>

        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription>
              {result.success ? (
                <span className="text-green-800">
                  ✅ {result.message || 'Email sent successfully!'}
                </span>
              ) : (
                <span className="text-red-800">
                  ❌ {result.error || 'Failed to send email'}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 
