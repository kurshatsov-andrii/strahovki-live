import { describe, expect, it } from "vitest";
import { sportLeadSchema } from "@/lib/lead-validation";
import { describeAllParams } from "@/lib/insurance";
import { buildLeadMessage } from "@/lib/telegram.server";

const validAdult = {
  last_name: "Куршацов",
  first_name: "Андрій",
  middle_name: "Іванович",
  birth_date: "20.03.1985",
  tax_id: "1234567890",
  passport_number: "МЕ123456",
  passport_issuer: "Харківський РВ",
  passport_date: "01.01.2020",
  address: "м. Харків, вул. Сумська, буд. 1",
  viber_phone: "+380664688151",
  email: "client@example.com",
  message: "",
};

const validChild = {
  is_child: "true",
  child_last_name: "Куршацов",
  child_first_name: "Матвій",
  child_middle_name: "Андрійович",
  child_birth_date: "15.05.2015",
  child_tax_id: "",
};

describe("sport insurance for a child", () => {
  it("keeps the adult tax ID required for an ordinary application", () => {
    const result = sportLeadSchema.safeParse({ ...validAdult, tax_id: "" });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues.some((issue) => issue.path[0] === "tax_id")).toBe(true);
  });

  it("accepts a child application with both tax IDs left empty", () => {
    const result = sportLeadSchema.safeParse({
      ...validAdult,
      ...validChild,
      tax_id: "",
    });
    expect(result.success).toBe(true);
  });

  it.each([
    "child_last_name",
    "child_first_name",
    "child_middle_name",
    "child_birth_date",
  ] as const)("requires %s when the child checkbox is selected", (field) => {
    const result = sportLeadSchema.safeParse({
      ...validAdult,
      ...validChild,
      [field]: "",
    });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
  });

  it("requires a complete valid birth date for the child", () => {
    const result = sportLeadSchema.safeParse({
      ...validAdult,
      ...validChild,
      child_birth_date: "15.05",
    });
    expect(result.success).toBe(false);
  });

  it("checks a child tax ID only when it is provided", () => {
    const result = sportLeadSchema.safeParse({
      ...validAdult,
      ...validChild,
      child_tax_id: "123",
    });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues.some((issue) => issue.path[0] === "child_tax_id")).toBe(true);
  });

  it("keeps child fields optional when the checkbox is not selected", () => {
    expect(sportLeadSchema.safeParse(validAdult).success).toBe(true);
  });

  it("shows the child data in the admin application", () => {
    const lines = describeAllParams("sport", validChild);
    expect(lines).toContain("Оформлення на дитину: Так");
    expect(lines).toContain("Прізвище дитини: Куршацов");
    expect(lines).toContain("Дата народження дитини: 15.05.2015");
  });

  it("includes the child data in the Telegram notification", () => {
    const message = buildLeadMessage({
      name: "Куршацов Андрій Іванович",
      phone: "+380664688151",
      product: "sport",
      params: validChild,
    });
    expect(message).toContain("Оформлення на дитину: Так");
    expect(message).toContain("Ім'я дитини");
    expect(message).toContain("Дата народження дитини: 15.05.2015");
  });
});
