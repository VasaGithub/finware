# Roadmap

## Phase 1 — MVP (4 weeks, intensive)

### Week 1 — Foundations + backend MVP
**Goal**: Upload a CSV, parse it, store transactions. No frontend yet.

- [ ] Repo setup: pnpm workspaces, TypeScript, ESLint, Prettier
- [ ] Prisma + Postgres in Docker
- [ ] Schema implementation
- [ ] \`POST /imports\` endpoint accepting CSV
- [ ] CSV parser (papaparse) → CanonicalTransaction
- [ ] Fingerprint generation + dedup
- [ ] Basic auth (Auth.js, single user)
- [ ] PDF parser for primary bank (pdf-parse)
- [ ] Parser unit tests

### Week 2 — AI categorization + minimal frontend
**Goal**: Upload via web UI, AI categorizes, view transactions.

- [ ] Claude API integration + structured outputs
- [ ] Batch categorization
- [ ] Categorization cache
- [ ] User-defined rules (Rule model + matching logic)
- [ ] Next.js setup with Tailwind + shadcn/ui
- [ ] Login page + upload page + transactions table
- [ ] Manual category edit endpoint

### Week 3 — Dashboard, subscriptions, reports
**Goal**: Visual dashboard, subscription detection, monthly email report.

- [ ] Dashboard: KPIs, donut chart by category, monthly trend, top merchants
- [ ] Subscription detector (cron job)
- [ ] Monthly report HTML generator
- [ ] Resend integration
- [ ] Alert system (price changes, unusual spend)

### Week 4 — DevOps + polish
**Goal**: Deployed, CI/CD, portfolio-ready README.

- [ ] Production Dockerfiles (multistage)
- [ ] AWS EC2 + RDS provisioning
- [ ] GitHub Actions: test + build + deploy pipeline
- [ ] Logs (pino), healthchecks, Sentry
- [ ] README with screenshots + arch diagram
- [ ] Demo video (Loom 2-3 min)

## Phase 2 — Gmail integration (future)
- Add Gmail OAuth flow
- Cron: scan inbox for bank emails
- Reuse existing parsers
- New \`TransactionSource.GMAIL\` ingestion path

## Phase 3 — PSD2 / GoCardless (future)
- GoCardless Bank Account Data API integration
- OAuth flow with Spanish banks
- Token refresh logic
- New \`TransactionSource.PSD2\` ingestion path
- Multi-account support per bank

## Out of scope (intentionally)
- Multi-user / multi-tenant
- Mobile app
- Investment tracking (stocks, crypto)
- Budgeting / goal-setting features (might add in Phase 4)
