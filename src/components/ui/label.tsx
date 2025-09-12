// src/components/ui/label.tsx
import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  requiredMark?: boolean;
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, requiredMark, ...props }, ref) => (
    <label
      ref={ref}
      className={cx("text-sm font-medium text-gray-900", className)}
      {...props}
    >
      {children}
      {requiredMark ? <span className="ml-0.5 text-red-600">*</span> : null}
    </label>
  )
);
Label.displayName = "Label";
