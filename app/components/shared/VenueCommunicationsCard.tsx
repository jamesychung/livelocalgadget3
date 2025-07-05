import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";

interface VenueCommunicationsCardProps {
  messages?: any[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

// Helper function to properly parse UTC timestamps from database
const parseUTCTimestamp = (timestamp: string | Date): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If the timestamp doesn't end with 'Z', it's likely a UTC timestamp without the timezone indicator
  // Add 'Z' to ensure it's parsed as UTC
  const timestampString = timestamp.toString();
  if (timestampString && !timestampString.endsWith('Z') && !timestampString.includes('+') && !timestampString.includes('-', 10)) {
    return new Date(timestampString + 'Z');
  }
  
  return new Date(timestamp);
};

export const VenueCommunicationsCard: React.FC<VenueCommunicationsCardProps> = ({
  messages = [],
  newMessage,
  setNewMessage,
  handleSendMessage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Musician Communications</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage communications with the booked musician
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages Display */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'venue' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'venue'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">{message.senderName}</div>
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {parseUTCTimestamp(message.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'America/Los_Angeles'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              rows={3}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
