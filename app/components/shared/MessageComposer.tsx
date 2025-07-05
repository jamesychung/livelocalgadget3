import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Paperclip, Send, X, FileText, Loader2 } from "lucide-react";

interface MessageComposerProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  messageCategory: string;
  setMessageCategory: (category: string) => void;
  attachments: File[];
  setAttachments: (attachments: File[]) => void;
  onSendMessage: () => void;
  recipientName: string;
  isSending: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxAttachments?: number;
}

export function MessageComposer({
  newMessage,
  setNewMessage,
  messageCategory,
  setMessageCategory,
  attachments,
  setAttachments,
  onSendMessage,
  recipientName,
  isSending,
  disabled = false,
  placeholder,
  maxAttachments = 5
}: MessageComposerProps) {
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).slice(0, maxAttachments - attachments.length);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!newMessage.trim() || isSending || disabled) return;
    onSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-6">
      <div className="space-y-4">
        {/* Category and Recipient Selection */}
        <div className="flex items-center gap-4">
          <Select value={messageCategory} onValueChange={setMessageCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="pricing">Pricing</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="issue">Issue</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>To:</span>
            <span className="font-medium">{recipientName}</span>
          </div>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-400 hover:text-red-500"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Message Input */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Textarea
              placeholder={placeholder || `Type your message to ${recipientName}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[100px] resize-none"
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              disabled={disabled}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={attachments.length >= maxAttachments || disabled}
              title={`Add attachments (${attachments.length}/${maxAttachments})`}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending || disabled}
              className="px-6"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 