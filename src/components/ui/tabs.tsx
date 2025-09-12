// src/components/ui/tabs.tsx
import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface TabsCtx {
  value: string | undefined;
  setValue: (v: string) => void;
}

const TabsContext = React.createContext<TabsCtx | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ value, defaultValue, onValueChange, className, children, ...rest }) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const setValue = React.useCallback(
    (v: string) => {
      if (!controlled) setInternal(v);
      onValueChange?.(v);
    },
    [controlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={cx("w-full", className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div role="tablist" className={cx("inline-flex items-center gap-1 rounded-md bg-gray-100 p-1", className)} {...props} />
);

export const TabsTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }> = ({ value, className, children, ...props }) => {
  const ctx = React.useContext(TabsContext);
  const active = ctx?.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => ctx?.setValue(value)}
      className={cx(
        "px-3 py-1.5 text-sm rounded-md",
        active ? "bg-white shadow" : "bg-transparent hover:bg-white/70",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }> = ({ value, className, children, ...props }) => {
  const ctx = React.useContext(TabsContext);
  const active = ctx?.value === value;
  if (!active) return null;
  return (
    <div role="tabpanel" className={cx("mt-3", className)} {...props}>
      {children}
    </div>
  );
};
