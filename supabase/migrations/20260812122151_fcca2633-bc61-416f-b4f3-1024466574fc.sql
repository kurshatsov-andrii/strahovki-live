
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "Anyone can view active tariffs" ON public.tariffs;
CREATE POLICY "Guests can view active tariffs" ON public.tariffs
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Users can view active tariffs" ON public.tariffs
  FOR SELECT TO authenticated USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
