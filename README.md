# TaskFlow - Task Management and Collaboration Tool

A full-stack task management app built with the T3 stack and extended for your assignment requirements.

## Stack

- Frontend: Next.js (Pages Router), TypeScript, Tailwind CSS
- API layer: tRPC
- Auth: NextAuth.js (Credentials - Email/Password)
- ORM: Prisma
- Database: Supabase PostgreSQL
- Serverless backend infra: SST (AWS Lambda + API Gateway scaffold)
- Testing: Vitest

## Features Implemented

1. Task Management Interface
- Create tasks with title, description, priority, project linkage
- List tasks with status and priority
- Update task status (TODO, IN_PROGRESS, DONE)
- Delete tasks
- Activity log entries for create/update/status/delete

2. User Profile and Preferences
- Profile page with name, title, bio
- Preferences: timezone and email alerts toggle
- Password change flow
- Personal stats (assigned tasks, owned projects)

3. Project Management
- Create projects with name, description, color
- List project members and task counts
- Ownership/membership model included in schema

4. Dashboard (Optional Requirement)
- Total tasks, completed, in-progress, overdue
- Upcoming deadlines
- Recent activity

5. Testing
- Unit tests for task utility logic
- Run with `npm run test`

## Project Structure

```text
src/
	pages/
		login.tsx
		register.tsx
		dashboard.tsx
		tasks.tsx
		projects.tsx
		profile.tsx
	server/
		api/routers/
			task.ts
			project.ts
			user.ts
			dashboard.ts
		auth.ts
prisma/
	schema.prisma
functions/
	health.ts
stacks/
	ApiStack.ts
sst.config.ts
```

## Environment Variables

Create `.env` from `.env.example`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NEXTAUTH_SECRET="replace-with-openssl-rand-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="replace-with-supabase-anon-key"
```

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client

```bash
npx prisma generate
```

3. Push schema to Supabase

```bash
npx prisma db push
```

4. Run app

```bash
npm run dev
```

Open:
- `http://localhost:3000` (or next available port shown by Next.js)

## AWS Backend (SST)

SST scaffold is included with a sample health endpoint.

Commands:

```bash
npm run sst:dev
npm run sst:deploy
```

Current SST route:
- `GET /health` -> `functions/health.handler`

You can extend this stack with task/project endpoints as needed.

## API Overview (tRPC)

- `user.register`, `user.me`, `user.update`, `user.changePassword`
- `project.list`, `project.create`, `project.update`
- `task.list`, `task.get`, `task.create`, `task.update`, `task.updateStatus`, `task.delete`
- `dashboard.stats`, `dashboard.recentActivity`, `dashboard.upcomingTasks`

## Tests

```bash
npm run test
```

## Important Note

If `prisma db push` fails with `P1000 Authentication failed`, your Supabase `DATABASE_URL` credentials are incorrect or expired. Use the latest Postgres connection string from:

Supabase Dashboard -> Project Settings -> Database -> Connection String.
