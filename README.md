# CloudDoc — Personal Document Manager

A web-based document manager where users can upload, organise, and track personal files. Built as a full-stack app with a React frontend, Node/Express backend, and MongoDB Atlas for storage.

**Live:** http://13.211.74.4

| Page | URL |
|---|---|
| Login | http://13.211.74.4/login |
| Register | http://13.211.74.4/registration |
| Admin Login | http://13.211.74.4/admin/login |

### Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@admin.com | admin |
| User | angel@angel.com | angel |

---

## Features

- Upload documents (PDF, JPG, PNG, DOCX, XLSX — max 50 MB)
- Organise into folders and tag documents
- Expiry date tracking with status badges (valid / expiring soon / expired)
- Soft delete with trash + restore
- Version history on re-upload
- Search and filter by name, type, folder, date, and status
- Admin panel for user and storage management
- JWT-based authentication with role-based access control

---

## Tech Stack

| Layer           | Technology                                           |
| --------------- | ---------------------------------------------------- |
| Frontend        | React 19, Vite, Tailwind CSS v3, React Router DOM v7 |
| Backend         | Node.js, Express.js                                  |
| Database        | MongoDB Atlas (Mongoose ODM)                         |
| Auth            | JWT + bcrypt                                         |
| File Storage    | Local disk (multer)                                  |
| Process Manager | PM2                                                  |
| Deployment      | AWS EC2 (Ubuntu 22.04)                               |
| CI/CD           | GitHub Actions (self-hosted runner)                  |

---

## Running Locally

**Prerequisites:** Node.js 20+, MongoDB Atlas URI

```bash
# Terminal 1 — Backend (http://localhost:5001)
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
PORT=5001
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/document-manager
JWT_SECRET=your_jwt_secret_here
```

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover auth, document CRUD, and admin endpoints (mocha + chai).

---

## CI/CD Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs on every push:

1. **Install dependencies** — backend via yarn
2. **Run backend tests** — `npm test` (mocha)
3. **Deploy to EC2** — restarts services via PM2

Secrets stored in GitHub → Settings → Secrets: `MONGO_URI`, `JWT_SECRET`, `PROD`

---

## Deployment

Live URL: `http://13.211.74.4`

Hosted on AWS EC2 (Ubuntu 22.04). Backend on port 5001, frontend served through Nginx on port 80, process management via PM2.

---

## Branching Strategy

| Branch          | Purpose                             |
| --------------- | ----------------------------------- |
| `main`          | Production-ready, merge via PR only |
| `feature/epic*` | One branch per epic                 |

All features merged into `main` via Pull Requests with descriptive commit messages referencing story IDs.

```
feature/epic1-setup
feature/epic2-auth
feature/epic3-documents
feature/epic4-folders
feature/epic5-versions
feature/epic6-search
feature/epic7-dashboard
feature/epic8-admin
```

---

## Assessment

**Unit:** IFN636 — Software Life Cycle Management
**Assessment:** 1.2 — Full-Stack CRUD Application with DevOps Practices
**University:** Queensland University of Technology (QUT)
