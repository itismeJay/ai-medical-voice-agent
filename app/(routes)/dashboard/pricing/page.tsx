import React from "react";
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="w-full flex justify-center">
      <div className="px-10 md:px-30 lg:px-50 w-[1200px]">
        <h2 className="text-lg lg:text-2xl mb-4">
          Select Subscription
        </h2>
        <PricingTable />
      </div>
    </div>
  );
}
