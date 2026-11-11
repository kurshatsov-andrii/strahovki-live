DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'new'::lead_status
  AND admin_note IS NULL
  AND char_length(name) BETWEEN 1 AND 100
  AND char_length(phone) BETWEEN 5 AND 30
  AND (email IS NULL OR char_length(email) <= 255)
  AND (message IS NULL OR char_length(message) <= 1000)
  AND (company IS NULL OR char_length(company) <= 100)
  AND (price IS NULL OR (price >= 0 AND price <= 10000000))
  AND pg_column_size(params) <= 20000
);
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view public site contacts" ON public.site_settings FOR SELECT TO anon, authenticated
USING (id = 1);