# CloudDoc — Personal Document Manager

<<<<<<< Updated upstream
A full-stack web application for uploading, organising, and managing personal documents. Built for QUT IFN636 Assessment 1.2.
=======
A web-based document manager where users can upload, organise, and track personal files. Built as a full-stack app with a React frontend, Node/Express backend, and MongoDB Atlas for storage.

**Live:** http://13.211.74.4
>>>>>>> Stashed changes

---

## Features

<<<<<<< Updated upstream
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
=======
- Upload documents (PDF, DOCX, PNG, JPG, XLSX — up to 50 MB)
- Organise into folders and tag documents
- Soft delete with trash + restore
- Expiry date tracking with status badges (valid / expiring soon / expired)
- Version history on re-upload
- Search and filter by name, type, folder, and status
- Admin panel — user management, stats
- JWT auth with role-based access

---

## Stack

| | |
|---|---|
| Frontend | React 19 (Vite), Tailwind CSS v3, React Router DOM v7, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| File Storage | Local disk (multer) |
| CI/CD | GitHub Actions (self-hosted runner) |
| Deployment | AWS EC2, PM2, Nginx |

---

## Getting Started

**Prerequisites:** Node.js 20+, a MongoDB Atlas URI

```bash
# Clone
git clone https://github.com/angelicatanagras/personal-doc-manager.git
cd personal-doc-manager
```

**Backend**
```bash
cd backend
cp .env.example .env    # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev             # runs on http://localhost:5001
```

**Frontend**
```bash
cd frontend
npm install
npm run dev             # runs on http://localhost:5173
>>>>>>> Stashed changes
```

---

## Environment Variables

<<<<<<< Updated upstream
Create `backend/.env` based on `backend/.env.example`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/document-manager
JWT_SECRET=your_jwt_secret_here
=======
`backend/.env`:
```
PORT=5001
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/document-manager
JWT_SECRET=your_secret_here
>>>>>>> Stashed changes
```

---

<<<<<<< Updated upstream
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
=======
## Tests

```bash
cd backend
npm test    # mocha test suite
```

Tests cover auth, document CRUD, and admin endpoints.

---

## Project Structure

```
personal-doc-manager/
├── backend/
│   ├── controllers/    # auth, documents, folders, search, admin
│   ├── middleware/     # JWT auth, role check, file upload
│   ├── models/         # User, Document, Folder, Tag, DocumentVersion
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/ # Sidebar, DocumentCard, UploadModal, EditModal
│   │   ├── pages/      # Dashboard, AllDocuments, Folders, Tags, Trash, Profile, Admin
│   │   ├── context/    # AuthContext
│   │   └── axiosConfig.js
└── .github/workflows/ci.yml
```

---

## CI/CD

On every push, GitHub Actions (self-hosted on EC2):
1. Installs dependencies
2. Runs the test suite
3. Rebuilds and restarts services via PM2

Secrets stored in GitHub → Settings → Secrets: `MONGO_URI`, `JWT_SECRET`, `PROD`
>>>>>>> Stashed changes

---

## Branching Strategy

<<<<<<< Updated upstream
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
=======
`main` is production-only. All work is done on `feature/epicN-*` branches and merged via PR.

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
>>>>>>> Stashed changes
