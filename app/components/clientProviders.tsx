// components/ClientProviders.tsx
"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "@/app/Provider";
import { Toaster } from "@/components/ui/sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (  
    <ClerkProvider>
      <Provider>{children}</Provider>
      <Toaster />
    </ClerkProvider>
  );
}
