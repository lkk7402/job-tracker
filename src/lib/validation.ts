import { z } from "zod";

export const JobSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type JobInput = z.infer<typeof JobSchema>;
