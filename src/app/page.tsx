import { prisma } from "@/lib/prisma";
import { Board } from "@/components/Board";
import { AddJobForm } from "@/components/AddJobForm";

export default async function Home() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    APPLIED: jobs.filter((j) => j.status === "APPLIED").length,
    INTERVIEW: jobs.filter((j) => j.status === "INTERVIEW").length,
    OFFER: jobs.filter((j) => j.status === "OFFER").length,
    REJECTED: jobs.filter((j) => j.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          <AddJobForm />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No applications yet
            </h2>
            <p className="text-gray-500 text-sm">
              Click &ldquo;Add Job&rdquo; to track your first application.
            </p>
          </div>
        ) : (
          <Board jobs={jobs} />
        )}
      </main>
    </div>
  );
}
