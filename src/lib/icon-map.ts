import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgePercent,
  CalendarRange,
  Car,
  Clock,
  FileCheck,
  Globe2,
  Headset,
  HeartPulse,
  MapPin,
  Mountain,
  PlaneTakeoff,
  Send,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Trophy,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Activity,
  BadgePercent,
  CalendarRange,
  Car,
  Clock,
  FileCheck,
  Globe2,
  Headset,
  HeartPulse,
  MapPin,
  Mountain,
  PlaneTakeoff,
  Send,
  ShieldCheck,
  ShieldPlus,
  Trophy,
  Users,
  Wallet,
  Zap,
};

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Shield;
}
