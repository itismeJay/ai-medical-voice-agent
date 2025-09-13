"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import AddSessionDetails from "./AddSessionDetails";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { SessionDetails } from "../medical-agent/[sessionId]/page";

export default function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetails[]>([]);

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    const result = await axios.get("/api/start-session?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
  };

  return (
    <div className=" mt-10">
      {historyList.length == 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 p-7 border-2 border-dashed rounded-2xl">
          <Image
            src={"/medical-assistance.png"}
            alt="No History"
            width={150}
            height={150}
          />
          <h2 className="font-bold text-xl mt-2">No Recent Consultation</h2>
          <p>It looks like you have no recent consultation</p>
          <AddSessionDetails />
        </div>
      ) : (
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
}
