"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Status } from "@/generated/prisma/client";
import { JobSchema } from "@/lib/validation";

export type ActionResult =
  | { success: true }
  | { success: false; errors: Record<string, string[]> };

export async function createJob(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    company: formData.get("company") as string,
    role: formData.get("role") as string,
    location: (formData.get("location") as string) || undefined,
    url: (formData.get("url") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = JobSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await prisma.job.create({
    data: {
      ...result.data,
      url: result.data.url || null,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateJobStatus(id: string, status: Status) {
  await prisma.job.update({ where: { id }, data: { status } });
  revalidatePath("/");
}

export async function deleteJob(id: string) {
  await prisma.job.delete({ where: { id } });
  revalidatePath("/");
}
