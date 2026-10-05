import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn("flex h-11 w-full rounded-xl border bg-white/70 px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-coffee focus:ring-2 focus:ring-coffee/15 disabled:cursor-not-allowed disabled:opacity-60", className)} {...props} />;
});
