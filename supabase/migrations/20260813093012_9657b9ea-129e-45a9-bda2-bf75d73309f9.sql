DELETE FROM public.tariffs;

INSERT INTO public.tariffs (product, company, base_price, per_day, note, sort_order, is_active, coefficients) VALUES
('green_card', 'USG', 1, false, 'Актуальні ціни з 08.07.2026', 1, true, '{
  "zone_term": {
    "europe_15": 1050, "europe_21": 1450, "europe_30": 1690, "europe_60": 3047,
    "europe_90": 4834, "europe_120": 6419, "europe_150": 8084, "europe_180": 9750, "europe_365": 12133,
    "moldova_15": 681, "moldova_21": 841, "moldova_30": 1031, "moldova_60": 1409,
    "moldova_90": 1787, "moldova_120": 2108, "moldova_150": 2335, "moldova_180": 2439, "moldova_365": 3772
  }
}'::jsonb),
('auto', 'EUROINS', 1450, false, NULL, 1, true, '{
  "region": {"kyiv": 1.8, "kharkiv": 1.25, "lviv": 1.2, "odesa": 1.3, "dnipro": 1.25, "other": 1},
  "vehicle": {"car_small": 0.9, "car_medium": 1, "car_large": 1.15, "truck": 1.4, "bus": 1.6, "moto": 0.6},
  "driver": {"experienced": 1, "young": 1.45, "unlimited": 1.2},
  "term": {"1": 0.2, "6": 0.65, "12": 1}
}'::jsonb),
('travel', 'EUROINS', 32, true, NULL, 1, true, '{
  "zone": {"schengen": 1, "turkey_egypt": 0.8, "world": 1.6},
  "coverage": {"30000": 1, "50000": 1.25, "100000": 1.7},
  "age": {"under_18": 0.8, "18_64": 1, "over_65": 2.2},
  "activity": {"standard": 1, "active": 1.4, "extreme": 2}
}'::jsonb),
('sport', 'EUROINS', 950, false, NULL, 1, true, '{
  "risk": {"amateur": 1, "pro": 1.8, "extreme": 2.6},
  "coverage": {"50000": 1, "100000": 1.5, "200000": 2.2},
  "insured": {"individual": 1, "team": 4.5},
  "term": {"1": 0.2, "3": 0.45, "6": 0.7, "12": 1}
}'::jsonb);