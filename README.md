# GrowthBound Media — Website

A single-page marketing site for GrowthBound Media: websites for builders & trades
(Newcastle to start). Plain static **HTML + CSS + vanilla JS** — no build step, no
dependencies. Deploys to Netlify as-is.

## Structure

```
index.html          The whole page
css/
  reset.css         Minimal modern reset
  styles.css        Design system (colours, fonts) + every section's styles
js/
  main.js           Sticky nav, mobile menu, scroll-reveal, FAQ accordion
assets/
  logo.png          Your logo (recoloured to green live via CSS mask)
  favicon.svg       Browser tab icon
netlify.toml        Hosting config
```

## Preview locally

No Node needed — use Python (already on macOS):

```bash
cd "growthbound website"
python3 -m http.server 52700
# then open http://localhost:52700
```

## Editing the common things

| Want to change… | Where |
|---|---|
| **Logo** | Replace `assets/logo.png`. It's auto-recoloured to the site green via a CSS mask in `css/styles.css` (`--logo-grad`). For the original logo colours instead, swap the `.brand-logo` rule to an `<img>`. |
| **Brand colour** | `css/styles.css` → `:root` → `--green`, `--green-bright`, `--green-grad`, `--logo-grad`. |
| **Headline / body copy** | Directly in `index.html` (sections are clearly commented). |
| **Pricing** | The `<!-- PRICING -->` section in `index.html`. |
| **Calendly booking** | In the contact section, the `.calendly-inline-widget` `data-url` — replace `your-handle` with your real Calendly link. |
| **Phone / email** | Search `index.html` for `0491 145 688` and `daniel@growthbound.media`. |
| **Testimonials** | The `<!-- RECENT WORK -->` section. Add real reviews when you have them. |
| **Live demo embed** | The two `<iframe src="https://beamish-paletas-c912b9.netlify.app/">` (hero + demo). Swap the URL if the demo site moves. |

## Booking & contact form

- **Calendly:** the inline widget uses a placeholder URL (`calendly.com/your-handle/intro`).
  Replace it with your real link and it goes live.
- **Contact form:** uses **Netlify Forms** — it only works once deployed to Netlify
  (not on the local Python preview). After deploy, submissions show under
  *Site settings → Forms*; turn on *Form notifications* to get them emailed to you.

## Deploy to Netlify

**Option A — drag & drop (fastest)**
1. Go to <https://app.netlify.com/drop>
2. Drag the `growthbound website` folder onto the page.
3. Done — you get a live `*.netlify.app` URL.

**Option B — connect Git (recommended for ongoing edits)**
1. Push this folder to a GitHub repo.
2. In Netlify: *Add new site → Import an existing project →* pick the repo.
3. Build command: *(leave blank)*. Publish directory: `.`
4. Every push auto-deploys.

## Custom domain (growthbound.media)

1. In Netlify: *Site settings → Domain management → Add a custom domain* →
   enter `growthbound.media`.
2. Point your domain's DNS to Netlify (either move nameservers to Netlify DNS,
   or add the `A` / `CNAME` records Netlify shows you).
3. Netlify provisions a free HTTPS certificate automatically.

## Notes

- The site is fully responsive and respects `prefers-reduced-motion`.
- No analytics are included yet — add Plausible/GA in `index.html` before `</head>` if wanted.
