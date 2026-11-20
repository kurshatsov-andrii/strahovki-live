import { describe, expect, it } from "vitest";
import {
  greenCardRestrictions,
  isGreenCardRestrictedVehicle,
} from "@/lib/green-card-restrictions";

describe("Green Card vehicle restrictions", () => {
  it("contains exactly the ten make and model combinations from the insurer list", () => {
    expect(greenCardRestrictions.flatMap((item) => item.models.map((model) => [item.brand, model]))).toEqual([
      ["MERCEDES-BENZ", "SPRINTER"],
      ["VOLKSWAGEN", "CRAFTER"],
      ["VOLKSWAGEN", "LT"],
      ["RENAULT", "MASTER"],
      ["CITROEN", "JUMPER"],
      ["PEUGEOT", "BOXER"],
      ["OPEL", "MOVANO"],
      ["NISSAN", "INTERSTAR"],
      ["IVECO", "DAILY"],
      ["FIAT", "DUCATO"],
    ]);
  });

  it.each([
    ["MERCEDES-BENZ", "SPRINTER"],
    ["VOLKSWAGEN", "CRAFTER"],
    ["VOLKSWAGEN", "LT"],
    ["RENAULT", "MASTER"],
    ["CITROEN", "JUMPER"],
    ["PEUGEOT", "BOXER"],
    ["OPEL", "MOVANO"],
    ["NISSAN", "INTERSTAR"],
    ["IVECO", "DAILY"],
    ["FIAT", "DUCATO"],
  ])("blocks %s %s", (brand, model) => {
    expect(isGreenCardRestrictedVehicle(brand, model)).toBe(true);
  });

  it("recognizes different letter case and Mercedes-Benz spelling", () => {
    expect(isGreenCardRestrictedVehicle("Mercedes Benz", "sprinter")).toBe(true);
  });

  it("allows another model of a listed make", () => {
    expect(isGreenCardRestrictedVehicle("MERCEDES-BENZ", "VITO")).toBe(false);
  });

  it("allows the same model name with another make", () => {
    expect(isGreenCardRestrictedVehicle("TOYOTA", "MASTER")).toBe(false);
  });

  it("does not block an incomplete vehicle selection", () => {
    expect(isGreenCardRestrictedVehicle("FIAT", "")).toBe(false);
    expect(isGreenCardRestrictedVehicle("", "DUCATO")).toBe(false);
  });
});
