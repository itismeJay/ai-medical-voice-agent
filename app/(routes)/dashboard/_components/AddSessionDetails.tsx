"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Loader,
  LoaderCircle,
  LoaderPinwheelIcon,
} from "lucide-react";
import axios from "axios";
import AgentDoctorCard, { AgentDoctor } from "./AgentDoctorCard";
import { SuggestedDoctorsCard } from "./SuggestedDoctorsCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SessionDetails } from "../medical-agent/[sessionId]/page";

export default function AddSessionDetails() {
  const [clientNote, setClientNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<AgentDoctor[]>();
  const [selectedDoctor, setSelectedDoctor] = useState<AgentDoctor>();
  const [historyList, setHistoryList] = useState<SessionDetails[]>([]);

  const router = useRouter();

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    const result = await axios.get("/api/start-session?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
  };

  const { has, isSignedIn } = useAuth();
  const hasProPlan = (isSignedIn && has({ plan: "pro" })) ?? false;
  console.log(hasProPlan);

  const handleSubmit = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggest-doctors", {
      notes: clientNote,
    });
    console.log(result.data); // Handle the response as needed
    setSuggestedDoctors(result.data);
    setLoading(false);
  };

  const onStartConsultation = async () => {
    setLoading(true);
    // Here you can make an API call to start the consultation
    const result = await axios.post("/api/start-session", {
      notes: clientNote,
      selectedDoctor: selectedDoctor,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={!hasProPlan && historyList.length > 1}
          className="cursor-pointer"
        >
          + Consult with Doctor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How are you feeling today?</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div className="text-sm text-muted-foreground">
                <p>
                  Let me know what symptoms you're having — even something small
                  helps me understand how to assist you better.
                </p>
                <Textarea
                  onChange={(e) => setClientNote(e.target.value)}
                  className="mt-1 h-[200px] mb-4"
                  placeholder="Tell me what you're feeling — like headaches, fever, or anything unusual."
                />
              </div>
            ) : (
              <div>
                <h2 className="text-black mb-2 text-sm">
                  Select a Doctor for Consultation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Display the suggested doctors */}
                  {suggestedDoctors.map((doctor, index) => (
                    <SuggestedDoctorsCard
                      doctorAgent={doctor}
                      key={index}
                      setSelectedDoctor={() => setSelectedDoctor(doctor)}
                      selectedDoctor={selectedDoctor}
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button
              disabled={!clientNote || loading}
              type="submit"
              onClick={() => handleSubmit()}
            >
              Next
              {loading ? <Loader className="animate-spin" /> : <ArrowRight />}
            </Button>
          ) : (
            <Button
              disabled={!selectedDoctor || loading}
              className="cursor-pointer"
              onClick={() => onStartConsultation()}
            >
              Start Consultation{" "}
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <ArrowRight className="ml-2" />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
