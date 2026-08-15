import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { computePrice, type Coefficients, type ProductKey } from "@/lib/insurance";

function createPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const productEnum = z.enum(["auto", "green_card", "travel", "sport"]);

const quoteSchema = z.object({
  product: productEnum,
  params: z.record(z.string(), z.string().max(300)).default({}),
});

export type Quote = {
  tariffId: string;
  company: string;
  price: number;
  note: string | null;
};

export const getQuotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => quoteSchema.parse(input))
  .handler(async ({ data }): Promise<Quote[]> => {
    const supabase = createPublicClient();
    const { data: rows, error } = await supabase
      .from("tariffs")
      .select("id, company, base_price, coefficients, per_day, note, sort_order")
      .eq("product", data.product)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);

    const days = Number(data.params["days"] ?? 1) || 1;

    return (rows ?? [])
      .map((row) => ({
        tariffId: row.id,
        company: row.company,
        note: row.note,
        price: computePrice(
          Number(row.base_price),
          (row.coefficients ?? {}) as Coefficients,
          row.per_day,
          data.params,
          days,
        ),
      }))
      .sort((a, b) => a.price - b.price);
  });

const leadSchema = z.object({
  name: z.string().trim().min(2, "Вкажіть ім'я").max(100),
  phone: z.string().trim().min(6, "Вкажіть телефон").max(30),
  email: z.string().trim().email("Некоректний email").max(255).optional().or(z.literal("")),
  product: productEnum.optional(),
  params: z.record(z.string(), z.string().max(300)).default({}),
  company: z.string().trim().max(100).optional(),
  price: z.number().nonnegative().max(10_000_000).optional(),
  message: z.string().trim().max(1000).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      email: data.email ? data.email : null,
      product: (data.product ?? null) as ProductKey | null,
      params: data.params,
      company: data.company ?? null,
      price: data.price ?? null,
      message: data.message ?? null,
    });
    if (error) throw new Error(error.message);

    const { notifyNewLead } = await import("@/lib/telegram.server");
    await notifyNewLead({
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      product: data.product ?? null,
      company: data.company ?? null,
      price: data.price ?? null,
      message: data.message ?? null,
      params: data.params,
    });

    return { ok: true };
  });

export type SiteSettings = {
  phone_primary: string;
  phone_secondary: string;
  email: string;
  telegram_url: string;
  viber_url: string;
  facebook_url: string;
  instagram_url: string;
  address: string;
  working_hours: string;
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "phone_primary, phone_secondary, email, telegram_url, viber_url, facebook_url, instagram_url, address, working_hours",
      )
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
);
