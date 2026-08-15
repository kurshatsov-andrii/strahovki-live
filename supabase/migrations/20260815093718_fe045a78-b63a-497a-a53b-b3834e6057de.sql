UPDATE public.tariffs
SET base_price = 1,
    coefficients = '{"group_age": {
      "g1_a1": 415, "g1_a2": 377, "g1_a3": 415,
      "g2_a1": 456, "g2_a2": 415, "g2_a3": 456,
      "g3_a1": 830, "g3_a2": 754, "g3_a3": 830,
      "g4_a1": 1245, "g4_a2": 1131, "g4_a3": 1245
    }}'::jsonb,
    updated_at = now()
WHERE product = 'sport';