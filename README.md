# Artemis Beauty Salon

Production-ready Next.js 14 App Router project for **Artemis Beauty Salon**.

## Tech Stack

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- JSON content source (`content/site.json`)
- Docker / Docker Compose deployment support
- Cloudflare Tunnel reverse proxy support

## Project Structure

- `app/` routes and API handlers
- `components/` UI components
- `content/site.json` editable site content
- `public/` static assets (images/logo)
- `data/` runtime JSON storage:
  - `appointments.json`
  - `subscribers.json`

## Environment Variables

Copy and edit environment config:

```bash
cp .env.example .env.local
```

Minimum required for Cloudflare Tunnel deployment:

- `CLOUDFLARE_TUNNEL_TOKEN`

Recommended to set as well:

- `ADMIN_PANEL_PASSWORD`
- `ADMIN_PANEL_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000` (or next available port).

## Production (Without Docker)

```bash
npm ci
npm run build
npm run start
```

## Docker Deployment

### Build image

```bash
docker build -t artemis-beauty-salon:latest .
```

### Run container

```bash
docker run -d \
  --name artemis-beauty-salon \
  --env-file .env.local \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  artemis-beauty-salon:latest
```

## Docker Compose + Cloudflare Tunnel (Recommended)

This stack runs:

- `app` (Next.js production server)
- `cloudflared` (reverse proxy tunnel)

Set token (only mandatory variable for tunnel startup):

```bash
cp .env.example .env.local
# edit .env.local and set:
# CLOUDFLARE_TUNNEL_TOKEN=your-token
```

Start:

```bash
docker compose --env-file .env.local up -d --build
```

Stop:

```bash
docker compose down
```

Notes:

- App port is bound to localhost only: `127.0.0.1:3000`
- Public access should come through Cloudflare Tunnel domain
- `./data` is mounted into container for persistent appointments/subscribers

## Linux VM Deployment Steps

1. Install Docker + Docker Compose plugin.
2. Clone this repository.
3. Create `.env.local` from `.env.example`.
4. Set `CLOUDFLARE_TUNNEL_TOKEN`.
5. Run:

```bash
docker compose --env-file .env.local up -d --build
```

6. Verify containers:

```bash
docker compose ps
```

## GitHub Preparation

1. Ensure secrets are not committed:
   - `.env.local` is ignored.
2. Initialize git (if needed):

```bash
git init
```

3. Commit:

```bash
git add .
git commit -m "Prepare production deployment with Docker and Cloudflare Tunnel"
```

4. Create GitHub repo and push:

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

## Important Storage Note

This project currently stores runtime data in local JSON files under `data/`.

- Works for single-instance VM deployment.
- For scaling/high availability, migrate to a managed database (Postgres/Supabase/MySQL).
