// src/context/SubscriptionContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

export type PlanId = "basic" | "pro" | "ultimate" | null;

type SubscriptionState = {
  plan: PlanId;
  setPlan: (p: PlanId) => void;
  isPro: boolean;
  isUltimate: boolean;
};

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plan, setPlan] = useState<PlanId>(null);
  const value = useMemo(() => ({ plan, setPlan, isPro: plan === "pro" || plan === "ultimate", isUltimate: plan === "ultimate" }), [plan]);
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}