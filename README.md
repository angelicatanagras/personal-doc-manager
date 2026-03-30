# CloudDoc — Personal Document Manager

A full-stack web application for uploading, organising, and managing personal documents. Built for QUT IFN636 Assessment 1.2.

---

## Features

- Upload documents (PDF, JPG, PNG, DOCX, XLSX — max 50 MB)
- Organise into folders and tag documents
- Track document expiry dates with status badges
- Soft delete with 30-day trash recovery
- Version history on re-upload
- Search and filter by name, type, folder, date, and status
- Admin panel for user and storage management
- JWT-based authentication with role-based access control

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v3, React Router DOM v7 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcrypt |
| File Storage | Local disk (multer) |
| Process Manager | PM2 |
| Deployment | AWS EC2 (Ubuntu 22.04) |
| CI/CD | GitHub Actions |

---

## Running Locally

**Prerequisites:** Node.js 20+, MongoDB Atlas URI

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/document-manager
JWT_SECRET=your_jwt_secret_here
```

---

## Running Tests

```bash
cd backend
npm test
```

59 unit tests covering auth, document CRUD, and admin controllers. No database connection required.

---

## CI/CD Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs on every push:

1. **Backend tests** — `npm test` (mocha)
2. **Frontend build** — `npm run build` (Vite)
3. **Deploy to EC2** — SSH, `git pull`, rebuild, `pm2 restart all` *(on push to main only)*

---

## Deployment

Live URL: `http://13.211.74.4:3000`

Hosted on AWS EC2 (Ubuntu 22.04, t3.medium). Backend served via PM2 on port 5000, frontend served via `serve` on port 3000.

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready, merge via PR only |
| `feature/epic*` | One branch per epic |

All features merged into `main` via Pull Requests with descriptive commit messages referencing story IDs.

---

## Assessment

**Unit:** IFN636 — Cloud Computing and Software as a Service
**Assessment:** 1.2 — Full-Stack CRUD Application with DevOps Practices
**University:** Queensland University of Technology (QUT)
