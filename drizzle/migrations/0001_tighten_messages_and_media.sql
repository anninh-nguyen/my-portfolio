CREATE OR REPLACE FUNCTION public.is_site_owner(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profile WHERE user_id = _uid)
$$;
DROP POLICY "Authenticated users can delete messages" ON public.contact_messages;
DROP POLICY "Authenticated users can view messages" ON public.contact_messages;
DROP POLICY "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Owner can view messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_site_owner(auth.uid()));
CREATE POLICY "Owner can delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_site_owner(auth.uid()));
CREATE POLICY "Anyone can submit a valid contact message" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (length(trim(name)) BETWEEN 1 AND 100 AND length(trim(email)) BETWEEN 3 AND 255 AND email LIKE '%@%' AND length(trim(message)) BETWEEN 1 AND 2000);
DROP POLICY "Public read portfolio-media" ON storage.objects;
CREATE POLICY "Users read own media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio-media' AND (storage.foldername(name))[1] = (select auth.uid()::text));