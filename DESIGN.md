# Finware Design System

> This file will be populated with design tokens exported from Google Stitch.
> Until then, use these placeholder values.

## Status
🚧 **Placeholder values** — to be replaced after Stitch design session.

## Brand
- **Name**: Finware
- **Tone**: Professional, calm, trustworthy. Not playful. Not corporate-stiff.
- **Target**: Personal use, single user. Dashboard-heavy.

## Color tokens (placeholder)

### Light mode
- `--background`: hsl(0 0% 100%)
- `--foreground`: hsl(222 47% 11%)
- `--primary`: hsl(222 47% 11%)
- `--primary-foreground`: hsl(210 40% 98%)
- `--muted`: hsl(210 40% 96%)
- `--muted-foreground`: hsl(215 16% 47%)
- `--border`: hsl(214 32% 91%)
- `--accent`: hsl(210 40% 96%)
- `--destructive`: hsl(0 84% 60%)
- `--success`: hsl(142 71% 45%)

### Dark mode (primary)
- `--background`: hsl(222 47% 11%)
- `--foreground`: hsl(210 40% 98%)
- `--primary`: hsl(210 40% 98%)
- `--muted`: hsl(217 33% 17%)
- `--muted-foreground`: hsl(215 20% 65%)
- `--border`: hsl(217 33% 17%)

## Typography
- **Font**: Inter (variable). Fallback: system-ui.
- **Mono**: JetBrains Mono. Fallback: ui-monospace.
- **Scale**: Tailwind defaults (text-xs to text-4xl).

## Spacing
- Tailwind defaults. Use multiples of 4 (`gap-2`, `p-4`, `space-y-6`).

## Borders & radii
- `--radius`: 0.5rem (8px). Use Tailwind `rounded-md` / `rounded-lg`.

## Components
- All interactive components from `shadcn/ui`.
- Charts: Recharts, themed with above tokens.
- Icons: lucide-react.

## Screens to design in Stitch
- [ ] Dashboard (overview with KPIs, charts, recent transactions)
- [ ] Upload statement (drag-drop, progress, results)
- [ ] Transactions list (table with filters, search, edit)
- [ ] Categories management
- [ ] Subscriptions list
- [ ] Monthly report
- [ ] Settings / accounts

## Update process
1. Generate screens in Stitch.
2. Export DESIGN.md from Stitch and merge into this file.
3. Save exported HTML/screens in `design/` folder.
4. Update `tailwind.config.ts` in `apps/web` to reflect tokens.
