-- Create message category enum
CREATE TYPE message_category AS ENUM ('general', 'pricing', 'performance', 'technical', 'contract', 'issue', 'other');

-- Create user role enum for messages (if not exists)
DO $$ BEGIN
    CREATE TYPE message_user_role AS ENUM ('musician', 'venue', 'fan', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    sender_role message_user_role NOT NULL,
    recipient_role message_user_role NOT NULL,
    message_category message_category DEFAULT 'general',
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    thread_id UUID DEFAULT uuid_generate_v4(),
    read_status BOOLEAN DEFAULT FALSE,
    sent_date_time TIMESTAMPTZ DEFAULT NOW(),
    email_notification_sent_date_time TIMESTAMPTZ,
    respond_date_time TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_messages_event_id ON public.messages(event_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX idx_messages_sent_date_time ON public.messages(sent_date_time);
CREATE INDEX idx_messages_read_status ON public.messages(read_status);
CREATE INDEX idx_messages_event_sender ON public.messages(event_id, sender_id);
CREATE INDEX idx_messages_event_recipient ON public.messages(event_id, recipient_id);

-- Create updated_at trigger for messages
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set respond_date_time when read_status changes to true
CREATE OR REPLACE FUNCTION public.message_read_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Set respond_date_time when message is marked as read
  IF NEW.read_status = TRUE AND (OLD.read_status IS NULL OR OLD.read_status = FALSE) THEN
    NEW.respond_date_time := CURRENT_TIMESTAMP;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for read status changes
CREATE TRIGGER message_read_status_trigger
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.message_read_status_change();

-- Add comments for documentation
COMMENT ON TABLE public.messages IS 'Event-centric messaging system for venue-musician communication';
COMMENT ON COLUMN public.messages.event_id IS 'Required reference to the event this message relates to';
COMMENT ON COLUMN public.messages.thread_id IS 'Groups related messages together for conversation threading';
COMMENT ON COLUMN public.messages.message_category IS 'Categorizes the type of message for better organization';
COMMENT ON COLUMN public.messages.attachments IS 'JSON array of file URLs and metadata';
COMMENT ON COLUMN public.messages.sender_role IS 'Role of the user sending the message';
COMMENT ON COLUMN public.messages.recipient_role IS 'Role of the user receiving the message';
COMMENT ON COLUMN public.messages.email_notification_sent_date_time IS 'Timestamp when email notification was sent';
COMMENT ON COLUMN public.messages.respond_date_time IS 'Automatically set when message is marked as read'; 