"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { auth } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader } from "lucide-react";

export type AgentDoctor = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  subscriptionRequired: boolean;
};

type Props = {
  doctorAgent: AgentDoctor;
};

function AgentDoctorCard({ doctorAgent }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { has, isSignedIn } = useAuth();

  const hasProPlan = (isSignedIn && has({ plan: "pro" })) ?? false;
  console.log(hasProPlan);

  const onStartConsultation = async () => {
    setLoading(true);
    // Here you can make an API call to start the consultation
    const result = await axios.post("/api/start-session", {
      notes: "New Query",
      selectedDoctor: doctorAgent,
    });
    console.log(result.data);

    if (result.data?.sessionId) {
      console.log(result.data.sessionId);
      // Redirect to the medical voice agent page with the session ID
      router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
    }
    setLoading(false);
  };

  return (
    <div className="cursor-pointer mb-5 relative">
      {doctorAgent.subscriptionRequired && (
        <Badge className="absolute mt-2 right-2 p-1 px-2 items-center">
          Premium
        </Badge>
      )}
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        height={200}
        width={200}
        className="rounded-lg object-cover w-full shrink-0 h-[350px]"
      />
      <div className="px-1">
        <h2 className="text-xl mt-1 font-semibold">{doctorAgent.specialist}</h2>
        <p className="line-clamp-2 text-neutral-800">
          {doctorAgent.description}
        </p>
        <Button
          disabled={!hasProPlan && doctorAgent?.subscriptionRequired}
          className="w-full mt-2 cursor-pointer"
          onClick={onStartConsultation}
        >
          Start Consultation
          {loading ? <Loader className="animate-spin" /> : <ArrowRight />}
        </Button>
      </div>
    </div>
  );
}

export default AgentDoctorCard;
