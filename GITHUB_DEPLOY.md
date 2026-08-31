# Deploying InsightForge AI from GitHub

InsightForge AI is a full-stack React, Vite, Express, tRPC, Drizzle, and MySQL/TiDB application. GitHub Pages can host only the compiled frontend; it cannot run the Express API, OAuth callbacks, database access, file storage, or server-side AI procedures. For the complete application, push this repository to GitHub and deploy it to a Node-compatible host such as Manus WebDev, Render, Railway, Fly.io, or a comparable service. Manus hosting is already configured for this project.

## 1. Push the source to GitHub

Create an empty repository, then run these commands from the project root:

```bash
git init
git add .
git commit -m "Initial InsightForge AI application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Do not commit `.env`, database URLs, OAuth secrets, or API keys. The included `.gitignore` excludes local environment files and generated dependencies.

## 2. Install and verify locally

Use Node.js 22 or a compatible current Node release and pnpm:

```bash
corepack enable
pnpm install
pnpm check
pnpm test
pnpm build
```

Start development with:

```bash
pnpm dev
```

## 3. Configure production environment variables

Copy `.env.example` into the host's environment-variable settings. Values must be supplied by the selected host or connector; never put real credentials in GitHub.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MySQL/TiDB connection string used by Drizzle ORM. |
| `JWT_SECRET` | Secret used to sign authenticated sessions. |
| `VITE_APP_ID` | Manus OAuth application ID. |
| `OAUTH_SERVER_URL` | OAuth backend base URL. |
| `VITE_OAUTH_PORTAL_URL` | Frontend login-portal URL. |
| `OWNER_OPEN_ID` | Owner identity used by the application. |
| `OWNER_NAME` | Display name for the owner. |
| `BUILT_IN_FORGE_API_URL` | Server-side built-in AI/storage API URL. |
| `BUILT_IN_FORGE_API_KEY` | Server-side built-in AI/storage API key. |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend built-in API URL where required by the template. |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend-safe built-in API key where required by the template. |

## 4. Build and run on a Node host

The build command creates the Vite frontend and bundles the Express server:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

The application reads the host-provided `PORT`; do not hardcode a port. Run database migrations using the host's secure release or migration step after reviewing the generated Drizzle SQL. The repository's convenience script is:

```bash
pnpm db:push
```

## GitHub Pages limitation

If you specifically need a GitHub Pages demo, you would have to create a separate static-only frontend build and remove or replace authentication, database persistence, S3 storage, server-side AI, and tRPC procedures. That version would not provide the full InsightForge product. The recommended deployment is therefore GitHub for source control plus a Node-compatible application host for runtime services.

## Included product areas

The source contains the InsightForge analytics dashboard, CSV profiling and chart insights, PDF exports, product-photo visible-condition screening, Predictive Vending, Heritage QC, Academic Inbound, VeloRoute routing and traffic simulation, Language Lab, reviews and admin metrics, and the shared dark immersive dashboard shell.
