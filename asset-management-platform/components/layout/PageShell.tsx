import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">{children}</div>
      </main>
    </div>
  );
}
