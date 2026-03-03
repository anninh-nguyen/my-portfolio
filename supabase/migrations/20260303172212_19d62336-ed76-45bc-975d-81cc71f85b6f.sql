
-- Profile table (single row per user)
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  github_url TEXT NOT NULL DEFAULT '',
  website_url TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profile FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profile FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Work experience table
CREATE TABLE public.work_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view work experience" ON public.work_experience FOR SELECT USING (true);
CREATE POLICY "Users can insert own work experience" ON public.work_experience FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own work experience" ON public.work_experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own work experience" ON public.work_experience FOR DELETE USING (auth.uid() = user_id);

-- Education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  degree TEXT NOT NULL DEFAULT '',
  institution TEXT NOT NULL DEFAULT '',
  field TEXT NOT NULL DEFAULT '',
  graduation_year INT,
  is_certificate BOOLEAN NOT NULL DEFAULT false,
  issuer TEXT NOT NULL DEFAULT '',
  issue_date DATE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Users can insert own education" ON public.education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own education" ON public.education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own education" ON public.education FOR DELETE USING (auth.uid() = user_id);

-- Hobbies table
CREATE TABLE public.hobbies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hobbies" ON public.hobbies FOR SELECT USING (true);
CREATE POLICY "Users can insert own hobbies" ON public.hobbies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own hobbies" ON public.hobbies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own hobbies" ON public.hobbies FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_work_experience_updated_at BEFORE UPDATE ON public.work_experience FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hobbies_updated_at BEFORE UPDATE ON public.hobbies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
