// src/components/PricingPlans.tsx
import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Plan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
};

const DEFAULT_PLANS: Plan[] = [
  { id: "basic", name: "Basic", price: "$0", features: ["1 project", "Community support"] },
  { id: "pro", name: "Pro", price: "$19/mo", features: ["Unlimited projects", "Priority support", "Export"], highlight: true },
  { id: "enterprise", name: "Enterprise", price: "Custom", features: ["Security reviews", "SLA", "Dedicated support"] },
];

export interface PricingPlansProps {
  plans?: Plan[];
  onSelect?: (planId: string) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ plans = DEFAULT_PLANS, onSelect }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((p) => (
        <Card key={p.id} className={p.highlight ? "ring-2 ring-black" : undefined}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{p.name}</CardTitle>
              {p.highlight ? <Badge>Popular</Badge> : null}
            </div>
            <CardDescription>{p.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {p.features.map((f, i) => (
                <li key={i} className="list-disc list-inside">{f}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onSelect?.(p.id)}>Choose {p.name}</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
