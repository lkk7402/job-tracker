# Job Tracker

A full-stack kanban board for tracking job applications — built with Next.js 16, TypeScript, and PostgreSQL.

**[Live Demo](https://job-tracker-i7ka.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-black?style=flat-square&logo=vercel)
![CI](https://github.com/lkk7402/job-tracker/actions/workflows/ci.yml/badge.svg)

---

## Features

- **Kanban board** — four columns: Applied, Interview, Offer, Rejected
- **Drag and drop** — move cards between columns to update application status
- **Add jobs** — modal form with validation (company, role, location, URL, notes)
- **Delete jobs** — remove applications with one click
- **Persistent** — all data stored in a cloud PostgreSQL database
- **Responsive** — works on desktop and mobile

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server Components + Server Actions keep database logic on the server — no separate API needed |
| Language | TypeScript | Catches type errors at build time, not at runtime |
| Database | PostgreSQL (Neon) | Industry-standard relational database, serverless-friendly via Neon |
| ORM | Prisma | Type-safe database queries generated from the schema — no raw SQL |
| Styling | Tailwind CSS 4 | Utility classes, no context switching between CSS and JSX |
| Drag & Drop | @hello-pangea/dnd | Accessible drag-and-drop, maintained fork of react-beautiful-dnd |
| Validation | Zod | Schema validation shared between client and server |
| Testing | Jest + React Testing Library | Unit tests for validation logic, component tests for UI |
| CI/CD | GitHub Actions + Vercel | Tests run on every push; passing builds auto-deploy to Vercel |

---

## How It Works

### Data flow (no traditional API)

Most full-stack apps have a separate backend API (Express, Django, etc.) that the frontend calls. This project uses **Next.js Server Actions** instead — async functions that run on the server and are called directly from the UI.

```
User fills form
  → clicks Save
    → Server Action runs on the server (createJob)
      → Prisma validates + writes to PostgreSQL (Neon)
        → revalidatePath("/") tells Next.js to refresh the page
          → Updated board appears
```

### Database schema

One table, five fields that matter:

```
Job
├── id        (auto-generated unique ID)
├── company   (required)
├── role      (required)
├── status    APPLIED | INTERVIEW | OFFER | REJECTED
├── location  (optional)
├── url       (optional)
└── notes     (optional)
```

Prisma generates TypeScript types from this schema, so if you typo a field name in your code, TypeScript catches it before it hits the database.

### Validation

A Zod schema defines the rules for a valid job entry (e.g. company can't be empty, URL must be a real URL). This schema is imported by both:
- The **server action** — to validate data before writing to the database
- The **tests** — to verify the validation rules work correctly

### Drag and drop

When a card is dropped into a new column, `onDragEnd` fires and calls the `updateJobStatus` server action with the job ID and the new status. Prisma updates one row in the database, and Next.js refreshes the page.

---

## Running Locally

**Prerequisites:** Node.js 20+, a PostgreSQL database (free tier at [neon.tech](https://neon.tech))

```bash
git clone https://github.com/lkk7402/job-tracker.git
cd job-tracker
npm install
```

Create a `.env` file:

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

Set up the database and start the dev server:

```bash
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tests

```bash
npm test          # run all tests once
npm run test:watch  # re-run on file save
```

**What's tested:**

- `src/lib/validation.test.ts` — 7 unit tests for the Zod schema (valid input, missing fields, invalid URLs)
- `src/components/JobCard.test.tsx` — 7 component tests (renders company/role, location, posting link, notes, delete button)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Server Component — fetches jobs, renders board
│   ├── layout.tsx        # Root layout
│   └── error.tsx         # Error boundary
├── components/
│   ├── Board.tsx         # DragDropContext wrapper
│   ├── Column.tsx        # Droppable column
│   ├── JobCard.tsx       # Draggable job card
│   └── AddJobForm.tsx    # Modal form with useActionState
└── lib/
    ├── actions.ts        # Server Actions (create, updateStatus, delete)
    ├── prisma.ts         # Prisma client singleton
    └── validation.ts     # Zod schema (shared by actions + tests)
prisma/
├── schema.prisma         # Database schema + migrations config
└── migrations/           # SQL migration history
```

---

## Deployment

The app auto-deploys to Vercel on every push to `master`. GitHub Actions runs the test suite first — a failing test blocks the deployment.

Required environment variable on Vercel:

```
DATABASE_URL=<your Neon connection string>
```
