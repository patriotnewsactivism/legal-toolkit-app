import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Plan = 'free' | 'pro' | 'enterprise';

export interface SubscriptionState {
  plan: Plan;
  setPlan: (p: Plan) => void;
  isPro: boolean;
  isEnterprise: boolean;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>('free');
  const value: SubscriptionState = {
    plan,
    setPlan,
    isPro: plan === 'pro' || plan === 'enterprise',
    isEnterprise: plan === 'enterprise',
  };
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within a SubscriptionProvider');
  return ctx;
}

export default SubscriptionContext;
