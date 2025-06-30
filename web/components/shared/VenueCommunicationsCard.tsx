import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface VenueCommunicationsCardProps {
  messages?: any[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

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
                    {new Date(message.createdAt).toLocaleString()}
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