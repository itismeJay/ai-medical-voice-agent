import React from "react";
import { AgentDoctor } from "./AgentDoctorCard";
import Image from "next/image";
type Props = {
  doctorAgent: AgentDoctor;
  setSelectedDoctor: any;
  selectedDoctor?: AgentDoctor;
};

export function SuggestedDoctorsCard({
  doctorAgent,
  setSelectedDoctor,
  selectedDoctor,
}: Props) {
  return (
    <div
      className={`flex flex-col items-center p-4 my-2 border rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-blue-500 transition-shadow duration-200 ${
        selectedDoctor?.id === doctorAgent?.id
          ? "border-blue-500"
          : "border-gray-300"
      }`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent?.image}
        alt={doctorAgent?.specialist}
        width={100}
        height={100}
        className="w-[100px] h-[100px] rounded-full object-cover mb-1"
      />
      <h2 className="text-lg font-semibold text-black text-center">
        {doctorAgent?.specialist}
      </h2>
      <p className="text-sm mt-1 text-center text-gray-600 line-clamp-3">
        {doctorAgent?.description}
      </p>
    </div>
  );
}
