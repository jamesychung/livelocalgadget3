-- Enable real-time for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Grant necessary permissions for real-time
GRANT SELECT ON public.messages TO anon;
GRANT SELECT ON public.messages TO authenticated; 