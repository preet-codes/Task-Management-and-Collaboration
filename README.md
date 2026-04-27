# TaskFlow – Task Management & Collaboration App

A full-stack task management system built with the **T3 Stack** and extended with **AWS serverless deployment** for backend demonstration.

# Live Application

**Frontend (Vercel):**
https://taskforceprateek.vercel.app/

**AWS Backend (Health Check API):**
https://lw708thw82.execute-api.ap-south-1.amazonaws.com/health

# Overview

TaskFlow is a collaborative task management application that enables users to:

* Create and manage tasks
* Assign and track task status
* Manage user profiles
* View dashboards and analytics
* Collaborate across projects

The system is designed with **modern full-stack architecture** using serverless principles.

# Tech Stack

## Frontend

* Next.js (Pages Router)
* TypeScript
* Tailwind CSS
* Framer Motion (UI animations)

## API Layer

* tRPC (type-safe APIs)

## Authentication

* NextAuth.js (Credentials-based login)

## Database

* PostgreSQL via Supabase
* Prisma ORM

## Cloud & Deployment

* Vercel (Frontend + Serverless APIs)
* AWS (SST for Lambda + API Gateway)


# Architecture

```
User → Vercel (Next.js + tRPC)
             ↓
        Prisma ORM
             ↓
     Supabase PostgreSQL

AWS (SST)
↓
Lambda → API Gateway → /health
```


#  Features

## 1. Task Management

* Create tasks with title, description
* Update task status (TODO, IN_PROGRESS, DONE)
* Delete tasks
* Track progress visually

## 2. User Authentication

* Signup with email/password
* Secure login via NextAuth
* Session-based authentication

## 3. Dashboard

* View all tasks
* Status-based UI (color-coded)
* Real-time updates

## 4. Profile Management

* View user info
* Extendable for preferences

## 5. Serverless Backend (AWS)

* Lambda function deployed via SST
* API Gateway exposed endpoint
* `/health` route for backend validation

# Deployment Strategy

## Why Vercel?

Vercel is used for the main application because:

* Native support for Next.js (SSR, API routes)
* Automatic scaling using serverless functions
* Zero-config deployments via GitHub
* Built-in CDN for global performance

## Why AWS (SST)?

AWS SST is used to demonstrate:

* Serverless backend deployment
* Infrastructure-as-Code
* Lambda + API Gateway integration

### Implemented:

* `/health` endpoint via Lambda
* Deployed using SST stack

 This satisfies the requirement of:

```txt
Deploying backend on AWS using serverless architecture
```


##  Why Hybrid Architecture?

Instead of forcing everything into AWS:

* Vercel handles **Next.js efficiently**
* AWS demonstrates **backend capability**


# Local Setup

## 1. Install dependencies

```bash
npm install
```

---

## 2. Setup environment variables

Create `.env` file:

```env
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 3. Prisma setup

```bash
npx prisma generate
npx prisma db push
```

---

## 4. Run app

```bash
npm run dev
```

# AWS Deployment (SST)

## Deploy backend:

```
npx sst deploy
```

## Endpoint:

```txt
GET /health
```

Returns:

```json
{
  "ok": true,
  "service": "taskflow-api"
}
```

---

# Security

* Environment variables are NOT committed
* Secrets handled via:

  * Vercel environment variables
  * AWS credentials (local config)
* Passwords hashed using bcrypt

---

# Scalability

## Vercel

* Serverless auto-scaling
* Global edge CDN

## Supabase

* Managed PostgreSQL
* Connection pooling

## AWS

* Lambda auto-scales per request


# Author - 

**Prateek Setia**
