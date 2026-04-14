import { JobSchema } from "@/lib/validation";

describe("JobSchema", () => {
  it("accepts valid input with only required fields", () => {
    const result = JobSchema.safeParse({ company: "Atlassian", role: "Junior Engineer" });
    expect(result.success).toBe(true);
  });

  it("rejects empty company name", () => {
    const result = JobSchema.safeParse({ company: "", role: "Engineer" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.company).toContain("Company is required");
    }
  });

  it("rejects empty role", () => {
    const result = JobSchema.safeParse({ company: "Atlassian", role: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.role).toContain("Role is required");
    }
  });

  it("rejects a malformed URL", () => {
    const result = JobSchema.safeParse({
      company: "Atlassian",
      role: "Engineer",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.url).toContain("Must be a valid URL");
    }
  });

  it("accepts an empty URL (field is optional)", () => {
    const result = JobSchema.safeParse({ company: "Atlassian", role: "Engineer", url: "" });
    expect(result.success).toBe(true);
  });

  it("accepts a valid https URL", () => {
    const result = JobSchema.safeParse({
      company: "Atlassian",
      role: "Engineer",
      url: "https://atlassian.com/careers/123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all optional fields together", () => {
    const result = JobSchema.safeParse({
      company: "Canva",
      role: "Frontend Developer",
      location: "Sydney, NSW",
      url: "https://canva.com/jobs/1",
      notes: "Referral from Jane",
    });
    expect(result.success).toBe(true);
  });
});
