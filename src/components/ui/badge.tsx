// src/components/ui/badge.tsx
import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline";
};

const variants = {
  default: "bg-black text-white",
  secondary: "bg-gray-100 text-gray-900",
  destructive: "bg-red-600 text-white",
  outline: "border border-gray-300",
} as const;

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => (
  <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />
);
