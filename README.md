# WOY Consulting - website

A multi-page Next.js site (App Router, TypeScript, Tailwind v4). Case studies, people, documents, Expertise and Our approach copy are edited in Sanity (see `docs/editing-guide.md`). Policy text lives in the two legal page files.

```
app/
  layout.tsx            shell: nav, footer, theme boot, scroll progress
  template.tsx          per-route enter animation
  page.tsx              home
  about/ approach/ practitioners/ contact/
  case-studies/
    page.tsx            index
    [slug]/page.tsx     six generated detail pages
components/             Nav, Footer, LogoFormation, Mark, ClientLogos, ...
lib/content.ts          site copy and data not managed in Sanity
lib/cms/                reads Sanity (cached, with a build-time snapshot fallback)
studio/                 the Sanity Studio (separate package)
lib/site-url.ts         canonical origin for metadata, sitemap and robots
public/logos/           47 client logos extracted from the WOY deck
_legacy/                the earlier single-page static build, kept for reference
```

## Run it

Use Node.js 22.19 or newer (Node 24 recommended for the development tools).

```bash
npm install
```

```bash
npm run dev
```

Opens on `http://localhost:5173`. `npm run build` produces public pages, legal pages, social/icon assets, sitemap and robots. The contact API runs on the server.

See [the launch checklist](docs/launch-checklist.md) for the 20-point audit and deployment requirements, and [SEO/GEO readiness](docs/seo-geo.md) for search improvements and public-domain setup.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start -- -p 5173
```

With that production server running, use `npm run test:browser` for the route, accessibility and interaction checks, and `npm run test:performance` for mobile/desktop Lighthouse reports. These use Chrome on Windows or Playwright Chromium elsewhere; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use another installed Chromium browser. Results are written to ignored `reports/`. Run `npm run test:theme-navigation` to check theme preservation across internal links on desktop and mobile, with optional theme memory enabled, declined or unavailable. Set `TEST_BASE_URL` when using a preview port other than 5173.

## Deploy to Vercel

Connect `woyconsulting/woyconsulting` to the existing Vercel project for the public
website. Use `main` as the production branch and the repository root for the
Next.js build. Deploy Sanity Studio separately from `studio/`.

Follow [the Vercel security setup](docs/security-deployment.md) and `.env.example` for direct Resend delivery (`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`), the signed-form secret, shared Redis limits and Turnstile verification. Verify the sender domain in Resend and redeploy after setting the environment variables. Production contact submissions fail closed without these controls. Rebuild after changing the public origin. Never commit populated environment files.

HTTPS redirects, HSTS and standard headers are in `next.config.mjs`; `proxy.ts` supplies a fresh nonce-based CSP for request-rendered HTML. Versioned scripts and image assets remain cacheable. Hosting must supply TLS and trustworthy proxy headers. Preview/local builds block indexing. Use `npm run security:check` after building to scan source and browser bundles. GitHub security checks and dependency updates are defined in `.github/`.

**Note on the repository:** `.gitignore` excludes `*.pdf` and `*.mp4`. The
introduction deck names clients that the site itself anonymises under
confidentiality agreements, and this repository is public. Share those files
through a private channel rather than committing them.

## Routes

| Route | What it holds |
|---|---|
| `/` | Plain light/dark hero, balanced animated brand mark and Growth / Excellence / Agility caption, positioning, compact expertise and delivery section, clients, interactive 4D approach and a founder-led leadership section |
| `/about` | Concise firm introduction, logo philosophy, partnership principles and expandable client roster |
| `/expertise` | Four advisory areas and service lists, with page copy editable in Studio |
| `/approach` | Four stages, working principles and logo philosophy, with page copy editable in Studio |
| `/case-studies` | Featured engagement and outcome-led portfolio of six cases |
| `/case-studies/[slug]` | Detail pages, generated from the case studies in Sanity |
| `/practitioners` | Authentic portraits with monochrome/colour hover, experience highlights and expandable biographies |
| `/contact` | Direct email to hello@woyconsulting.com, plus the name, email, optional organisation and message form with required consent |
| `/faq` | Answers about WOY, its services, approach and enquiries |
| `/resources` | Brochures and reports uploaded in Sanity, newest first, each with a Download link. A short message shows until the first one is published |
| `/privacy-policy` | Information handling and cookie choices |
| `/terms-and-conditions` | Website terms and enquiries |

Adding a case study: create it in the Studio and publish. The portfolio entry, the detail page, the route and its metadata
all follow automatically.

---

## Content management (Sanity)

Case studies, people, downloadable documents and the two editable pages live in Sanity (project `hoks8t5u`, dataset `production`, public). WOY staff edit them in the hosted Studio, as described in [docs/editing-guide.md](docs/editing-guide.md). The site reads published content only. Expertise and Our approach show their existing copy until their Studio entries are first published.

- **Studio:** `studio/` is a separate npm package. Run it locally with `cd studio && npm install && npm run dev` (http://localhost:3333) and publish it with `npx sanity deploy`.
- **Snapshot:** `npm run cms:snapshot` saves every query result to `lib/cms/snapshot.generated.json` (git-ignored). `npm run dev` and `npm run build` run it first. A **build fails if Sanity is unreachable while the snapshot is taken**, so a deploy never ships without content and the current deployment stays live. At runtime, if Sanity is unreachable and nothing is cached, the site serves this snapshot (and logs `[cms] Sanity unreachable…`).
- **Instant refresh:** configure the signed webhook, `POST https://<domain>/api/revalidate`, for Create, Update and Delete on dataset `production`. Use filter `_type in ["caseStudy","person","resource","expertisePage","approachPage"]` and projection `{_id, _type}`, with draft events disabled. Set the same secret in Sanity and Vercel as `SANITY_REVALIDATE_SECRET`. Create a local secret with `npm run cms:secret` (written to `.env.local`, never printed). `npm run cms:revalidate` tests against the local server. Webhook signatures have a five-minute validity window. The website also revalidates CMS reads on its five-minute cache cycle.
- **Environment:** `SANITY_PROJECT_ID` and `SANITY_DATASET` are optional overrides (the defaults are in `lib/sanity/project.mjs`). `SANITY_REVALIDATE_SECRET` is required in production and must be at least 32 characters.
- **Public content only:** published documents are readable through the API, and uploaded files and images can be accessed by anyone with the URL, even before publish. Keep confidential material and private contact details in approved private storage. The website uses no Sanity write token.
- **Project access:** review members, API tokens and credentialed CORS origins in Sanity Manage. On Free, only trusted owners should hold Administrator access and read-only users should be Viewers. Enable MFA on the sign-in accounts, retain only Studio origins that need credentials, and revoke obsolete tokens. Use Growth if regular publishers need an Editor role without project administration.
- **Images and files** are served from this site's own origin under `/cms-assets/*`, a rewrite limited to this Sanity project and to safe file types, which keeps the Content-Security-Policy unchanged.
- **Testing an outage:** build normally, then start with `CMS_TEST_UNREACHABLE=1 npm start`. The site should render identically from the snapshot.
- **Visual checks:** `npm run test:visual:capture -- --label <name>` and `npm run test:visual:compare -- baseline <name>` compare screenshots of every route. Some pixel noise is normal on a busy machine, so re-capture once before treating a difference as real.

---

## Brand foundations

Taken from the WOY introduction deck and the brand artwork, not invented.

| Token | Value | Source |
|---|---|---|
| Logo red | `#CD1421` | sampled from the logo artwork |
| Accent red | `#E83928` | sampled from the deck's cover band |
| Ink / charcoal | `#14171D` | aligned to the deck's `#041D41` navy |
| Warm white | `#FBF9F7` | page background |
| Typeface | Georgia-based serif stack | reference-inspired editorial typography throughout the website |

**Guiding principle: "Win Over Yourself."** The deck says *Win*, not *Wind*. The
site uses *Win* throughout.

### The mark

Geometry was measured off WOY's own artwork at 900 DPI rather than approximated,
and lives in `components/mark-geometry.ts`:

- **Circle**, holistic growth and unified vision
- **Five-point star**, excellence and competitive advantage. Five spokes at
  `0deg, 90deg, 180deg, 230deg, 310deg`. The horizontal pair is levelled rather
  than sitting at a true 72 degree spacing, which is how the original is drawn.
- **Compass**, strategic agility and adaptability. The north marker above the ring.

Spokes reach `0.745` of the ring's centreline radius.

---

## The hero animation

One 12-second CSS timeline in `globals.css`, shared by every part through
`--mk-duration`. The reference circle, outlined five-point star and detailed
compass rose are introduced separately before converging into the WOY mark. The animation uses W/Y paths whose painted height matches the ring; shared static logo geometry is unchanged.
Auto-loops; respects system reduced-motion preferences.

| Time | What happens |
|---|---|
| 0.0–1.7s | The three reference symbols reveal; the compass rose aligns north |
| 1.7–3.1s | Circle, star and compass hold separately |
| 3.1–5.5s | Symbols converge; the star resolves into the original spokes and the compass leaves its north marker |
| 5.5–7.0s | W, Y and CONSULTING complete the lockup; a fine alignment ring fades away |
| 7.0–10.1s | The original logo holds, clear of construction details |
| 10.1–12.0s | A gentle fade hides the reset before the sequence repeats |

**If you edit it, two things matter:**

1. The `woy-sheen` gradient must stay `gradientUnits="userSpaceOnUse"`. With the
   default `objectBoundingBox`, any stroke whose bounding box has zero width or
   height is not rendered at all per the SVG spec, which silently deletes the
   vertical spoke, both horizontal spokes and the Y stem.
2. `prefers-reduced-motion: reduce` collapses the sequence to the finished static
   lockup. Keep that block in sync with the timeline.

The full loop pauses outside the viewport and when the document is hidden. All tracks share a start time and use no animation delays. `npm run test:logo` samples the separate, merging and completed states and verifies reduced motion and off-screen pausing.

## Why there is no animation library

Reveals, the page transition and the scroll progress bar are IntersectionObserver
and CSS rather than Motion. The failure mode of a broken animation library on a
marketing site is invisible content, so `Reveal` carries three safeguards:

- the hidden state is scoped to `[data-js]`, so content renders visible if
  scripting never runs
- anything already in the viewport at mount is shown immediately rather than
  waiting on an observer callback
- a timer backstops the observer

The scroll progress bar uses a CSS scroll-driven animation, so it runs on the
compositor with no JavaScript and degrades to nothing where unsupported.

---

## Client logos

The 47 logos in `public/logos/` were extracted directly from page 15 of the WOY
deck, trimmed, and are rendered in full colour with their brand names beneath
them. No plate, no border, nothing drawn around the artwork.

The band behind them (`.logo-band` in `globals.css`) is a white surface in both
themes. That is deliberate and load-bearing: the extracted artwork carries a
white background, and several brands (EY, Airtel, Horiba, Union Bank) have a
dark or coloured lockup of their own. A white band is what lets the marks sit
directly on the page with no box around them and stay legible without
recolouring anyone's brand. Inside the band the ink tokens are re-pointed to
their light values so the captions stay readable in dark mode.

The home page runs two rows drifting in opposite directions; `/about` shows the
full grid. The disclaimer under both is carried over verbatim from the deck.

Four frames were dropped deliberately: an Aviva marketing banner rather than a
logo, a watermarked Go First file, a stray fragment, and WOY's own mark. The SAIL
file was cropped to remove a baked-in award badge.

---

## Before this goes live

The following details require WOY’s production information.

1. **Contact delivery.** Configure Resend, the verified sender and recipient mailboxes, the signing secret, Redis and Turnstile from `.env.example`. Follow [the current setup instructions](docs/security-deployment.md); no separate contact-delivery handler is required. Add the privacy email when provided.

2. **LinkedIn URLs.** The optional **LinkedIn profile** field is empty for all
   three people in the Studio. These were not guessed, because a wrong guess
   points at the wrong person.

3. **Headshots.** Each person's portrait is the image uploaded in the Studio,
   with the focal point set on the face. Stock faces were not substituted
   under real people's names.

4. **Section photography.** Existing decorative stock photos are optimized locally in `public/images/`. Replace them with WOY-owned photography when available and update meaningful alternatives.

5. **Domain.** Set `SITE_URL` to the verified public origin for metadata, sitemap and HTTPS redirects.

## Content decisions

- **Case studies carry no client names.** Industry and scope of work only, per
  the NDA constraint. Names in the source deck were stripped.
- **No awards or press section.** WOY positions through work and engagement.
- **The Approach page** presents the four stages, working principles and WOY philosophy in fixed sections.
- **Conversation CTAs open the Contact page.** Its form asks for name, email, optional organisation and a message, with required consent. The API sends enquiries through Resend after validation and anti-abuse checks. Direct email links remain available. The footer combines the closing invitation, company information, navigation and legal links.

## Accessibility and performance

- Single-line nav at every desktop width, 72px tall, with the active route marked
  via `aria-current`.
- Skip link, visible focus rings, labelled form fields with `role="alert"` errors
  and an `aria-live` status.
- Every animation honours `prefers-reduced-motion`.
- Dark mode follows the system and can be overridden from the nav; the choice
  is applied before first paint and persists only with optional theme-memory consent.
- No scroll listeners anywhere.
