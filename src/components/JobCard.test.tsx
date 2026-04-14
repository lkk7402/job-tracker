import { render, screen } from "@testing-library/react";
import { JobCard } from "@/components/JobCard";
import { Job } from "@prisma/client";

jest.mock("@/lib/actions", () => ({
  deleteJob: jest.fn(),
}));

const baseJob: Job = {
  id: "cltest123",
  company: "Atlassian",
  role: "Junior Software Engineer",
  status: "APPLIED",
  location: "Melbourne, VIC",
  url: "https://atlassian.com/careers/123",
  notes: "Referral from Jane",
  createdAt: new Date("2026-04-01T00:00:00Z"),
  updatedAt: new Date("2026-04-01T00:00:00Z"),
};

describe("JobCard", () => {
  it("renders the company name and role", () => {
    render(<JobCard job={baseJob} index={0} />);
    expect(screen.getByText("Atlassian")).toBeInTheDocument();
    expect(screen.getByText("Junior Software Engineer")).toBeInTheDocument();
  });

  it("renders the location", () => {
    render(<JobCard job={baseJob} index={0} />);
    expect(screen.getByText(/Melbourne, VIC/)).toBeInTheDocument();
  });

  it("renders a link to the job posting", () => {
    render(<JobCard job={baseJob} index={0} />);
    const link = screen.getByRole("link", { name: /View posting/i });
    expect(link).toHaveAttribute("href", "https://atlassian.com/careers/123");
  });

  it("renders the notes", () => {
    render(<JobCard job={baseJob} index={0} />);
    expect(screen.getByText("Referral from Jane")).toBeInTheDocument();
  });

  it("renders the delete button", () => {
    render(<JobCard job={baseJob} index={0} />);
    expect(screen.getByRole("button", { name: /Delete job/i })).toBeInTheDocument();
  });

  it("does not render a link when no URL is provided", () => {
    render(<JobCard job={{ ...baseJob, url: null }} index={0} />);
    expect(screen.queryByRole("link", { name: /View posting/i })).not.toBeInTheDocument();
  });

  it("does not render location when not provided", () => {
    render(<JobCard job={{ ...baseJob, location: null }} index={0} />);
    expect(screen.queryByText(/Melbourne/)).not.toBeInTheDocument();
  });
});
