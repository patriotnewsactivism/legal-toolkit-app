// src/App.tsx
import React from "react";
import LegalToolkitPro from "@/components/LegalToolkitPro";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

const App: React.FC = () => {
  return (
    <SubscriptionProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl py-6 px-4">
          <LegalToolkitPro />
        </div>
      </div>
    </SubscriptionProvider>
  );
};

export default App;
