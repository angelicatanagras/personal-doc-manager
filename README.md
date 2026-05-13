# CloudDoc Personal Document Manager

CloudDoc is a full-stack personal document manager for uploading, organizing, previewing, and tracking important files. It uses a React/Vite frontend, an Express API, MongoDB persistence, JWT authentication, role-based admin access, and local disk file storage.

**Live app:** Deployment URL pending.

## Features

- User registration, login, and profile updates with JWT authentication
- Role-based access for standard users and admins
- Document uploads up to 50 MB
- Supported file types: PDF, JPG, PNG, DOCX, XLSX, and TXT
- Document metadata for custom name, folder, tags, and expiry date
- Expiry status tracking: `stored`, `valid`, `expiring`, and `expired`
- Document list filtering by search term, file type, folder, and sort option
- Dashboard, all documents, document detail, folders, tags, expiring soon, trash, and profile pages
- Soft delete, restore, permanent delete, and download flows
- Folder create, rename, delete, and move-document support
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
  adapters/          File storage adapter
  config/            MongoDB connection
  controllers/       HTTP request and response handlers
  errors/            Shared HTTP error type
  events/            Application event bus
  facades/           Controller-facing workflow APIs
  factories/         Document strategy factory
  listeners/         App event listener registration
  middleware/        Auth, role, validation, and upload middleware
  models/            Mongoose schemas
  routes/            Express API routes
  services/          Business logic
  strategies/        Document-type-specific behavior
  test/              Backend tests
  uploads/           Local uploaded files

frontend/
  src/
    components/      Reusable UI components
    context/         Auth state
    pages/           App and admin pages
    utils/           Frontend helpers
```

## Architecture Notes

The backend follows a layered structure:

- Routes define API endpoints and middleware.
- Controllers handle request and response flow.
- Facades expose simplified workflow methods to controllers.
- Services contain business logic.
- Models define MongoDB persistence.
- Strategies handle document-type-specific behavior.
- Adapters isolate file storage behavior.
- Events/listeners handle app-level side effects.

The document flow currently uses:

```text
documentRoutes -> documentController -> DocumentFacade -> DocumentService -> Document model/storage
```

## OOP and Design Patterns

**OOP concepts applied:**

- Classes and objects — service and error classes
- Encapsulation — business logic contained within service methods
- Abstraction — controllers call services without knowing implementation details
- Composition — `DocumentService` is composed of an adapter, strategy, and event bus
- Single Responsibility — controllers handle requests, services handle logic

**Design patterns applied:**

- **Chain of Responsibility** — Express middleware chain (auth → role → validation → controller)
- **Strategy** — per-file-type processing classes (PDF, image, text, default)
- **Simple Factory** — `documentStrategyFactory` selects the correct strategy at runtime
- **Adapter** — `LocalStorageAdapter` wraps disk operations behind a standard interface
- **Observer** — `appEventBus` emits events; listeners react independently
- **Facade** — `DocumentFacade` gives controllers a single entry point to the document subsystem

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

Set `PORT=5001` in `backend/.env` for the current frontend proxy configuration. The backend defaults to port `5000` if `PORT` is not set.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Leave `VITE_API_BASE_URL` empty for local proxy-based development. The Vite dev server will print the local frontend URL in the terminal.

To point the frontend at a deployed API, set:

```bash
VITE_API_BASE_URL=http://your-api-host:5001
```

## Environment Variables

Create your own MongoDB connection string in `backend/.env`; the app does not include a shared database.

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

| Area      | Routes                                                                                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth      | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `PUT /api/auth/profile`                                                                                                         |
| Documents | `GET /api/documents`, `POST /api/documents`, `GET /api/documents/:id`, `PUT /api/documents/:id`, `DELETE /api/documents/:id`                                                                                |
| Trash     | `GET /api/documents/trash`, `PUT /api/documents/:id/restore`, `DELETE /api/documents/:id/permanent`                                                                                                         |
| Downloads | `GET /api/documents/:id/download`                                                                                                                                                                           |
| Folders   | `GET /api/folders`, `POST /api/folders`, `PUT /api/folders/:id`, `DELETE /api/folders/:id`, `PUT /api/folders/:id/move-document`                                                                            |
| Admin     | `GET /api/admin/stats`, `GET /api/admin/users`, `POST /api/admin/users`, `PUT /api/admin/users/:id`, `PUT /api/admin/users/:id/suspend`, `PUT /api/admin/users/:id/activate`, `DELETE /api/admin/users/:id` |

`GET /api/documents` supports query parameters for `search`, `fileType`, `folderId`, and `sort`.

`/api/versions` and `/api/search` are scaffolded routes that currently return placeholder responses.

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

## CI/CD

The repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` for installing dependencies, building the frontend, running backend tests, and restarting PM2-managed services on a self-hosted runner.

Required GitHub Actions secrets:

- `MONGO_URI`
- `JWT_SECRET`
- `PROD`

## Deployment Notes

The app is designed for deployment on an Ubuntu EC2 instance with:

- Nginx serving the frontend
- Express running as the backend API
- PM2 managing the backend process
- MongoDB Atlas used as the database
- Uploaded files stored on the server filesystem

Production deployments need `MONGO_URI`, `JWT_SECRET`, and a stable upload directory available to the backend process.

## Demo Credentials

These credentials are intended for the deployed/demo database only.

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| User  | `angel@angel.com` | `angel`  |
| Admin | `admin@admin.com` | `admin`  |

## Current Scope

CloudDoc is a full-stack CRUD application with authentication, document management, folder support, admin controls, and AWS deployment practices.

Version history and standalone `/api/search` behavior are scaffolded but not complete. Document listing already supports basic search and filtering through `/api/documents`.
