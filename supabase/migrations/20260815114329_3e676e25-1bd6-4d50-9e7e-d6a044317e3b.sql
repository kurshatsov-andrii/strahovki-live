UPDATE public.tariffs
SET coefficients = '{
      "zone": {"schengen": 1, "world": 1.6},
      "age": {"1_3": 1.196722, "4_59": 1, "60_65": 1.598256, "66_70": 1.998228},
      "activity": {"standard": 1, "active": 1}
    }'::jsonb,
    updated_at = now()
WHERE product = 'travel';