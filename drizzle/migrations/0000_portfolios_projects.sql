CREATE TABLE public.portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolios TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolios TO authenticated;
GRANT ALL ON public.portfolios TO service_role;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view portfolios" ON public.portfolios FOR SELECT USING (true);
CREATE POLICY "Users insert own portfolios" ON public.portfolios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own portfolios" ON public.portfolios FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own portfolios" ON public.portfolios FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  portfolio_id uuid REFERENCES public.portfolios(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  client_location text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  technologies text NOT NULL DEFAULT '',
  achievements text NOT NULL DEFAULT '',
  completed_date date,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Users insert own projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own projects" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own projects" ON public.projects FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Public read portfolio-media" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
CREATE POLICY "Users upload own media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-media' AND (storage.foldername(name))[1] = auth.uid()::text);