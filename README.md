# CloudDoc Personal Document Manager

CloudDoc is a full-stack personal document manager for uploading, organizing, previewing, and tracking important files. The app includes a React/Vite frontend, an Express API, MongoDB persistence, JWT authentication, role-based admin access, and local disk file storage.

**Live app:** http://x.x.x.x:5173

## Features

- User registration and login with JWT authentication
- Role-based access for standard users and admins
- Upload documents up to 50 MB
- Supported file types: PDF, JPG, PNG, DOCX, XLSX, and TXT
- Document metadata: custom name, folder, tags, and expiry date
- Expiry status tracking: `stored`, `valid`, `expiring`, and `expired`
- Dashboard views for all documents, expiring documents, trash, folders, tags, and profile
- Soft delete, restore, permanent delete, and download flows
- Folder creation, rename, delete, and document move support
- Inline preview metadata for supported document types
- Admin dashboard with user management and storage statistics

## Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Frontend     | React 19, Vite, React Router, Axios, Tailwind CSS |
| Backend      | Node.js, Express.js                               |
| Database     | MongoDB with Mongoose                             |
| Auth         | JWT, bcrypt                                       |
| File Uploads | multer, local disk storage                        |
| Tests        | Mocha, Chai, chai-http                            |
| Deployment   | AWS EC2, Nginx, PM2                               |

## Project Structure

```text
backend/
  adapters/          Storage adapter implementation
  config/            MongoDB connection
  controllers/       HTTP request handlers
  facades/           Higher-level document workflow facade
  middleware/        Auth, role, validation, and upload middleware
  models/            Mongoose schemas
  routes/            Express API routes
  services/          Business logic
  strategies/        Document-type behavior
  test/              Backend tests
  uploads/           Local uploaded files

frontend/
  src/
    components/      Reusable UI components
    context/         Auth state
    pages/           App and admin pages
    utils/           Frontend helpers
```

## Running Locally

### Prerequisites

- Node.js 20+
- npm
- MongoDB Atlas connection string or a local MongoDB instance

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The backend defaults to `http://localhost:5000` unless `PORT` is set. For local frontend proxying, set `PORT=5001` in `backend/.env` or update `frontend/vite.config.js`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

For local development, leave `VITE_API_BASE_URL` empty so Vite can proxy `/api/*` requests. To point the frontend at a deployed API, set:

```bash
VITE_API_BASE_URL=http://your-api-host:5001
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/document-manager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=
```

## API Overview

| Area      | Routes                                                                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth      | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `PUT /api/auth/profile`                                            |
| Documents | `GET /api/documents`, `POST /api/documents`, `GET /api/documents/:id`, `PUT /api/documents/:id`, `DELETE /api/documents/:id`                   |
| Trash     | `GET /api/documents/trash`, `PUT /api/documents/:id/restore`, `DELETE /api/documents/:id/permanent`                                            |
| Downloads | `GET /api/documents/:id/download`                                                                                                              |
| Folders   | `GET /api/folders`, `POST /api/folders`, `PUT /api/folders/:id`, `DELETE /api/folders/:id`, `PUT /api/folders/:id/move-document`               |
| Admin     | `GET /api/admin/stats`, `GET /api/admin/users`, `POST /api/admin/users`, `PUT /api/admin/users/:id`, suspend, activate, and delete user routes |

`/api/versions` and `/api/search` currently return placeholder responses.

## Running Tests

```bash
cd backend
npm test
```

The backend test suite covers authentication, document behavior, and admin endpoints.

## Build

```bash
cd frontend
npm run build
```

## Deployment Notes

The app is designed for deployment on an Ubuntu EC2 instance with:

- Nginx serving the frontend on port 80
- Express running as the backend API
- PM2 managing the backend process
- MongoDB Atlas used as the database
- Uploaded files stored on the server filesystem

Production deployments need `MONGO_URI`, `JWT_SECRET`, and a stable upload directory available to the backend process.

## Test Credentials

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| User  | `angel@angel.com` | `angel`  |
| Admin | `admin@admin.com` | `admin`  |

User login: http://3.27.160.54/login  
Admin login: http://3.27.160.54/admin/login

## Current Scope

CloudDoc is a full-stack CRUD application with authentication, document management, admin controls, and AWS deployment practices. Version history and standalone search endpoints are scaffolded but not complete.
