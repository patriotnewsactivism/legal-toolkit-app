// src/components/ui/input.tsx
import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Minimal Input compatible with:
 *   import { Input } from "@/components/ui/input";
 * Mirrors common shadcn/ui API (forwardRef, className prop). Kept tiny to unblock build.
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /**
   * Provide additional classes to align with your design system.
   * Keep minimal to avoid styling drift.
   */
  className?: string;
};

const base =
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return <input ref={ref} type={type} className={cx(base, className)} {...props} />;
  }
);
Input.displayName = "Input";
