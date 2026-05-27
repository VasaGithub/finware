# Finware

Personal finance tracker with AI-powered categorization.

> 🚧 **Work in progress**. See [\`docs/roadmap.md\`](docs/roadmap.md).

## Stack

- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Frontend: Next.js 15 + Tailwind + shadcn/ui
- AI: Anthropic Claude API
- Infra: Docker, AWS (EC2 + RDS), GitHub Actions

## Quickstart

\`\`\`bash
# Prerequisites: Node 20+, pnpm, Docker

# Install dependencies
pnpm install

# Start database
docker compose up -d db

# Setup environment
cp .env.example .env
# Edit .env with your secrets

# Run migrations (after Prisma schema is in place)
pnpm db:migrate

# Start dev servers
pnpm dev
\`\`\`

## Documentation

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Design System](DESIGN.md)
