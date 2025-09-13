import React from "react";
import { AIDoctorAgents } from "@/shared/list";
import Image from "next/image";
import { Agent } from "http";
import AgentDoctorCard from "./AgentDoctorCard";

function DoctorAgentList() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold">AI Specialist Doctors</h2>
      <div className="grid [@media(max-width:500px)]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-5">
        {AIDoctorAgents.map((doctor, index) => (
          <div key={index}>
            <AgentDoctorCard doctorAgent={doctor} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorAgentList;
