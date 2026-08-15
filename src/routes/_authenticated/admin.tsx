import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, LogOut, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteLead,
  deleteTariff,
  getAdminSettings,
  getIsAdmin,
  listLeads,
  listTariffs,
  saveSiteSettings,
  saveTariff,
  updateLead,
} from "@/lib/admin.functions";
import {
  describeAllParams,
  formatDateTime,
  formatUah,
  leadStatuses,
  productLabels,
  PRODUCTS,
  statusLabel,
  type ProductKey,
} from "@/lib/insurance";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Адмінпанель — Страховки" },
      { name: "description", content: "Керування заявками, тарифами та налаштуваннями сайту." },
      { property: "og:title", content: "Адмінпанель — Страховки" },
      { property: "og:description", content: "Керування заявками, тарифами та налаштуваннями." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdminFn = useServerFn(getIsAdmin);
  const access = useQuery({ queryKey: ["is-admin"], queryFn: () => isAdminFn() });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (access.isLoading) {
    return (
      <div className="container-page py-24 text-center text-muted-foreground">
        <Loader2 className="mx-auto size-6 animate-spin" />
      </div>
    );
  }

  if (!access.data?.isAdmin) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-extrabold">Доступ обмежено</h1>
        <p className="mt-3 text-muted-foreground">
          Ваш акаунт не має прав адміністратора. Зверніться до власника сайту.
        </p>
        <Button className="mt-6" variant="outline" onClick={signOut}>
          Вийти
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Адмінпанель</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Заявки клієнтів, тарифи страхових компаній і контактні дані сайту.
          </p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="mr-2 size-4" /> Вийти
        </Button>
      </div>

      <Tabs defaultValue="leads" className="mt-8">
        <TabsList>
          <TabsTrigger value="leads">Заявки</TabsTrigger>
          <TabsTrigger value="tariffs">Тарифи</TabsTrigger>
          <TabsTrigger value="settings">Налаштування</TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className="mt-6">
          <LeadsTab />
        </TabsContent>
        <TabsContent value="tariffs" className="mt-6">
          <TariffsTab />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeadsTab() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listLeads);
  const updateFn = useServerFn(updateLead);
  const deleteFn = useServerFn(deleteLead);

  const leads = useQuery({ queryKey: ["admin-leads"], queryFn: () => listFn() });

  const update = useMutation({
    mutationFn: (input: { id: string; status?: string; admin_note?: string }) =>
      updateFn({ data: input as never }),
    onSuccess: () => {
      toast.success("Заявку оновлено");
      void queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
    onError: () => toast.error("Не вдалося оновити заявку"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Заявку видалено");
      void queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
    onError: () => toast.error("Не вдалося видалити заявку"),
  });

  const rows = (leads.data ?? []) as any[];
  const counts = useMemo(() => {
    return leadStatuses.map((status) => ({
      ...status,
      count: rows.filter((row) => row.status === status.value).length,
    }));
  }, [rows]);

  if (leads.isLoading) return <Loader2 className="size-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {counts.map((item) => (
          <div key={item.value} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {item.label}
            </div>
            <div className="mt-1 text-2xl font-extrabold">{item.count}</div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">Заявок поки немає.</p>
      )}

      <div className="space-y-4">
        {rows.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{lead.name}</span>
                  <Badge variant="secondary">{statusLabel(lead.status)}</Badge>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {lead.phone}
                  {lead.email ? ` · ${lead.email}` : ""}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(lead.created_at)}
                </div>
              </div>
              <div className="text-right">
                {lead.product && (
                  <div className="font-semibold">
                    {productLabels[lead.product as ProductKey] ?? lead.product}
                  </div>
                )}
                {lead.company && (
                  <div className="text-sm text-muted-foreground">{lead.company}</div>
                )}
                {lead.price != null && (
                  <div className="text-lg font-extrabold">{formatUah(Number(lead.price))}</div>
                )}
              </div>
            </div>

            {describeAllParams((lead.product as ProductKey) ?? null, (lead.params ?? {}) as Record<string, unknown>).length > 0 && (
              <ul className="mt-4 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                {describeAllParams((lead.product as ProductKey) ?? null, (lead.params ?? {}) as Record<string, unknown>).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}

            {lead.message && <p className="mt-3 text-sm">{lead.message}</p>}

            <div className="mt-5 grid gap-3 sm:grid-cols-[200px_1fr_auto] sm:items-end">
              <div className="space-y-2">
                <Label>Статус</Label>
                <Select
                  value={lead.status}
                  onValueChange={(value) =>
                    update.mutate({ id: lead.id, status: value, admin_note: lead.admin_note ?? "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`note-${lead.id}`}>Нотатка менеджера</Label>
                <Textarea
                  id={`note-${lead.id}`}
                  rows={2}
                  defaultValue={lead.admin_note ?? ""}
                  onBlur={(event) =>
                    event.target.value !== (lead.admin_note ?? "") &&
                    update.mutate({
                      id: lead.id,
                      status: lead.status,
                      admin_note: event.target.value,
                    })
                  }
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => remove.mutate(lead.id)}
                aria-label="Видалити заявку"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type TariffDraft = {
  id?: string;
  product: ProductKey;
  company: string;
  base_price: string;
  per_day: boolean;
  is_active: boolean;
  sort_order: string;
  note: string;
  coefficients: string;
};

function toDraft(row: any): TariffDraft {
  return {
    id: row.id,
    product: row.product,
    company: row.company,
    base_price: String(row.base_price),
    per_day: Boolean(row.per_day),
    is_active: Boolean(row.is_active),
    sort_order: String(row.sort_order),
    note: row.note ?? "",
    coefficients: JSON.stringify(row.coefficients ?? {}, null, 2),
  };
}

function TariffsTab() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listTariffs);
  const saveFn = useServerFn(saveTariff);
  const deleteFn = useServerFn(deleteTariff);

  const tariffs = useQuery({ queryKey: ["admin-tariffs"], queryFn: () => listFn() });
  const [draft, setDraft] = useState<TariffDraft | null>(null);

  const save = useMutation({
    mutationFn: (input: TariffDraft) => {
      let coefficients: unknown;
      try {
        coefficients = JSON.parse(input.coefficients || "{}");
      } catch {
        throw new Error("Коефіцієнти мають бути коректним JSON");
      }
      return saveFn({
        data: {
          ...(input.id ? { id: input.id } : {}),
          product: input.product,
          company: input.company.trim(),
          base_price: Number(input.base_price),
          per_day: input.per_day,
          is_active: input.is_active,
          sort_order: Number(input.sort_order) || 0,
          note: input.note.trim() ? input.note.trim() : null,
          coefficients,
        } as never,
      });
    },
    onSuccess: () => {
      toast.success("Тариф збережено");
      setDraft(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-tariffs"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Не вдалося зберегти тариф"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Тариф видалено");
      void queryClient.invalidateQueries({ queryKey: ["admin-tariffs"] });
    },
    onError: () => toast.error("Не вдалося видалити тариф"),
  });

  if (tariffs.isLoading) return <Loader2 className="size-5 animate-spin" />;

  const rows = (tariffs.data ?? []) as any[];

  return (
    <div className="space-y-6">
      <Button
        onClick={() =>
          setDraft({
            product: "auto",
            company: "",
            base_price: "1000",
            per_day: false,
            is_active: true,
            sort_order: "10",
            note: "",
            coefficients: "{}",
          })
        }
      >
        <Plus className="mr-2 size-4" /> Додати тариф
      </Button>

      {draft && (
        <div className="rounded-2xl border border-primary bg-card p-6 shadow-soft">
          <h3 className="text-lg font-bold">{draft.id ? "Редагування тарифу" : "Новий тариф"}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Продукт</Label>
              <Select
                value={draft.product}
                onValueChange={(value) => setDraft({ ...draft, product: value as ProductKey })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((product) => (
                    <SelectItem key={product} value={product}>
                      {productLabels[product]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Страхова компанія</Label>
              <Input
                value={draft.company}
                onChange={(event) => setDraft({ ...draft, company: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Базова ціна, грн</Label>
              <Input
                type="number"
                min={0}
                value={draft.base_price}
                onChange={(event) => setDraft({ ...draft, base_price: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Порядок відображення</Label>
              <Input
                type="number"
                min={0}
                value={draft.sort_order}
                onChange={(event) => setDraft({ ...draft, sort_order: event.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={draft.per_day}
                onCheckedChange={(checked) => setDraft({ ...draft, per_day: checked })}
              />
              <Label>Ціна за день</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={draft.is_active}
                onCheckedChange={(checked) => setDraft({ ...draft, is_active: checked })}
              />
              <Label>Активний</Label>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Примітка</Label>
              <Input
                value={draft.note}
                onChange={(event) => setDraft({ ...draft, note: event.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Коефіцієнти (JSON)</Label>
              <Textarea
                rows={10}
                className="font-mono text-xs"
                value={draft.coefficients}
                onChange={(event) => setDraft({ ...draft, coefficients: event.target.value })}
              />
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <Button onClick={() => save.mutate(draft)} disabled={save.isPending}>
              {save.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Зберегти
            </Button>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Скасувати
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rows.map((tariff) => (
          <div
            key={tariff.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div>
              <div className="font-semibold">{tariff.company}</div>
              <div className="text-sm text-muted-foreground">
                {productLabels[tariff.product as ProductKey]} · база{" "}
                {formatUah(Number(tariff.base_price))}
                {tariff.per_day ? " / день" : ""}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!tariff.is_active && <Badge variant="secondary">Вимкнено</Badge>}
              <Button variant="outline" size="sm" onClick={() => setDraft(toDraft(tariff))}>
                Редагувати
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Видалити тариф"
                onClick={() => remove.mutate(tariff.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const settingsFields: { key: string; label: string }[] = [
  { key: "phone_primary", label: "Основний телефон" },
  { key: "phone_secondary", label: "Додатковий телефон" },
  { key: "email", label: "Email" },
  { key: "telegram_url", label: "Telegram" },
  { key: "viber_url", label: "Viber" },
  { key: "facebook_url", label: "Facebook" },
  { key: "instagram_url", label: "Instagram" },
  { key: "address", label: "Адреса" },
  { key: "working_hours", label: "Графік роботи" },
];

function SettingsTab() {
  const queryClient = useQueryClient();
  const getFn = useServerFn(getAdminSettings);
  const saveFn = useServerFn(saveSiteSettings);
  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: () => getFn() });
  const [form, setForm] = useState<Record<string, string> | null>(null);

  const values =
    form ??
    (settings.data
      ? Object.fromEntries(
          settingsFields.map((field) => [
            field.key,
            String((settings.data as any)[field.key] ?? ""),
          ]),
        )
      : null);

  const save = useMutation({
    mutationFn: (input: Record<string, string>) => saveFn({ data: input as never }),
    onSuccess: () => {
      toast.success("Налаштування збережено");
      void queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: () => toast.error("Не вдалося зберегти налаштування"),
  });

  if (!values) return <Loader2 className="size-5 animate-spin" />;

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        {settingsFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              value={values[field.key] ?? ""}
              onChange={(event) => setForm({ ...values, [field.key]: event.target.value })}
            />
          </div>
        ))}
      </div>
      <Button className="mt-6" onClick={() => save.mutate(values)} disabled={save.isPending}>
        {save.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Зберегти зміни
      </Button>
    </div>
  );
}
