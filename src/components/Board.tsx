"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Job, Status } from "@/generated/prisma/client";
import { Column } from "./Column";
import { updateJobStatus } from "@/lib/actions";

const COLUMNS: { status: Status; label: string; color: string }[] = [
  { status: "APPLIED", label: "Applied", color: "bg-blue-400" },
  { status: "INTERVIEW", label: "Interview", color: "bg-yellow-400" },
  { status: "OFFER", label: "Offer", color: "bg-green-400" },
  { status: "REJECTED", label: "Rejected", color: "bg-red-400" },
];

interface Props {
  jobs: Job[];
}

export function Board({ jobs }: Props) {
  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const newStatus = result.destination.droppableId as Status;
    const jobId = result.draggableId;

    const job = jobs.find((j) => j.id === jobId);
    if (!job || job.status === newStatus) return;

    await updateJobStatus(jobId, newStatus);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-4">
        {COLUMNS.map(({ status, label, color }) => (
          <Column
            key={status}
            status={status}
            label={label}
            color={color}
            jobs={jobs.filter((j) => j.status === status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
