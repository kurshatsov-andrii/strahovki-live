export const GREEN_CARD_RESTRICTED_VEHICLE_MESSAGE =
  "Для цієї марки та моделі авто оформлення Зеленої карти недоступне.";

export const greenCardRestrictions = [
  { brand: "MERCEDES-BENZ", models: ["SPRINTER"] },
  { brand: "VOLKSWAGEN", models: ["CRAFTER", "LT"] },
  { brand: "RENAULT", models: ["MASTER"] },
  { brand: "CITROEN", models: ["JUMPER"] },
  { brand: "PEUGEOT", models: ["BOXER"] },
  { brand: "OPEL", models: ["MOVANO"] },
  { brand: "NISSAN", models: ["INTERSTAR"] },
  { brand: "IVECO", models: ["DAILY"] },
  { brand: "FIAT", models: ["DUCATO"] },
] as const;

function normalizeVehicleName(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

export function isGreenCardRestrictedVehicle(
  brand: string | undefined,
  model: string | undefined,
): boolean {
  if (!brand?.trim() || !model?.trim()) return false;

  const normalizedBrand = normalizeVehicleName(brand);
  const normalizedModel = normalizeVehicleName(model);

  return greenCardRestrictions.some(
    (restriction) =>
      normalizeVehicleName(restriction.brand) === normalizedBrand &&
      restriction.models.some((item) => normalizeVehicleName(item) === normalizedModel),
  );
}
