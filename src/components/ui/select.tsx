// src/components/ui/select.tsx
// Minimal, dependency-free stand-in for shadcn/radix Select.
// Provides: Select, SelectTrigger, SelectValue, SelectContent, SelectItem
// Behavior: renders a native <select> for reliability; subcomponents are structural no-ops.
import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type OnValueChange = (value: string) => void;

export interface SelectRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: OnValueChange;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

export interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
}

const SelectItemSymbol = Symbol("SelectItem");

export const SelectItem: React.FC<SelectItemProps> & { __type: symbol } = (props) => {
  // Acts as data holder; actual rendering done by <Select> via native <select>.
  return null;
};
SelectItem.__type = SelectItemSymbol;
(SelectItem as any).displayName = "SelectItem";

export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>> = ({ children }) => (
  <>{children}</>
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue: React.FC<{ placeholder?: string } & React.HTMLAttributes<HTMLSpanElement>> = ({ children }) => (
  <>{children}</>
);
SelectValue.displayName = "SelectValue";

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <>{children}</>
);
SelectContent.displayName = "SelectContent";

function collectItems(children: React.ReactNode): Array<{ value: string; label: React.ReactNode }> {
  const out: Array<{ value: string; label: React.ReactNode }> = [];
  React.Children.forEach(children as any, (child: any) => {
    if (!child) return;
    if (child.type && (child.type.__type === SelectItemSymbol)) {
      out.push({ value: child.props.value, label: child.props.children });
    }
    if (child.props && child.props.children) {
      out.push(...collectItems(child.props.children));
    }
  });
  return out;
}

const selectBase = "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:opacity-50";

export const Select = React.forwardRef<HTMLSelectElement, SelectRootProps>(
  ({ value, defaultValue, onValueChange, placeholder, disabled, name, className, children, ...rest }, ref) => {
    const items = React.useMemo(() => collectItems(children), [children]);
    const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.currentTarget.value;
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    };

    return (
      <div {...rest} className={cx("relative", className)}>
        <select
          ref={ref}
          className={selectBase}
          value={current}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          name={name}
        >
          {placeholder !== undefined ? (
            <option value="" disabled={true} hidden={true}>
              {placeholder}
            </option>
          ) : null}
          {items.map((it) => (
            <option key={String(it.value)} value={it.value}>
              {it.label as any}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";
