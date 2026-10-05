import { Coffee } from "lucide-react";
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 p-8 text-center text-sm text-muted-foreground">
      <Coffee className="mb-3 text-coffee" />
      {children}
    </div>
  );
}
