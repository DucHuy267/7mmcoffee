import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-espresso text-white hover:bg-coffee",
        secondary:
          "border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-espresso",
        outline:
          "border border-espresso/25 text-espresso hover:bg-espresso hover:text-white",
        ghost: "text-espresso hover:bg-espresso/8",
        destructive: "bg-red-700 text-white hover:bg-red-800",
      },
      size: {
        default: "px-5",
        sm: "min-h-9 px-3 text-xs",
        lg: "min-h-12 px-7",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
export { buttonVariants };
