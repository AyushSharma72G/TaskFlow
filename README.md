# TaskFlow

## Monorepo Structure

```text
TaskFlow/
|- Backend/    # NestJS API + Prisma
|- frontend/   # React + Vite app
`- README.md
```

## Tech Stack

### Backend
- NestJS 11
- Prisma ORM
- PostgreSQL (configured via `DATABASE_URL`)
- Swagger UI (served from static OpenAPI JSON)
- Jest + Supertest

### Frontend
- React 19
- TypeScript
- Vite 8
- ESLint

## Current Implementation Snapshot

### Backend (`Backend/`)
- App boots on port `3000`
- Swagger docs exposed at:
	- `http://localhost:3000/api-docs`
	- `http://localhost:3000/api-docs/json`
- OpenAPI source file: `Backend/openapi/taskflow.swagger.json`
- Prisma schema includes:
	- `User`, `Project`, `ProjectMember`, `Task`, `ActivityLog`
	- Enums for roles, task status/priority, and activity actions

Note: The API runtime code is still at starter stage (`Hello World`) while the schema and OpenAPI spec describe the intended TaskFlow domain.

### Frontend (`frontend/`)
- Vite + React starter app is running
- No TaskFlow domain UI integrated yet

## Backend Architecture (Planned)

The backend should follow a modular, domain-driven structure under `Backend/src/`:

```text
src/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   └── utils/
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── dto/
│   │   ├── strategies/
│   │   └── auth.module.ts
│   ├── users/
│   ├── projects/
│   ├── tasks/
│   ├── ai/
│   └── activity-logs/
├── prisma/
│   └── prisma.service.ts
├── app.module.ts
├── main.ts
└── config/
	└── configuration.ts
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (recommended)

## Getting Started

### 1. Clone repository

```bash
git clone <your-repository-url>
cd TaskFlow
```

### 2. Install dependencies

```bash
cd Backend
npm install

cd ../frontend
npm install
```

## Environment Variables

### Backend

Create `Backend/.env` based on `Backend/.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskflow?schema=public"
```

### Frontend

`frontend/.env.example` currently exists but is empty.
Add values later when API base URL/auth providers are introduced.

## Database Setup (Prisma)

From `Backend/`:

```bash
npx prisma migrate dev
npx prisma generate
```

Optional:

```bash
npx prisma studio
```

## Run the Project

Use two terminals.

### Backend

From `Backend/`:

```bash
npm run start:dev
```

### Frontend

From `frontend/`:

```bash
npm run dev
```

## Available Scripts

### Backend (`Backend/package.json`)

- `npm run build`
- `npm run start`
- `npm run start:dev`
- `npm run start:debug`
- `npm run start:prod`
- `npm run lint`
- `npm run test`
- `npm run test:watch`
- `npm run test:cov`
- `npm run test:e2e`

### Frontend (`frontend/package.json`)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

## Testing

Backend tests (from `Backend/`):

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Branch Naming Convention

### Recommended Format

```text
<type>/<clickup-task-id>-<short-kebab-case-description>
```

### Allowed Types (use lowercase)

- `feature/` -> New features or major additions (e.g., auth, kanban, ai)
- `bugfix/` -> Bug fixes
- `hotfix/` -> Urgent production fixes (rare for this project)
- `refactor/` -> Code improvements without changing behavior
- `docs/` -> Documentation or README updates
- `chore/` -> Setup, config, or minor maintenance

### Rules

- Use lowercase letters only
- Separate words with hyphens (`-`)
- Include the ClickUp Task ID (e.g., `CU-12345` or just the number if your workspace uses short IDs)
- Keep the description short (3-6 words max)
- Branch off from `develop` (not `main`)

### Examples for TaskFlow

- `feature/CU-4567-setup-monorepo-prisma`
- `feature/CU-4589-implement-jwt-auth-with-oauth`
- `feature/CU-4612-build-kanban-board-with-dnd`
- `feature/CU-4623-add-ai-task-description-generator`
- `bugfix/CU-4651-fix-oauth-email-merge-edge-case`
- `refactor/CU-4678-improve-project-member-guards`
- `docs/CU-4701-update-readme-with-deployment-guide`

### How to create a branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/CU-4567-setup-monorepo-prisma
```

## Pull Request (PR) Creation Format

### PR Title Format

```text
<type>(CU-XXXXX): Short description of changes
```

### Examples

- `feature(CU-4589): Implement JWT auth with Google & GitHub OAuth`
- `feature(CU-4612): Add fully functional Kanban board with drag-and-drop`
- `feature(CU-4623): Integrate OpenAI smart task description generator`
- `bugfix(CU-4651): Fix OAuth edge case when email already exists`

## Suggested Development Workflow

1. Sync `develop`
2. Create branch using the naming convention above
3. Implement and test locally (backend + frontend)
4. Run lint and tests before pushing
5. Open PR with the required title format
