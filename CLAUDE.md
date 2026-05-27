# Finware — Personal Finance Tracker

Personal finance tracker with manual upload (PDF/CSV), AI categorization,
and future Gmail/PSD2 integration. Single-user web app.

## Stack
- **Backend**: Node.js 20+ + Express + TypeScript (strict)
- **DB**: PostgreSQL 16 + Prisma ORM
- **Frontend**: Next.js 15 (App Router) + Tailwind + shadcn/ui
- **AI**: Anthropic Claude API for categorization
- **Auth**: Auth.js v5
- **Tests**: Vitest + Supertest
- **Package manager**: pnpm workspaces

## Repo structure
\`\`\`
apps/
  api/          ← Express backend
  web/          ← Next.js frontend
packages/
  shared/       ← shared TS types between api & web
docs/           ← architecture, roadmap, api docs
design/         ← Stitch-exported HTML/screens (reference only)
\`\`\`

## Key commands
- \`pnpm dev\` — start api + web in parallel
- \`pnpm test\` — run all tests
- \`pnpm lint\` — eslint + prettier check
- \`pnpm db:migrate\` — run Prisma migrations
- \`pnpm db:studio\` — open Prisma Studio
- \`docker compose up -d db\` — start local Postgres

## Coding conventions
- TypeScript strict mode, no \`any\` (use \`unknown\` if truly needed)
- All DB access through Prisma. **No raw SQL.**
- Services layer for business logic. Routes are thin (validation + service call + response).
- Validate request bodies with Zod schemas in \`src/schemas/\`.
- Errors: throw custom errors from \`src/lib/errors.ts\`, handled by global middleware.
- No \`console.log\` in committed code — use the \`pino\` logger.
- File naming: \`kebab-case.ts\` for files, \`PascalCase\` for React components.
- Commit messages in English, conventional commits format.

## Architectural rules (HARD constraints)
- **Source-agnostic ingestion**: parsers in \`services/parsers/\` MUST output the canonical
  \`CanonicalTransaction\` type. The rest of the system never knows the source.
- **Categorizer is independent**: never call the LLM directly from a route or parser.
  Always go through \`services/categorizer/\`.
- **Idempotent imports**: every transaction has a \`fingerprint\`. Re-importing the same
  file is a no-op, never duplicates.
- **No PII in logs**: never log full transaction descriptions or amounts. Use IDs.

## Design system
The visual design system is defined in \`DESIGN.md\` (root of repo).
Stitch-exported reference screens live in \`design/\`.
All UI components MUST follow these design tokens (colors, spacing, typography).
Never introduce ad-hoc values. When implementing a screen:
  1. Read \`DESIGN.md\` for tokens.
  2. Check \`design/<screen>.html\` for layout reference.
  3. Implement with shadcn/ui + Tailwind, respecting tokens.

## Data model (summary)
Core entities: \`User\`, \`Account\`, \`Transaction\`, \`Category\`, \`Subscription\`, \`Rule\`, \`Import\`.
Full schema in \`apps/api/prisma/schema.prisma\`. **Always read it before modifying.**

Key invariants:
- \`Transaction.fingerprint\` is unique per account (anti-duplication).
- \`Transaction.source\` ∈ {MANUAL_UPLOAD, GMAIL, PSD2}.
- Amounts: negative = expense, positive = income. Always \`Decimal(12,2)\`.

## Testing
- Unit tests live next to source: \`foo.ts\` + \`foo.test.ts\`.
- Integration tests in \`apps/api/tests/integration/\`.
- Always write tests for: parsers (new bank format), categorizer logic, fingerprint generation.

## Git workflow
- Branch from \`develop\`. Never commit to \`main\` directly.
- Branch naming: \`feat/...\`, \`fix/...\`, \`chore/...\`, \`docs/...\`.
- PRs require: passing CI + passing tests + updated docs if applicable.

## What NOT to do
- Don't add new dependencies without explicit approval.
- Don't change \`prisma/schema.prisma\` without creating a migration.
- Don't bypass the categorizer pipeline.
- Don't write SQL queries outside Prisma.
- Don't expose internal errors to API responses (use the error mapper).

## Out of scope (do not implement unprompted)
- Gmail integration (Phase 2, separate effort).
- PSD2 / GoCardless integration (Phase 3, separate effort).
- Multi-user / multi-tenant (single user for now).
- Mobile app (web only).

## When in doubt
Read \`docs/architecture.md\` for the why behind decisions.
Read \`docs/roadmap.md\` for what's planned.
Ask before introducing structural changes.
