CREATE TABLE public.site_owner (user_id uuid PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.site_owner TO service_role;
ALTER TABLE public.site_owner ENABLE ROW LEVEL SECURITY;
INSERT INTO public.site_owner (user_id) SELECT user_id FROM public.profile ORDER BY created_at LIMIT 1;

CREATE OR REPLACE FUNCTION public.is_site_owner(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT _uid IS NOT NULL AND EXISTS (SELECT 1 FROM public.site_owner WHERE user_id = _uid) $$;

DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profile;
CREATE POLICY "Public can view owner profile" ON public.profile FOR SELECT USING (public.is_site_owner(user_id));
CREATE POLICY "Owner inserts profile" ON public.profile FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner updates profile" ON public.profile FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view work experience" ON public.work_experience;
DROP POLICY IF EXISTS "Users can insert own work experience" ON public.work_experience;
DROP POLICY IF EXISTS "Users can update own work experience" ON public.work_experience;
DROP POLICY IF EXISTS "Users can delete own work experience" ON public.work_experience;
CREATE POLICY "Public can view owner work experience" ON public.work_experience FOR SELECT USING (public.is_site_owner(user_id));
CREATE POLICY "Owner inserts work experience" ON public.work_experience FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner updates work experience" ON public.work_experience FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner deletes work experience" ON public.work_experience FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view education" ON public.education;
DROP POLICY IF EXISTS "Users can insert own education" ON public.education;
DROP POLICY IF EXISTS "Users can update own education" ON public.education;
DROP POLICY IF EXISTS "Users can delete own education" ON public.education;
CREATE POLICY "Public can view owner education" ON public.education FOR SELECT USING (public.is_site_owner(user_id));
CREATE POLICY "Owner inserts education" ON public.education FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner updates education" ON public.education FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner deletes education" ON public.education FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view hobbies" ON public.hobbies;
DROP POLICY IF EXISTS "Users can insert own hobbies" ON public.hobbies;
DROP POLICY IF EXISTS "Users can update own hobbies" ON public.hobbies;
DROP POLICY IF EXISTS "Users can delete own hobbies" ON public.hobbies;
CREATE POLICY "Public can view owner hobbies" ON public.hobbies FOR SELECT USING (public.is_site_owner(user_id));
CREATE POLICY "Owner inserts hobbies" ON public.hobbies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner updates hobbies" ON public.hobbies FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner deletes hobbies" ON public.hobbies FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users insert own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users update own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users delete own portfolios" ON public.portfolios;
CREATE POLICY "Public can view owner portfolios" ON public.portfolios FOR SELECT USING (public.is_site_owner(user_id));
CREATE POLICY "Owner inserts portfolios" ON public.portfolios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner updates portfolios" ON public.portfolios FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner deletes portfolios" ON public.portfolios FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Users insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users delete own projects" ON public.projects;
CREATE POLICY "Public can view owner projects" ON public.projects FOR SELECT USING (public.is_site_owner(user_id));
CREATE POLICY "Owner inserts projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner updates projects" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));
CREATE POLICY "Owner deletes projects" ON public.projects FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.is_site_owner(auth.uid()));