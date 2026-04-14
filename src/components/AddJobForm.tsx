"use client";

import { useActionState, useState } from "react";
import { createJob, ActionResult } from "@/lib/actions";

export function AddJobForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (prev, formData) => {
      const result = await createJob(prev, formData);
      if (result.success) setOpen(false);
      return result;
    },
    null
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Add Job
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Add New Job</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <Field
            label="Company *"
            name="company"
            placeholder="e.g. Atlassian"
            error={state?.success === false ? state.errors.company?.[0] : undefined}
          />
          <Field
            label="Role *"
            name="role"
            placeholder="e.g. Junior Software Engineer"
            error={state?.success === false ? state.errors.role?.[0] : undefined}
          />
          <Field
            label="Location"
            name="location"
            placeholder="e.g. Melbourne, VIC"
          />
          <Field
            label="Job posting URL"
            name="url"
            type="url"
            placeholder="https://..."
            error={state?.success === false ? state.errors.url?.[0] : undefined}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Referral contact, salary range, etc."
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {pending ? "Saving..." : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-colors ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-gray-200 focus:border-blue-400"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
