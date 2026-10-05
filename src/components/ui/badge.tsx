import { cn } from "@/lib/utils";
export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-espresso/8 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-espresso",
        className,
      )}
    >
      {children}
    </span>
  );
}
