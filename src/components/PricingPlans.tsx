// src/components/PricingPlans.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/context/SubscriptionContext";

export const PricingPlans: React.FC<{ onSubscribe?: (plan: "basic" | "pro" | "ultimate") => void }>
= ({ onSubscribe }) => {
  const { plan, setPlan } = useSubscription();

  const subscribe = (p: "basic" | "pro" | "ultimate") => {
    setPlan(p);
    if (onSubscribe) return onSubscribe(p);
    // Replace with your backend checkout route (Stripe/PayPal/etc)
    const url = `/api/checkout?plan=${p}`; // placeholder
    try { window.location.href = url; } catch { /* no-op for SSR */ }
  };

  const PlanCard: React.FC<{
    id: "basic"|"pro"|"ultimate";
    title: string;
    price: string;
    blurb: string;
    features: string[];
    cta?: string;
    highlight?: boolean;
  }> = ({ id, title, price, blurb, features, cta = "Subscribe", highlight }) => (
    <Card className={`relative border ${highlight ? "border-primary shadow-lg" : ""}`}>
      {highlight && <Badge className="absolute -top-3 right-4">Most Popular</Badge>}
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between">
          <span>{title}</span>
          <span className="text-2xl font-bold">{price}<span className="text-sm font-normal">/mo</span></span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{blurb}</p>
      </CardHeader>
      <CardContent>
        <ul className="mb-4 list-disc pl-6 text-sm">
          {features.map((f) => <li key={f}>{f}</li>)}
        </ul>
        <Button className="w-full" onClick={() => subscribe(id)} disabled={plan === id}>{plan === id ? "Current Plan" : cta}</Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <PlanCard
        id="basic"
        title="Basic"
        price="$29"
        blurb="Individuals and activists starting out."
        features={["FOIA & State PRR generator","Know‑Your‑Rights ID card","PDF/PNG exports","Email support"]}
      />
      <PlanCard
        id="pro"
        title="Professional"
        price="$79"
        blurb="Power users, journalists, and solo attorneys."
        features={["Everything in Basic","Cease & Desist, Claims, Discovery","Bulk doc generation limits","Priority support"]}
        highlight
      />
      <PlanCard
        id="ultimate"
        title="Ultimate Bundle"
        price="$149"
        blurb="Full toolkit + Civil Rights Tool access."
        features={["Everything in Pro","Civil Rights Tool bundle","Org/team workspace","SSO-ready branding"]}
        cta="Subscribe & Bundle"
      />
    </div>
  );
};