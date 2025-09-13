import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetails } from "../medical-agent/[sessionId]/page";
import { Button } from "@/components/ui/button";
import moment from "moment";
import ViewReportDialog from "./ViewReportDialog";

type Props = {
  historyList: SessionDetails[];
};

function HistoryTable({ historyList }: Props) {
  return (
    <div>
      <h1 className="flex justify-center text-center items-center mb-4 text-md font-semibold">
        Previous Consultation
      </h1>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">AI Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((record: SessionDetails, index: number) => (
            <TableRow key={index || record.id}>
              <TableCell className="font-medium">
                {record?.selectedDoctor?.specialist}
              </TableCell>
              <TableCell>{record?.notes}</TableCell>
              <TableCell>
                {moment(new Date(record?.createdOn)).fromNow()}
              </TableCell>
              <TableCell className="text-right">
                <ViewReportDialog record={record} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
/**{historyList.length > 5 ? (
        <h1 className="flex justify-center text-neutral-500 hover:text-black  transition-colors duration-200 ease-in-out text-center items-center mb-4 text-sm cursor-pointer">
          Browse All Consultation
        </h1>
      ) : null} */
