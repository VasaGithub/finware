# Architecture

## High-level

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    INGESTION SOURCES                        │
│   [F1] Manual upload    [F2] Gmail (future)   [F3] PSD2     │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  ┌──────────────────┐
                  │   PARSERS        │  → CanonicalTransaction[]
                  └──────────────────┘
                            ↓
                  ┌──────────────────┐
                  │   CATEGORIZER    │  Cache → Rules → LLM
                  └──────────────────┘
                            ↓
                  ┌──────────────────┐
                  │   POSTGRESQL     │
                  └──────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   Dashboard          Email alerts         Monthly reports
\`\`\`

## Key decisions

### 1. Source-agnostic ingestion
**Decision**: All parsers output a canonical \`CanonicalTransaction\` shape. The rest of the system is unaware of origin.

**Why**: Lets us add Gmail (Phase 2) and PSD2 (Phase 3) without refactoring downstream code.

### 2. Categorization pipeline: Cache → Rules → LLM
**Decision**: Try exact-match cache first, then user-defined rules, then LLM call as last resort.

**Why**: 80% of transactions repeat. Avoids unnecessary LLM cost and latency.

### 3. Batch LLM calls
**Decision**: Send 20-50 transactions per LLM call instead of one-by-one.

**Why**: ~95% cost reduction and lower total latency.

### 4. Fingerprinting for idempotency
**Decision**: Each transaction has \`fingerprint = hash(date, amount, description)\`, unique per account.

**Why**: Re-uploading the same statement is safe. Idempotent imports are a core requirement.

### 5. Decimal for money
**Decision**: All amounts stored as \`Decimal(12, 2)\`, never \`Float\`.

**Why**: Floating point and money never mix. Standard practice.

### 6. Prisma over raw SQL
**Decision**: All DB access through Prisma. No raw SQL.

**Why**: Typesafe queries, clean migrations, productivity. Industry-standard.

### 7. Structured outputs from LLM
**Decision**: Force JSON schema output from Claude API.

**Why**: Reliability. Categorization must return predictable shape.

## Trade-offs accepted

- **No microservices**: monolithic backend. Justified by single-user scope and 4-week timeline.
- **No queue system (yet)**: cron jobs in-process. Move to BullMQ + Redis if scale demands.
- **No multi-tenancy (yet)**: schema is ready for it (\`userId\` everywhere) but auth assumes single user.
