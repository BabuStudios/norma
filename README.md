# NORMA

A bilingual (Swedish / English) web application that guides a small-to-mid-size
company through building and maintaining an integrated **ISO 9001** (quality) +
**ISO 14001** (environment) management system.

The core is a clause-by-clause requirement walkthrough: for every requirement in
chapters 4–10 the user gets a plain-language explanation, numbered steps to tick
off, and a list of the evidence an auditor will ask for. Around that sit the
operational registers a certified company has to keep — documents, environmental
aspects, internal audits, suppliers, management review, a mobile field mode, and
a GDPR / permissions screen.

Primary users are the quality and environment manager at a 10–50 person company,
a small QHSE team, and consultants managing several client companies (hence the
client switcher in the sidebar).

This installation is set up for **Awimex International**, with every register
empty — see *Company data vs. product content* below.

## Running it

```bash
npm install
npm run dev        # development server
npm run build      # typecheck + production build
npm run preview    # serve the production build
npm run typecheck
npm run lint
npm test           # run the suite once
npm run test:watch # re-run on change
```

Node 20 or later. CI runs typecheck, lint, test and build on every pull request
(`.github/workflows/ci.yml`), with lint held to zero warnings.

## Deploying

`vercel.json` configures the two things a Vite single-page app needs on Vercel:

- a rewrite sending anything that is not a real file to `index.html`, so a deep
  link like `/requirements/6.1.2` or `/suppliers/kemipartner-nordic` loads the
  app instead of 404ing (Vercel checks the filesystem before applying rewrites,
  so `/assets`, `/fonts` and `/favicon.svg` still serve directly);
- immutable, year-long caching for the fingerprinted assets and the fonts.

Vercel auto-detects Vite, so no build settings are needed — import the
repository in the Vercel dashboard and it builds with `npm run build` and serves
`dist`. Connecting the repository is preferable to a one-off upload: every push
redeploys, and preview deployments come with each pull request.

## Stack

React 19, TypeScript and Vite, with `react-router-dom` for routing. Styling is
plain CSS: a vendored copy of the Modernist design system plus CSS Modules per
component. There is no UI library and no CSS framework — the design system is
specific enough that one would only get in the way.

## How it is laid out

```
src/
  app/navigation.ts     sidebar structure and route paths
  components/           app shell, sidebar, header, and the shared primitives
  data/                 the requirements catalogue and the sample registers
  domain/               derived logic: conformity scoring, evidence classification
  hooks/                useDismissable — Escape / outside-click for popups
  i18n/dictionary.ts    every interface string, in both languages
  screens/              one component + CSS module per screen
  state/                the application store and its provider
  styles/               modernist.css (design tokens) and app.css (the app layer)
public/fonts/           self-hosted Archivo
```

### Design system

`src/styles/modernist.css` is the token source of truth, vendored from the design
handoff. Its non-negotiables: **zero border radius anywhere**, flush-left
alignment, 2px dividers between major sections, red used sparingly (primary
action and small emphasis only), Archivo throughout.

`src/styles/app.css` sits on top and holds the patterns that repeat across
screens — micro labels, section headers, data tables, status pills, tick boxes,
segmented controls. Row washes are named there once (`--ink-4` … `--ink-80`) so
`color-mix()` stays out of the component files. Anything screen-specific lives in
that screen's CSS module.

### Language

Both languages are authored, not machine-translated. `src/i18n/dictionary.ts`
types the English dictionary against the Swedish one, so a missing translation is
a build error rather than a blank label. The clause catalogue carries its own
`sv` / `en` pair per requirement.

Switching language also sets `<html lang>`, so screen readers and the browser's
own language handling follow.

### State

`src/state/store.ts` documents the shape. Everything is client-side in this
build and persists to `localStorage`; the slices split three ways in production:

| Slice | Belongs to |
| --- | --- |
| `lang`, `supplierColumns` | user preference |
| `statuses`, `steps`, `auditChecks`, `reviewChecks` | per-organization data behind the API, each write landing in the append-only change log |
| `supplierOverrides` | disappears — saving a supplier posts to the API and the table re-reads the record |

Clause status drives the two dashboard counts, the not-met dropdowns, the chapter
bars and the tree status dots, live.

The requirements catalogue itself is static and versioned per standard edition,
so it ships with the app rather than coming from the API.

## Tests

Vitest and Testing Library, running in jsdom. Tests sit next to what they cover.

The unit tests pin the logic that the screens read from: conformity scoring
(a met clause counts one, one in progress a half, an unassessed one nothing),
evidence classification, and supplier resolution with its overrides. Two suites
guard the content itself — the catalogue's ids are unique and its step and
evidence arrays stay parallel across languages, because `evidenceRows()` indexes
the Swedish array while rendering the English one; and the dictionary has no
empty strings and is not quietly the same text twice.

`src/data/emptyState.test.ts` holds the line described under *Company data vs.
product content*: each company register ships empty, each piece of product
content survives, and no clause arrives pre-assessed. It exists so nobody
re-seeds demo data by accident.

The integration tests drive the real screens through the real store: opening and
dismissing the dashboard dropdowns, clause status flowing into the tree and the
evidence states, step ticking staying per clause rather than per position,
search and filtering, and the supplier column menu — including that the detail
aside asks for a selection instead of crashing on an empty register. A
parameterised suite renders every screen in both languages.

What they deliberately do not cover: layout and the responsive breakpoints. jsdom
has no CSS, so those were verified by driving the built app in Chromium — worth
repeating by hand when the design changes.

## Compliance constraints

**Do not reproduce ISO or SIS standard text.** Every requirement explanation in
`src/data/clauses.ts` is an original paraphrase; only clause numbers are cited.
The standards are copyrighted and licensed through SIS. The requirement detail
pane carries a disclaimer saying so — keep it there, and keep any new requirement
text in the same register.

The GDPR screen is not decoration. The retention periods, legal bases, EU-only
storage, subject access and erasure, and the immutable append-only change log are
product requirements. The "Ändringslogg (spårbar)" screen depends on that log
existing server-side; it must not be reconstructed on the client.

Signatures and approvals are BankID-backed, logged with time and identity.

## Differences from the prototype

The handoff shipped a desktop-only HTML prototype. This implementation keeps its
copy, layout and interaction model, and adds what production needs:

- **Routing.** Every screen has a URL, and the selected requirement and supplier
  are part of it, so views can be linked and shared.
- **Dismissable popups.** The dashboard not-met lists and the supplier column
  menu close on Escape and on an outside click, not only on selection.
- **Real tables.** The registers are `<table>` markup on a fixed layout rather
  than CSS grids, so column headers, row headers and reading order are correct
  for assistive tech. The design's column widths are preserved through
  `<colgroup>`.
- **Real form controls.** Tick boxes are checkboxes with the input visually
  hidden — the pattern the design system already uses — so they stay keyboard
  operable and expose their state. Rows that toggle are `<label>` elements.
- **Responsive.** Below 1100px the sidebar collapses to a drawer (hidden, not
  merely off-screen, so it leaves the tab order) and the two-pane screens fold
  into list → detail. Field mode keeps its two phone frames: it documents what
  staff see on site rather than being the app's own mobile view.
- **Self-hosted fonts.** Archivo ships as two variable-weight woff2 subsets
  instead of a Google Fonts request.
- **Consistent evidence types.** The prototype derived the evidence type chip
  from the localized label, so a requirement could show "Register" in Swedish and
  "Document" in English. It is now derived from the Swedish label, which is the
  catalogue's source language, and reads the same in both.
- **A live sidebar badge.** The badge slot carries the number of requirements not
  yet met. The prototype left it empty.

## Company data vs. product content

The installation is set up for one company, **Awimex International**, with
nothing entered yet. Two kinds of content live in `src/data`, and the line
between them matters when adding anything:

**The company's, and therefore empty.** Documents, environmental aspects, the
audit programme and its checklists, suppliers, the change log, the field walk
and its tasks, the next external audit, the next review meeting. Every screen
shows an empty state naming what the register is for and what the first step is,
rather than a blank area or an empty table.

**The product's, and therefore present.** The requirements catalogue, the
document templates, the management review agenda and required outputs (both
§9.3 asks for them), and the GDPR and permission model — which describes how
this system handles personal data, not anything about the company.

Nothing invents a fact about Awimex: no headcount, no industry, no named user.
`CURRENT_USER` is null until authentication is wired up, because the change log
and approvals are meant to carry a real identity.

**No clause is pre-assessed.** A requirement starts with neither Pågår nor
Uppfyllt selected, so a company that has just started reads 0% rather than the
50% that seeding everything as "in progress" would produce. Scoring is
unchanged otherwise: met counts one, in progress counts a half, unassessed
counts nothing. The clause tree shows three dot states — filled for met, muted
for in progress, hollow for unassessed.

## Not yet built

These are visual affordances with no behavior behind them, as in the prototype:
document upload, evidence attachment, "Skapa uppgift", "Starta från mall", "Ej
tillämpligt", "Generera protokoll" and "Exportera". The buttons offered by the
empty states ("+ Lägg till leverantör" and the rest) are likewise affordances
pointing at the flows still to be built.
