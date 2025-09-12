// src/components/ui/button.tsx
import * as React from "react";

// Minimal className joiner to avoid extra deps
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Minimal Button compatible with imports like:
 *   import { Button } from "@/components/ui/button";
 * API mirrors common shadcn/ui props (variant, size) to reduce refactors.
 */
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-black text-white hover:opacity-90",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 hover:bg-gray-50",
  ghost: "hover:bg-gray-100",
  link: "underline underline-offset-4 hover:opacity-80",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-6",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cx(base, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
