"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgentDoctor } from "../../_components/AgentDoctorCard";
import {
  ArrowRight,
  Circle,
  Loader,
  PhoneCall,
  PhoneOff,
  Voicemail,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

import { toast } from "sonner";

export type SessionDetails = {
  id: string;
  sessionId: string;
  notes: string;
  report: {
    sessionId?: string;
    agent: string;
    user?: string;
    timestamp: string;
    chiefComplaint: string;
    summary: string;
    symptoms: any[];
    duration: string;
    severity: string;
    medicationsMentioned: any[];
    recommendations: any[];
  };
  selectedDoctor: AgentDoctor;
  crearedBy: string;
  createdOn: string;
  // ← NO summary here at root level!
};

type Messages = {
  role: string;
  text: string;
};

export default function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>();
  const [callStarted, setCallStarted] = useState<boolean>(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loadingEnd, setLoadingEnd] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch session details when the component mounts
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    const result = await axios.get("/api/start-session?sessionId=" + sessionId);
    console.log(result.data);
    setSessionDetails(result.data);
  };

  const onStartCall = () => {
    setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const VapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hello, it’s a pleasure to connect with you today. May I kindly ask your full name and age, so I can address you with the utmost care and attention?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "lmnt",
        voiceId: sessionDetails?.selectedDoctor?.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetails?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };
    vapi.start(VapiAgentConfig as any);
    if (vapi) {
      vapi.on("call-start", () => {
        console.log("Call started");
        setCallStarted(true);
        setLoading(false);
      });
    }

    vapi.on("message", (message) => {
      const { role, transcript, transcriptType } = message;
      if (message.type === "transcript") {
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: role, text: transcript },
          ]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
        console.log(`${message.role}: ${message.transcript}`);
      }
    });

    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });
    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });
  };

  //optionally remove the listeners (good for memory management)
  //vapiInstance.off("call-start");
  // vapiInstance.off("call-end");
  //vapiInstance.off("message");

  //Reset call state

  const endCall = async () => {
    setLoadingEnd(true);
    if (!vapiInstance) return;

    vapiInstance.stop();
    setVapiInstance(null);

    // wait until report is generated
    const result = await GenerateReport();

    // now mark call as ended
    setCallStarted(false);
    setLoadingEnd(false);
    toast.success("Call ended. Generating report...");
    router.replace("/dashboard");
  };

  const GenerateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      messages: messages,
      sessionDetails: sessionDetails,
      sessionId: sessionId,
    });

    console.log("Report generated", result.data);
    return result.data;
  };

  return (
    <div className="border bg-neutral-100 border-neutral-200 rounded-lg shadow-sm p-2">
      <div className="flex items-center justify-between p-4">
        {sessionDetails ? (
          <>
            <h2 className="p-2 border rounded-lg px-2 flex items-center gap-3 fro">
              <Circle
                className={`w-4 h-4 rounded-full ${
                  callStarted ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {callStarted ? "Connected..." : "Not Connected"}
            </h2>
            <h2 className="font-semibold text-lg">00:00</h2>
          </>
        ) : (
          /*Skeletons */
          <>
            <div className="h-6 w-32 mt-4 rounded bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            <div className="h-6 w-32 mt-4 rounded bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
          </>
        )}
      </div>

      <div className="flex justify-center flex-col items-center mt-10">
        {sessionDetails ? (
          <>
            <Image
              src={sessionDetails?.selectedDoctor?.image}
              alt={sessionDetails?.selectedDoctor?.specialist}
              width={150}
              height={150}
              className="h-[120px] w-[120px] rounded-full object-cover"
            />
            <h2 className="text-lg mt-4">
              {sessionDetails?.selectedDoctor?.specialist}
            </h2>
            <p className=" text-neutral-500 text-sm">AI Medical Voice Agent</p>
          </>
        ) : (
          /*Skeleton for image and specialist */
          <>
            <div className="h-[120px] w-[120px] rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-6 w-32 mt-4 rounded bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            <div className="h-6 w-40 mt-4 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
          </>
        )}
        <div className="mt-10">
          <div className="text-gray-400 flex flex-col">
            {messages.slice(-4).map((message, index) => (
              <h2 key={index}>
                {message.role} : {message.text}
              </h2>
            ))}
          </div>
          {liveTranscript && liveTranscript?.length > 0 && (
            <h2 className="text-lg">
              {currentRole} : {liveTranscript}
            </h2>
          )}
        </div>

        {callStarted ? (
          <Button
            className="mt-30 mb-10 gap-2 py-5 px-3 cursor-pointer"
            onClick={endCall}
            variant={"destructive"}
            disabled={loadingEnd}
          >
            <PhoneOff />
            {loadingEnd ? "Processing..." : "End Call"}{" "}
            {loadingEnd ? <Loader className="animate-spin" /> : <ArrowRight />}
          </Button>
        ) : (
          <Button
            disabled={loading}
            className="mt-30 mb-10 gap-2 py-5 px-3 cursor-pointer"
            onClick={onStartCall}
          >
            <PhoneCall className={loading ? "animate-bounce" : ""} />
            {loading ? "Connecting..." : "Start Call"}{" "}
            {loading ? <Loader className="animate-spin" /> : <ArrowRight />}
          </Button>
        )}
      </div>
    </div>
  );
}
