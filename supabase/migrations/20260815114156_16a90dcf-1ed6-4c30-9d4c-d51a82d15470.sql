ALTER TABLE public.tariffs ALTER COLUMN base_price TYPE numeric(10,4);

UPDATE public.tariffs
SET base_price = 41.1529,
    coefficients = '{
      "zone": {"schengen": 1, "world": 1.6},
      "age": {"1_3": 1.1967, "4_59": 1, "60_65": 1.5983, "66_70": 1.9982},
      "activity": {"standard": 1, "active": 1}
    }'::jsonb,
    updated_at = now()
WHERE product = 'travel';