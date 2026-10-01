# Carter Immigration Law — website + admin CMS

A complete, self-contained website for a Canadian immigration lawyer:
a public marketing site and a password-protected admin dashboard that edits
every piece of content on it, in one Next.js codebase.

| | |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4, Playfair Display + Inter, lucide-react icons |
| Charts | Recharts (admin analytics) |
| Data | Single JSON-file database at `data/db.json` — no external services |
| Auth | Password-protected `/admin` (hashed session cookie, enforced in `src/proxy.ts`) |

---

## Quick start

```bash
npm install
npm run dev
```

| URL | What it is |
|---|---|
| http://localhost:3000 | Public site |
| http://localhost:3000/admin | Admin dashboard |

**Default admin password: `maple2026`** — change it by creating `.env.local`:

```bash
ADMIN_PASSWORD=your-strong-password
```

Production build:

```bash
npm run build
npm start
```

---

## What the public site includes

- **Home** — lawyer profile, credentials, philosophy, practice stats,
  featured success stories and latest news, consultation CTA.
- **Success stories** (`/success-stories`) — client results with visa type,
  journey summary and testimonial. First names and initials only.
- **News & updates** (`/news`, `/news/[slug]`) — immigration policy articles
  with categories and clean permanent URLs.
- **Consultation** (`/consultation`) — transparent pricing packages, a
  what-to-expect walkthrough, and the booking inquiry form (with honeypot
  spam protection).
- Professional footer with disclaimer, contact details and social links on
  every page.

## What the admin dashboard includes (`/admin`)

- **Dashboard** — total views, unique visitors, form submissions, conversion
  rate, a 60-day traffic chart (Recharts) and a most-visited-pages list.
  Traffic is tracked first-party via `/api/track`; admin visits are excluded.
- **Profile editor** — bio, photo URL, credentials, phone, email, address,
  social links.
- **Success stories manager** — add / edit / delete / publish-toggle.
- **News manager** — write, edit, publish and delete articles. Slugs are
  generated once and never change, so shared links keep working after a
  title edit.
- **Consultation editor** — intro, three packages (price, duration,
  features, highlight), availability note.
- **Inquiries inbox** — every form submission with new / contacted / closed
  workflow.

Every save calls `revalidatePath`, so changes appear on the public site
immediately — no rebuild, no cache clearing.

---

## How the pieces fit

```
src/
├─ proxy.ts                  Auth guard for /admin (Next 16's middleware)
├─ lib/
│  ├─ types.ts               Every record shape in one place
│  ├─ db.ts                  JSON-file database (atomic writes)
│  └─ auth.ts                Session-token model
├─ actions/                  Server actions: auth, content CRUD, inquiries
├─ app/
│  ├─ (public)/              Navbar + footer + tracked pages
│  ├─ admin/login/           Full-screen sign-in (outside the shell)
│  ├─ admin/(panel)/         Sidebar shell + the six admin screens
│  └─ api/track/route.ts     First-party page-view counter
└─ components/               Public cards/forms + admin editors
data/db.json                 The entire database — content, inquiries, analytics
```

### The database

`data/db.json` holds everything. Reads parse the file; writes go to a temp
file and are atomically renamed, so a crash can never corrupt it. To reset
the site to factory content, restore this file from git
(`git checkout data/db.json`).

Swapping to SQLite/Prisma or Postgres later means reimplementing the four
functions in `src/lib/db.ts` — nothing else in the app touches storage.

### Authentication honestly stated

One shared password, hashed into an httpOnly cookie, verified on every
`/admin` request by `src/proxy.ts`, and re-verified inside every mutating
server action. That is exactly as much auth as a single-lawyer CMS demo
needs — and it is **not** multi-user production auth. Before going live for
real, swap `src/lib/auth.ts` for NextAuth or a managed provider.

### Analytics honestly stated

On first run the dashboard seeds ~60 days of simulated traffic so the charts
demonstrate themselves. Real page views, visitors and form submissions are
tracked first-party on top of that baseline from the moment the site runs.
No IPs are stored and nothing is sent to third parties.

---

## Deployment notes

The JSON database needs a **writable, persistent filesystem** — a VPS with
`npm start` behind nginx (or Docker with a volume) is the natural fit.
Serverless hosts (Vercel/Netlify) have read-only or ephemeral filesystems,
so admin edits there would not persist; move the data layer to a hosted
database first.
