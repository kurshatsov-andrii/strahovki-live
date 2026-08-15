import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type DateRangeMode = "past" | "future3m" | "any";

export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

function parseDMY(value: string): Date | undefined {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return undefined;
  const date = parse(value, "dd.MM.yyyy", new Date());
  return isValid(date) ? date : undefined;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function rangeBounds(mode: DateRangeMode) {
  const today = startOfToday();
  if (mode === "past") return { fromDate: new Date(1900, 0, 1), toDate: today };
  if (mode === "future3m") {
    const from = new Date(today);
    from.setDate(from.getDate() + 1);
    const to = new Date(today);
    to.setMonth(to.getMonth() + 3);
    return { fromDate: from, toDate: to };
  }
  return { fromDate: new Date(1900, 0, 1), toDate: new Date(2100, 0, 1) };
}

export function DateField({
  id,
  name,
  value,
  onChange,
  mode = "any",
  placeholder = "дд.мм.рррр",
  invalid,
  minDate,
  maxDate,
}: {
  id?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  mode?: DateRangeMode;
  placeholder?: string;
  invalid?: boolean;
  minDate?: Date;
  maxDate?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const bounds = rangeBounds(mode);
  const fromDate = minDate ?? bounds.fromDate;
  const toDate = maxDate ?? bounds.toDate;
  const selected = parseDMY(value);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        inputMode="numeric"
        maxLength={10}
        className="pr-10"
        aria-invalid={invalid}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(formatDateInput(event.target.value))}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Обрати дату з календаря"
            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
          >
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            locale={uk}
            captionLayout="dropdown"
            defaultMonth={selected ?? (mode === "future3m" ? fromDate : startOfToday())}
            startMonth={fromDate}
            endMonth={toDate}
            disabled={{ before: fromDate, after: toDate }}
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "dd.MM.yyyy"));
              setOpen(false);
            }}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
