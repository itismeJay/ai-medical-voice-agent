import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { SessionDetails } from "../medical-agent/[sessionId]/page";
import moment from "moment";
import { useUser } from "@clerk/nextjs";

type Props = {
  record: SessionDetails;
};

function ViewReportDialog({ record }: Props) {
  const { user } = useUser();
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-transparent text-black border-2 hover:bg-gray-200 hover:-translate-y-1">
            View Full Report
          </Button>
        </DialogTrigger>
        <DialogContent className="lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle asChild>
              <h2 className="text-center">Medical AI Voice Agent Report</h2>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-10">
                <h2 className="text-xl text-black lg:text-2xl font-semibold text-left">
                  Session Info
                </h2>
                <hr className="border-gray-500 mt-2 border-t-2" />

                <div className="grid grid-cols-2 text-left mt-2 gap-5">
                  <div>
                    <h2 className="text-md lg:text-lg text-black ">
                      Doctor:{" "}
                      <span className="font-semibold">
                        {record?.selectedDoctor?.specialist}
                      </span>
                    </h2>

                    <h2 className="text-md lg:text-lg text-black">
                      Consulted On:{" "}
                      <span className="font-semibold">
                        {moment(record?.createdOn).format("MMMM Do YYYY")}{" "}
                        <br />
                      </span>
                    </h2>
                    <h2 className="text-md lg:text-lg mb-10 text-black">
                      Time:{" "}
                      <span className="font-semibold">
                        {moment(record?.createdOn).format("h:mm a")}
                      </span>
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-md lg:text-lg text-black mb-2">
                      User/Patient:{" "}
                      <span className="font-semibold">
                        {user?.fullName || "Anonymous"}
                      </span>
                    </h2>
                    <h2 className="text-md lg:text-lg text-black">
                      Agent:{" "}
                      <span className="font-semibold">
                        {record?.selectedDoctor?.specialist} AI
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="mb-5">
                  <h2 className="text-xl text-black lg:text-2xl font-semibold text-left">
                    Chief Complaint
                  </h2>
                  <hr className="border-gray-500 mt-2 border-t-2" />
                  <p className="text-[15px] lg:text-lg mt-1 text-black px-4 mb-10 text-left">
                    {record?.report?.chiefComplaint}
                  </p>
                </div>

                <div className="mb-5">
                  <h2 className="text-xl text-black lg:text-2xl font-semibold text-left">
                    Summary
                  </h2>
                  <hr className="border-gray-500 mt-2 border-t-2" />
                  <p className="text-[15px] lg:text-lg mt-2 text-lg text-black px-4 mb-5 text-left">
                    {record?.report?.summary}
                  </p>
                </div>

                <div className="mb-5">
                  <h2 className="text-xl text-black lg:text-2xl font-semibold text-left">
                    Symptoms
                  </h2>
                  <hr className="border-gray-500 mt-2 border-t-2" />
                  <ul className="mt-2">
                    {record?.report?.symptoms?.map((symptom, index) => (
                      <li
                        key={index}
                        className="text-[15px] lg:text-lg list-disc ml-7 text-black"
                      >
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-5">
                  <h2 className="text-xl text-black lg:text-2xl font-semibold text-left">
                    Duration & Severity
                  </h2>
                  <hr className="border-gray-500 mt-2 border-t-2" />
                  <div className="grid grid-cols-2 text-left gap-5 ">
                    <h2 className="mt-3 text-[15px] lg:text-lg text-black">
                      Duration: <span>{record?.report?.duration}</span>
                    </h2>
                    <h2 className="mt-3 text-[15px] lg:text-lg text-black">
                      Severity: <span>{record?.report?.severity}</span>
                    </h2>
                  </div>
                  <hr className="border-gray-500 my-10 border-t-2" />
                </div>

                <div className="mb-5">
                  <h2 className="text-xl text-black lg:text-2xl font-semibold text-left">
                    Medications Mentioned
                  </h2>
                  <hr className="border-gray-500 mt-2 border-t-2" />
                  <ul className="mt-2">
                    {record?.report?.medicationsMentioned?.map(
                      (medication, index) => (
                        <li
                          key={index}
                          className="text-[15px] lg:text-lg list-disc ml-7 text-black"
                        >
                          {medication}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="mb-5">
                  <h2 className="text-xl text-black lg:text-2xl font-semibold text-left">
                    Recommendations
                  </h2>
                  <hr className="border-gray-500 mt-2 border-t-2" />
                  <ul className="mt-2">
                    {record?.report?.recommendations?.map(
                      (recommendation, index) => (
                        <li
                          key={index}
                          className="text-[15px] lg:text-lg list-disc ml-7 text-black"
                        >
                          {recommendation}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <p className="text-[13px] text-gray-600 italic mt-5 text-center">
                  <span className="text-black"> Disclaimer:</span> This report
                  is generated by an AI system and is intended for informational
                  purposes only. It should not be considered medical advice.
                  Please consult a licensed healthcare professional for an
                  accurate diagnosis and appropriate treatment.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewReportDialog;
