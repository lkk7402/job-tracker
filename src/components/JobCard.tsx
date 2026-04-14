"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Job, Status } from "@/generated/prisma/client";
import { deleteJob } from "@/lib/actions";
import { useTransition } from "react";

interface Props {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: Props) {
  const [isPending, startTransition] = useTransition();

  const statusColors: Record<Status, string> = {
    APPLIED: "bg-blue-50 border-blue-200",
    INTERVIEW: "bg-yellow-50 border-yellow-200",
    OFFER: "bg-green-50 border-green-200",
    REJECTED: "bg-red-50 border-red-200",
  };

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded-lg border p-3 text-sm shadow-sm transition-shadow ${
            statusColors[job.status]
          } ${snapshot.isDragging ? "shadow-lg rotate-1" : ""} ${
            isPending ? "opacity-50" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {job.company}
              </p>
              <p className="text-gray-600 truncate">{job.role}</p>
            </div>
            <button
              onClick={() =>
                startTransition(() => deleteJob(job.id))
              }
              className="shrink-0 text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
              aria-label="Delete job"
            >
              ×
            </button>
          </div>

          {job.location && (
            <p className="mt-1 text-xs text-gray-500">📍 {job.location}</p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {new Date(job.createdAt).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
              })}
            </span>
            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View posting
              </a>
            )}
          </div>

          {job.notes && (
            <p className="mt-2 text-xs text-gray-500 line-clamp-2 border-t border-black/5 pt-2">
              {job.notes}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
}
