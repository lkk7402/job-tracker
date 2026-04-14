"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Job, Status } from "@/generated/prisma/client";
import { JobCard } from "./JobCard";

interface Props {
  status: Status;
  jobs: Job[];
  label: string;
  color: string;
}

export function Column({ status, jobs, label, color }: Props) {
  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className={`flex items-center gap-2 mb-3`}>
        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          {label}
        </h2>
        <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          {jobs.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 min-h-24 rounded-xl p-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-gray-100" : "bg-gray-50"
            }`}
          >
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
