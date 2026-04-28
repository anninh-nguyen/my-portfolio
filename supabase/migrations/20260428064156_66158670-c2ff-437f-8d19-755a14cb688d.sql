CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete messages"
ON public.contact_messages FOR DELETE
TO authenticated
USING (true);