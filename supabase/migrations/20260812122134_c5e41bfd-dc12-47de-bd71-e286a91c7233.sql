
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.insurance_product AS ENUM ('auto', 'green_card', 'travel', 'sport');
CREATE TYPE public.lead_status AS ENUM ('new', 'in_progress', 'issued', 'rejected');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- tariffs
CREATE TABLE public.tariffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product public.insurance_product NOT NULL,
  company text NOT NULL,
  base_price numeric(10,2) NOT NULL CHECK (base_price >= 0),
  coefficients jsonb NOT NULL DEFAULT '{}'::jsonb,
  per_day boolean NOT NULL DEFAULT false,
  note text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tariffs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tariffs TO authenticated;
GRANT ALL ON public.tariffs TO service_role;
ALTER TABLE public.tariffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active tariffs" ON public.tariffs
  FOR SELECT TO anon, authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage tariffs" ON public.tariffs
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tariffs_updated_at BEFORE UPDATE ON public.tariffs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  product public.insurance_product,
  params jsonb NOT NULL DEFAULT '{}'::jsonb,
  company text,
  price numeric(10,2),
  message text,
  status public.lead_status NOT NULL DEFAULT 'new',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON public.leads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- site settings
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  phone_primary text NOT NULL DEFAULT '',
  phone_secondary text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  telegram_url text NOT NULL DEFAULT '',
  viber_url text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  working_hours text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id, phone_primary, phone_secondary, email, telegram_url, viber_url, facebook_url, instagram_url, address, working_hours)
VALUES (1, '+38 (097) 252-05-51', '+38 (066) 468-81-51', 'info@strahovki.example',
        'https://t.me/strahovki_support', 'viber://add?number=380664688151',
        'https://www.facebook.com/', 'https://www.instagram.com/',
        'м. Харків, Україна', 'Щодня 08:00–21:00');

-- seed tariffs
INSERT INTO public.tariffs (product, company, base_price, per_day, sort_order, coefficients) VALUES
('auto', 'ІНГО Україна', 1450, false, 1, '{"region":{"kyiv":1.8,"kharkiv":1.25,"lviv":1.2,"odesa":1.3,"dnipro":1.25,"other":1.0},"vehicle":{"car_small":0.9,"car_medium":1.0,"car_large":1.15,"truck":1.4,"bus":1.6,"moto":0.6},"driver":{"experienced":1.0,"young":1.45,"unlimited":1.2},"term":{"1":0.2,"6":0.65,"12":1.0}}'),
('auto', 'УНІКА', 1390, false, 2, '{"region":{"kyiv":1.75,"kharkiv":1.2,"lviv":1.18,"odesa":1.28,"dnipro":1.22,"other":1.0},"vehicle":{"car_small":0.92,"car_medium":1.0,"car_large":1.18,"truck":1.45,"bus":1.65,"moto":0.62},"driver":{"experienced":1.0,"young":1.5,"unlimited":1.22},"term":{"1":0.22,"6":0.66,"12":1.0}}'),
('auto', 'АХА Страхування', 1520, false, 3, '{"region":{"kyiv":1.7,"kharkiv":1.22,"lviv":1.2,"odesa":1.25,"dnipro":1.2,"other":1.0},"vehicle":{"car_small":0.88,"car_medium":1.0,"car_large":1.12,"truck":1.38,"bus":1.55,"moto":0.58},"driver":{"experienced":1.0,"young":1.4,"unlimited":1.18},"term":{"1":0.21,"6":0.63,"12":1.0}}'),
('auto', 'PZU Україна', 1410, false, 4, '{"region":{"kyiv":1.78,"kharkiv":1.24,"lviv":1.19,"odesa":1.29,"dnipro":1.23,"other":1.0},"vehicle":{"car_small":0.9,"car_medium":1.0,"car_large":1.16,"truck":1.42,"bus":1.6,"moto":0.6},"driver":{"experienced":1.0,"young":1.48,"unlimited":1.2},"term":{"1":0.2,"6":0.64,"12":1.0}}'),
('green_card', 'ІНГО Україна', 1750, false, 1, '{"zone":{"europe":1.0,"moldova":0.3},"vehicle":{"car":1.0,"moto":0.55,"truck":2.4,"bus":2.8,"trailer":0.7},"term":{"15":0.28,"30":0.42,"90":0.72,"180":0.9,"365":1.0}}'),
('green_card', 'УНІКА', 1690, false, 2, '{"zone":{"europe":1.0,"moldova":0.32},"vehicle":{"car":1.0,"moto":0.58,"truck":2.5,"bus":2.9,"trailer":0.72},"term":{"15":0.3,"30":0.44,"90":0.74,"180":0.92,"365":1.0}}'),
('green_card', 'АХА Страхування', 1820, false, 3, '{"zone":{"europe":1.0,"moldova":0.29},"vehicle":{"car":1.0,"moto":0.54,"truck":2.35,"bus":2.75,"trailer":0.68},"term":{"15":0.27,"30":0.4,"90":0.7,"180":0.88,"365":1.0}}'),
('travel', 'ІНГО Україна', 32, true, 1, '{"zone":{"schengen":1.0,"world":1.6,"turkey_egypt":0.8},"coverage":{"30000":1.0,"50000":1.25,"100000":1.7},"age":{"under_18":0.8,"18_64":1.0,"over_65":2.2},"activity":{"standard":1.0,"active":1.4,"extreme":2.0}}'),
('travel', 'УНІКА', 29, true, 2, '{"zone":{"schengen":1.0,"world":1.65,"turkey_egypt":0.82},"coverage":{"30000":1.0,"50000":1.3,"100000":1.75},"age":{"under_18":0.85,"18_64":1.0,"over_65":2.3},"activity":{"standard":1.0,"active":1.45,"extreme":2.1}}'),
('travel', 'PZU Україна', 35, true, 3, '{"zone":{"schengen":1.0,"world":1.55,"turkey_egypt":0.78},"coverage":{"30000":1.0,"50000":1.22,"100000":1.65},"age":{"under_18":0.8,"18_64":1.0,"over_65":2.1},"activity":{"standard":1.0,"active":1.35,"extreme":1.95}}'),
('sport', 'ІНГО Україна', 950, false, 1, '{"risk":{"amateur":1.0,"pro":1.8,"extreme":2.6},"coverage":{"50000":1.0,"100000":1.5,"200000":2.2},"term":{"1":0.2,"3":0.45,"6":0.7,"12":1.0},"insured":{"individual":1.0,"team":4.5}}'),
('sport', 'УНІКА', 890, false, 2, '{"risk":{"amateur":1.0,"pro":1.85,"extreme":2.7},"coverage":{"50000":1.0,"100000":1.55,"200000":2.25},"term":{"1":0.22,"3":0.47,"6":0.72,"12":1.0},"insured":{"individual":1.0,"team":4.6}}'),
('sport', 'АХА Страхування', 1020, false, 3, '{"risk":{"amateur":1.0,"pro":1.75,"extreme":2.5},"coverage":{"50000":1.0,"100000":1.45,"200000":2.1},"term":{"1":0.2,"3":0.44,"6":0.68,"12":1.0},"insured":{"individual":1.0,"team":4.4}}');
