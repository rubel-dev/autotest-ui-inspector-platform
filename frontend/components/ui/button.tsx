import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" && "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
          variant === "secondary" && "border border-line bg-white text-ink hover:bg-slate-50",
          variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-ink",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
