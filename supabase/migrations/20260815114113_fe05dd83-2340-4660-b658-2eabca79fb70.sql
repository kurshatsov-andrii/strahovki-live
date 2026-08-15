UPDATE public.tariffs
SET base_price = 41.152857142857,
    coefficients = '{
      "zone": {"schengen": 1, "world": 1.6},
      "age": {"1_3": 1.1967230184, "4_59": 1, "60_65": 1.5982573333, "66_70": 1.9982295963},
      "activity": {"standard": 1, "active": 1}
    }'::jsonb,
    updated_at = now()
WHERE product = 'travel';