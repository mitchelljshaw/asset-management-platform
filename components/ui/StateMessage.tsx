import type { ReactNode } from "react";
import { Loader2, AlertTriangle, Inbox } from "lucide-react";

// Three flavours of "there's no table to show right now" that come up on
// every page that fetches from Supabase. Centralising them means the loading
// spinner, error box, and empty state all look and read the same way
// everywhere in the app.

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface py-16 text-muted">
      <Loader2 size={18} className="animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 py-12 text-center">
      <AlertTriangle size={20} className="text-red-600" />
      <p className="max-w-sm text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-surface py-16 text-center">
      <Inbox size={22} className="text-muted" />
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
