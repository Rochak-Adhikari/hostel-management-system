# HostelHub

<p align="center">
  <strong>A hostel management system built as a college project (Project I), using the MERN-adjacent stack — MongoDB, Express, Next.js (React), and Node.js.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-yellow" />
  <img src="https://img.shields.io/badge/next.js-16-black" />
  <img src="https://img.shields.io/badge/express-5-lightgrey" />
  <img src="https://img.shields.io/badge/mongodb-mongoose-green" />
  <img src="https://img.shields.io/badge/typescript-both%20sides-blue" />
</p>

<p align="center">
  Private academic project. Not for public use or distribution.
</p>

---

## Overview

HostelHub is a role-based hostel management system with three user types — **Admin**, **Student**, and **Guardian** — each with their own dashboard and permissions. It handles room inventory, student registration, and the process of assigning students to rooms, with a gender-segregated building rule enforced at the allocation level.

The project intentionally scopes deep rather than wide: rather than shallowly stubbing every feature, the **Room** and **Allocation** modules are built fully end-to-end — real schema, real validation, real cross-collection business logic, real frontend wired to real endpoints — while other planned modules remain frontend-only scaffolding until backend work resumes on them.

---

## Roles & What Each Can Do

**Admin**
- Full CRUD on hostel rooms (create, edit, delete, view all)
- View and manage registered students (edit info, delete accounts)
- Assign a room to a student, or remove a student from their room
- Dashboard with real-time room/occupancy stats

**Student**
- Registers their own account (admin does not create student accounts manually)
- Views their assigned room, or a clear "not yet allocated" state
- Dashboard summarizing room status

**Guardian**
- Registers with guardian details captured at signup
- Dashboard intended to show their linked student's info and room *(linking mechanism not yet built — see Known Limitations)*

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **TanStack Query (React Query)** — all data fetching and mutations (`useQuery` for reads, `useMutation` for creates/updates/deletes, with cache invalidation on success)
- **react-hook-form + Yup** — form state and schema validation
- **Axios** — HTTP client, one dedicated API module per backend resource (`roomapi.ts`, `allocationapi.ts`, `studentapi.ts`, `authapi.ts`)

### Backend
- **Express 5** + **TypeScript**, run via `ts-node-dev`
- **MongoDB + Mongoose** — schema-level validation, `required`/`enum`/`match` constraints, and cross-field business rules handled in controllers where Mongoose validation alone can't express them
- **bcrypt** — password hashing
- Custom `AppError` class + centralized `errorHandler` middleware — every endpoint returns a consistent `{ message, code, status, data }` shape whether it succeeds or fails

---

## Architecture Notes

### Consistent response shape
Every API response — success or error — follows the same envelope:
```json
{
  "message": "...",
  "code": "success" | "<ErrorCode>",
  "status": "success" | "fail",
  "data": { ... } | null
}
```
This means the frontend never has to special-case parsing between endpoints.

### Gender-segregated room allocation
Rather than storing a separate `genderCategory` field on `Room` (which could drift out of sync with the room number itself), building assignment is **derived from the room number's prefix**: room numbers starting with `A-` are "Boys" building, `B-` are "Girls" building, enforced via a Mongoose `match` regex and mirrored in the frontend Yup schema. A small `getBuildingGender()` utility (duplicated once per codebase, since frontend and backend can't share files directly) reads this prefix wherever the rule needs to be checked or displayed.

### Allocation as the join between Student and Room
`Allocation` is a separate collection linking a `student` (User) to a `room` (Room), rather than a `room` field living directly on the User document. This is what makes occupancy counts trustworthy — `Room.Occupied` is incremented/decremented exactly once per allocation created/deleted, instead of being a manually-typed number an admin could get wrong.

Before an allocation is created, the backend checks, in order:
1. Does the room exist and have free capacity (`Occupied < Capacity`)?
2. Does the student exist?
3. Does the student's gender match the room's building (derived from room number prefix)?
4. Does the student already have a room allocated?

Only if all four pass does the allocation get created and the room's `Occupied` count increment.

### Session handling (current, minimal approach)
On successful login, the returned user object is stored in the browser's `localStorage`. Pages that need to know "who is currently logged in" (e.g. Student's My Room page, Guardian's dashboard) read it back from there. This is a deliberate simplification, not a production-grade auth pattern — see Known Limitations.

---

## Folder Structure

```
backend/
  src/
    models/         — Mongoose schemas (User, Room, Allocation; Complaint/Fee/Notice/Visitor scaffolded but empty)
    controllers/    — request handlers, one file per resource
    routes/         — Express routers, one file per resource
    middleware/     — AppError class, centralized errorHandler, (authMiddleware scaffolded but empty)
    utils/          — bcrypt helpers, room building-gender helper
    types/          — shared enums (Role, ErrorCodes, RoomType)
    server.ts        — app entrypoint, route mounting, middleware order

frontend/
  app/
    admin/          — rooms, students (incl. Assign Room), dashboard, + scaffolded complaints/payments/notices/visitors/reports
    student/        — dashboard, my-room, + scaffolded fees/complaints/notices/visitor-log
    guardian/       — dashboard, + scaffolded complaints/payments/leaves
    (auth)/         — login, register, forgot-password
  api/              — one Axios module per backend resource
  schema/           — Yup validation schemas
  utils/            — room building-gender helper (frontend copy)
  components/       — shared UI (sidebars, form inputs)
```

---

## What's Actually Working vs. What's Scaffolded

| Module | Backend | Frontend | Status |
|---|---|---|---|
| Auth (login/register) | ✅ | ✅ | Complete |
| Room CRUD | ✅ | ✅ | Complete, tested |
| Allocation (with gender rule) | ✅ | ✅ | Complete, tested |
| Student management | ✅ (view/edit/delete) | ✅ | Complete |
| Fee | ❌ | UI only, mock data | Not started |
| Complaint | ❌ | UI only, mock data | Not started |
| Notice | ❌ | UI only, mock data | Not started |
| Visitor | ❌ | UI only, mock data | Not started |
| Guardian-Student linking | Schema field exists (`linked_student`) | No UI to set it | Not started |

---

## Known Limitations

- **No real session/token system.** `localStorage` holds the logged-in user after login — functional for demo purposes, but not secure against client-side tampering. A production version would use HTTP-only cookies with signed JWT tokens.
- **No role-based route protection.** `authMiddleware.ts` exists as a file but is empty — nothing currently stops an unauthenticated or wrong-role request from hitting admin-only endpoints like room creation or student deletion.
- **Guardian dashboard shows "no student linked" for every account**, since nothing in the app currently sets the `linked_student` field — the schema supports it, but the admin UI to actually link a guardian to a student hasn't been built.
- **Complaint, Fee, Notice, and Visitor modules are frontend-only.** Their pages render, but every value shown is hardcoded, not fetched from a database.

---

## Development History Note

This project went through several rounds of debugging as it was built — field naming mismatches between frontend and backend (`RoomNumber` vs `roomNumber`), a missing shared utility file causing the entire backend to crash-loop silently, orphaned duplicate code from copy-pasting, and a few Express middleware ordering bugs. The Room and Allocation modules are the most thoroughly tested part of the codebase as a result — every CRUD path and every validation rule was verified manually via Postman before the frontend was connected to it.

---

<p align="center">
Rochak Adhikari — Project I, MERN Stack
</p>
