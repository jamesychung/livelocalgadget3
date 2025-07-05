-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to read messages where they are sender or recipient
CREATE POLICY "Users can read their own messages" ON public.messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = recipient_id
    );

-- Policy for users to insert messages where they are the sender
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
    );

-- Policy for users to update messages where they are sender or recipient (for read status, etc.)
CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (
        auth.uid() = sender_id OR auth.uid() = recipient_id
    );

-- Policy for users to delete messages where they are the sender
CREATE POLICY "Users can delete their sent messages" ON public.messages
    FOR DELETE USING (
        auth.uid() = sender_id
    ); 