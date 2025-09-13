import React from "react";
import { Button } from "@/components/ui/button";
import HistoryList from "./_components/HistoryList";
import DoctorAgentList from "./_components/DoctorAgentList";
import AddSessionDetails from "./_components/AddSessionDetails";

export default function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-2xl font-semibold">My Dashboard</h2>
        <AddSessionDetails />
      </div>
      <HistoryList />
      <DoctorAgentList />
    </div>
  );
}
