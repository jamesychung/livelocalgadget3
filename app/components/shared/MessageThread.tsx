import React from "react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { MessageCircle, DollarSign, Music, FileText, X, Image, Download } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender_role: 'venue' | 'musician';
  message_category: string;
  sent_date_time: string;
  attachments?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

interface MessageThreadProps {
  messages: Message[];
  currentUserRole: 'venue' | 'musician';
  recipientName: string;
  className?: string;
  emptyStateMessage?: string;
}

export function MessageThread({
  messages,
  currentUserRole,
  recipientName,
  className = "",
  emptyStateMessage = "No messages yet. Start the conversation!"
}: MessageThreadProps) {

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      case 'performance': return <Music className="h-4 w-4" />;
      case 'technical': return <FileText className="h-4 w-4" />;
      case 'contract': return <FileText className="h-4 w-4" />;
      case 'issue': return <X className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Message Thread Header */}
      <div className="border-b border-gray-200 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Messages</h3>
            <p className="text-sm text-gray-600">
              with {recipientName}
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{emptyStateMessage}</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.sender_role === currentUserRole;
              
              return (
                <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${
                    isCurrentUser
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  } rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(message.message_category)}
                      <span className="text-xs font-medium opacity-75">
                        {message.message_category}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-black/10 rounded">
                            {attachment.type === 'image' ? (
                              <Image className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            <span className="text-xs">{attachment.name}</span>
                            <span className="text-xs opacity-75">({formatFileSize(attachment.size)})</span>
                            <Download className="h-3 w-3 ml-auto cursor-pointer" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-75 mt-2">
                      {format(new Date(message.sent_date_time), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 