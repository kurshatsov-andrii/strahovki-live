UPDATE public.tariffs
SET base_price = 41.152857,
    coefficients = '{
      "zone": {"schengen": 1, "world": 1.6},
      "age": {"1_3": 1.196723, "4_59": 1, "60_65": 1.598257, "66_70": 1.998230},
      "activity": {"standard": 1, "active": 1}
    }'::jsonb,
    note = 'Актуальні ціни на 7 днів: 1–3 роки — 344,74 ₴, 4–59 років — 288,07 ₴, 60–65 років — 460,41 ₴, 66–70 років — 575,63 ₴',
    updated_at = now()
WHERE product = 'travel';