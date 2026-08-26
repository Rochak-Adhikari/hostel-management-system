# HostelHub

<p align="center">
  <strong>A full-stack, role-based Hostel Management System built for college academic hostel operations using Next.js, Express, TypeScript, and MongoDB.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-completed-brightgreen" />
  <img src="https://img.shields.io/badge/next.js-16-black" />
  <img src="https://img.shields.io/badge/react-19-blue" />
  <img src="https://img.shields.io/badge/express-5-lightgrey" />
  <img src="https://img.shields.io/badge/mongodb-mongoose-green" />
  <img src="https://img.shields.io/badge/typescript-both%20sides-blue" />
  <img src="https://img.shields.io/badge/auth-JWT%20Cookies-orange" />
</p>

---

## 📌 Overview

**HostelHub** is a role-based web application designed to digitize and automate all core operations of hostel management. It supports three distinct user portals: **Admin**, **Student**, and **Guardian** — each equipped with tailored dashboards, data visualizers, and strict role-based access control.

Every feature in HostelHub is connected to real MongoDB collections via RESTful backend endpoints, eliminating paper-based administration, data redundancy, and manual record tracking.

---

## 👑 Roles & Portal Features

### 🏢 Admin Portal (`/admin`)
- **Real-Time Analytics Dashboard:** Stat cards for registered students, room capacity, revenue, pending complaints, and an interactive room occupancy grid.
- **Student Management:** Full CRUD (Create, Read, Update, Delete) on student accounts, room assignment status, search filters, and guardian link associations.
- **Guardian Management:** Directory of registered guardians with linked child profiles.
- **Room & Bed Management:** Room creation with capacity, floor, room type, and monthly fee details. Auto-managed bed allocation and occupied capacity counts.
- **Room Allocation:** Assign registered students to available beds with strict gender-segregated building enforcement (`A-` for Boys building, `B-` for Girls building).
- **Room Change Requests:** Review, approve, or reject student room transfer applications with custom admin notes.
- **Fee & Payment Management:** Record monthly fee bills, update payment statuses (`Paid`, `Unpaid`, `Overdue`), and view payment ledgers.
- **Complaint Handling:** Review all hostel complaints, filter by status, track submitter roles (`Filed by Student` vs `Filed by Guardian`), and update progress.
- **Visitor Logs:** Track visitor entry logs, view student-visitor links, and view real-time check-outs.
- **Notice Board Management:** Post, edit, and remove hostel announcements.
- **Leave Request Approvals:** Approve or reject student leave permission applications with custom admin notes.
- **Reports & Analytics Page:** Aggregated database statistics, fee status breakdowns, occupancy charts, and complaint summary analytics (`/api/v1/reports/summary`).

### 🎓 Student Portal (`/student`)
- **Personal Dashboard:** Real-time summary of assigned room, active fee dues, complaint status, visitor activity, and recent notice feed.
- **My Profile:** View personal details, contact info, assigned room/bed, fee status, and linked guardian info.
- **My Room & Roommates:** Detailed room overview, list of assigned roommates, hostel guidelines, and submission of **Room Change Requests**.
- **Fee Ledger:** Complete history of monthly fees, due dates, payment status badges, and outstanding balance summaries.
- **Complaints & Maintenance:** File maintenance or support tickets with category tags (`Plumbing`, `WiFi`, `Cleanliness`, etc.), track resolution status, and see submitter indicators.
- **Visitor Registration:** Log visiting guests (name, phone, purpose, check-in time) and perform **Check-out** when the visitor leaves.
- **Leave Applications:** Apply for hostel leave with date validation (`toDate` strictly after `fromDate`) and track approval status.
- **Hostel Notice Board:** Real-time feed of all official announcements with "New" indicators for recent posts.

### 🛡️ Guardian Portal (`/guardian`)
- **Guardian Dashboard:** High-level summary of the linked child's hostel status, room number, current fee status, active complaints, recent visitors, and notice feed.
- **Child Payment Ledger:** Read-only access to the linked child's fee history and payment statuses.
- **Child Complaints & Feedback:** View existing complaint tickets for the linked child AND submit new complaints on their behalf (`submittedByRole: "guardian"`).
- **Child Room Change Requests:** Read-only tracking of room transfer applications submitted by the child.
- **Child Leave Requests:** Read-only view of leave permission applications filed by the child and approval status.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (Minimalist black/white aesthetic, clean typography, responsive design system)
- **State Management & Data Fetching:** TanStack Query v5 (`useQuery`, `useMutation`, automatic cache invalidation)
- **Form Handling & Validation:** `react-hook-form` + `Yup` schemas
- **HTTP Client:** Axios configured with `withCredentials: true` for cookie propagation

### Backend
- **Runtime & Framework:** Node.js + Express 5 + TypeScript
- **Database & ODM:** MongoDB + Mongoose
- **Authentication & Security:** JWT (HTTP-only cookies + header fallback), bcrypt password hashing, CORS policy with credentials
- **Error Handling:** Custom `AppError` class with standardized JSON error envelopes

---

## 🔒 Security & Authorization Architecture

### Standardized API Response Envelope
Every backend API endpoint returns a consistent JSON payload structure:
```json
{
  "message": "Human readable summary message",
  "code": "success" | "<ErrorCode>",
  "status": "success" | "fail",
  "data": { ... } | null
}
```

### Data Ownership Verification (`assertCanAccessStudent`)
Guardians and Students are strictly isolated to their own records:
- **Students** can only fetch or modify their own user ID.
- **Guardians** are automatically restricted to their `linked_student` record. If a guardian attempts to query or modify another student's complaints, fees, or leave requests, the backend throws a `403 Forbidden` exception.

### Gender-Segregated Building Allocation
- Room numbers prefixed with `A-` represent the Boys building.
- Room numbers prefixed with `B-` represent the Girls building.
- Derived via regex validation on both frontend (Yup) and backend (Mongoose controllers), preventing gender mismatches during room allocation.

---

## 📂 Folder Structure

```
HostelHub/
├── backend/
│   ├── src/
│   │   ├── config/          — Database connection (Mongoose)
│   │   ├── controllers/     — Request handlers (User, Room, Allocation, Fee, Complaint, Notice, Visitor, RoomChangeRequest, LeaveRequest, Report)
│   │   ├── middleware/      — Auth middleware, errorHandler, assertCanAccessStudent
│   │   ├── models/          — Mongoose models (User, Room, Allocation, Fee, Complaint, Notice, Visitor, RoomChangeRequest, LeaveRequest)
│   │   ├── routes/          — Express routers mounted at /api/v1/*
│   │   ├── types/           — Enum types (Role, RoomType, ComplaintStatus, ErrorCodes)
│   │   └── utils/           — JWT utils, password hashing, bed allocation helpers
│   └── server.ts            — Express app entrypoint
│
└── frontend/
    ├── api/                 — Axios API modules (authapi, studentapi, roomapi, feeapi, complaintapi, visitorapi, noticeapi, roomChangeRequestApi, leaveRequestApi, reportapi)
    ├── app/
    │   ├── (auth)/          — Login, Register, Forgot Password, Resend OTP, Confirm OTP
    │   ├── admin/           — Admin management pages (Dashboard, Students, Guardians, Rooms, Payments, Complaints, Visitors, Notices, Room Requests, Leave Requests, Reports, Settings)
    │   ├── student/         — Student portal pages (Dashboard, My Profile, My Room, Fees, Complaints, Visitor Log, Leave Requests, Notices, Settings)
    │   └── guardian/        — Guardian portal pages (Dashboard, Payments, Complaints, Room Requests, Leave Requests, Settings)
    ├── components/          — Shared sidebars, modals, form inputs, status pills
    ├── schema/              — Yup validation schemas
    └── types/               — TypeScript interface definitions
```

---

## 📊 Complete Feature Matrix (100% Completed)

| Module | Backend REST API | Frontend Portal Pages | Database Integration | Status |
|---|---|---|---|---|
| **Auth & Security** | `POST /api/v1/auth/*` | `/login`, `/register`, `/settings` | MongoDB (`User`) | ✅ **100% Complete** |
| **Student Management** | `GET/POST/PUT/DELETE /api/v1/users` | `/admin/students`, `/student/my-profile` | MongoDB (`User`) | ✅ **100% Complete** |
| **Guardian Directory** | `GET /api/v1/users?role=guardian` | `/admin/guardians` | MongoDB (`User`) | ✅ **100% Complete** |
| **Room Inventory** | `GET/POST/PUT/DELETE /api/v1/rooms` | `/admin/rooms`, `/student/my-room` | MongoDB (`Room`) | ✅ **100% Complete** |
| **Room Allocation** | `GET/POST/DELETE /api/v1/allocations` | `/admin/students` | MongoDB (`Allocation`) | ✅ **100% Complete** |
| **Room Change Requests** | `GET/POST/PUT/DELETE /api/v1/room-change-requests` | `/admin/room-requests`, `/student/my-room`, `/guardian/room-requests` | MongoDB (`RoomChangeRequest`) | ✅ **100% Complete** |
| **Fee & Payments** | `GET/POST/PUT/DELETE /api/v1/fees` | `/admin/payments`, `/student/fees`, `/guardian/payments` | MongoDB (`Fee`) | ✅ **100% Complete** |
| **Complaints & Tickets** | `GET/POST/PUT/DELETE /api/v1/complaints` | `/admin/complaints`, `/student/complaints`, `/guardian/complaints` | MongoDB (`Complaint`) | ✅ **100% Complete** |
| **Visitor Logs** | `GET/POST/PUT/DELETE /api/v1/visitors` | `/admin/visitors`, `/student/visitor-log`, `/guardian/dashboard` | MongoDB (`Visitor`) | ✅ **100% Complete** |
| **Notice Board** | `GET/POST/PUT/DELETE /api/v1/notices` | `/admin/notices`, `/student/notices`, `/guardian/dashboard` | MongoDB (`Notice`) | ✅ **100% Complete** |
| **Leave Permission** | `GET/POST/PUT/DELETE /api/v1/leave-requests` | `/admin/leave-requests`, `/student/leave-requests`, `/guardian/leave-requests` | MongoDB (`LeaveRequest`) | ✅ **100% Complete** |
| **Analytics & Reports** | `GET /api/v1/reports/summary` | `/admin/dashboard`, `/admin/reports` | Database Aggregations | ✅ **100% Complete** |

---

## ⚡ Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017` or MongoDB Atlas URI

### 1. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostelhub
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Start the frontend application:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎓 Academic Credit

**Rochak Adhikari** — Bachelor of Computer Applications (BCA), 4th Semester (Project I)  
*MERN Stack Hostel Management System*
