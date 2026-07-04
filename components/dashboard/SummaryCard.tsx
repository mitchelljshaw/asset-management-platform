import type { LucideIcon } from "lucide-react";

type Accent = "default" | "success" | "warning" | "danger";

const ACCENT_STYLES: Record<Accent, string> = {
  default: "border-l-slate-400 text-slate-600",
  success: "border-l-emerald-500 text-emerald-600",
  warning: "border-l-amber-500 text-amber-600",
  danger: "border-l-red-500 text-red-600",
};

interface SummaryCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: Accent;
}

export default function SummaryCard({
  label,
  value,
  icon: Icon,
  accent = "default",
}: SummaryCardProps) {
  return (
    <div
      className={`rounded-lg border border-border border-l-4 bg-surface p-5 shadow-sm ${ACCENT_STYLES[accent]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <Icon size={18} className={ACCENT_STYLES[accent].split(" ")[1]} />
      </div>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
