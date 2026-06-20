# NextPro Blog

NextPro Blog is a modern, responsive, real-time blogging platform built with **Next.js**, **Convex**, and **Better Auth**. It features instant reactivity, live presence indicators showing active readers, real-time commenting, post likes, image uploads, and full light/dark theme support.

---

## 🚀 Features

*   **Real-time Updates:** Real-time data sync for posts, likes, and comments powered by Convex.
*   **Live Presence Indicator:** See user facepiles representing who is currently viewing any specific blog post in real-time.
*   **Secure Authentication:** Secure session management using Better Auth integrated directly with Convex tables.
*   **Image Storage:** Seamless image uploads for articles stored on Convex file storage.
*   **Modern Design:** Sleek UI built with Tailwind CSS v4, Lucide icons, and light/dark theme switching.
*   **Blocking-free SSR:** Fully optimized Server-Side Rendering (SSR) pages utilizing React Suspense to avoid blocking page renders.

---

## 🛠️ Technology Stack

*   **Framework:** Next.js (App Router)
*   **Database & Backend:** Convex
*   **Authentication:** Better Auth (with `@convex-dev/better-auth` integration)
*   **Styling:** Tailwind CSS (v4) & Shadcn UI
*   **Icons:** Lucide React

---

## 📋 Getting Started

### 1. Prerequisites

Make sure you have Node.js and your package manager of choice (e.g., `pnpm`, `npm`, or `bun`) installed.

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Variables Configuration

Create a `.env.local` file in the root of the project and populate it with your configuration credentials:

```env
# Convex Settings
NEXT_PUBLIC_CONVEX_URL="https://your-deployment.convex.cloud"
NEXT_PUBLIC_CONVEX_SITE_URL="https://your-deployment.convex.site"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-better-auth-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4. Run the Convex Backend Development Server

Start the Convex dev server to run code generation and sync your schemas:

```bash
npx convex dev
```

This will automatically create your Convex deployment and generate helper files under `convex/_generated`.

### 5. Run the Frontend Development Server

Once Convex is running, start the Next.js local server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the blog.

---

## 📂 Project Structure

```
├── app/                  # Next.js App Router routes & Server Actions
│   ├── (shared-layout)/  # Pages wrapped with the shared Navigation bar
│   │   ├── blog/         # Blog feeds and article detail pages
│   │   └── create/       # Post creation editor
│   ├── api/              # API routes (including Better Auth endpoints)
│   └── actions.ts        # Server Actions (creation, auth flows, etc.)
├── components/           # React Components (divided into ui/ and web/)
├── convex/               # Convex schemas, mutations, queries, and auth configuration
├── lib/                  # Library configurations (auth client, server utilities, etc.)
└── public/               # Static assets
```
