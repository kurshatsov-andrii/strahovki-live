UPDATE public.tariffs
SET base_price = 500,
    coefficients = '{"sport_group": {"g1": 0.7, "g2": 1.0, "g3": 1.6, "g4": 2.4}}'::jsonb,
    updated_at = now()
WHERE product = 'sport';