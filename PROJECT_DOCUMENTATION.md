
# CLEARVIEW SQUARE WEBSITE — FULL PROJECT HANDBOOK

Prepared: 2025-10-16 04:38

## Roles
- **ChatGPT (PM):** structure, naming, SOPs, QA.
- **Claude (Dev):** builds pages, logic, reports issues.

## Project Setup (Repo-first)
```bash
git init
git add .
git commit -m "Initial commit: Clearview Square final starter"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
npm install
npm run dev
```

## DESIGN & BRAND SETUP
- Palette from logo (monochrome):
  - dark `#1C1C1C`, mid `#4C4C4C`, light `#A6A6A6`, accent `#4A3B2A`, bg `#F8F8F8`.
- Inter via Google Fonts.
- Mobile-first; consistent spacing, hierarchy, contrast.
- Footer: Embark style in monochrome (dark background, white text, hover yellow).

## CODING STANDARDS
- Semantic HTML + reusable React components.
- Shared `<Navbar/>` & `<Footer/>` globally.
- Descriptive classnames & comments; **2-space** indentation.
- Test **mobile → tablet → desktop** before deploy.

## VERSION CONTROL ROUTINE
After each section:
```bash
git add .
git commit -m "Added About section"
git push
```
Descriptive commits only.

## ASSETS & PERFORMANCE
- Images ≤ 1 MB (prefer `.webp`).
- Video compression:
```bash
ffmpeg -i input.mp4 -b:v 1500k -vf scale=1280:-1 output.mp4
```
- Use ImageMagick/TinyPNG. Naming: `hero.mp4`, `about1.jpg`, `service-card.png`.
- Lazy-load where appropriate; case-sensitive paths.

## DEPLOYMENT
**GitHub Pages**
```bash
npm run build
git add dist -f
git subtree push --prefix dist origin gh-pages
```

**cPanel / Afrihost / GoDaddy**
- Upload `dist/` via File Manager/FTP.
- Test all links/forms post-deploy.

## SEO & ACCESSIBILITY
- Per-page titles/og tags.
- `robots.txt`, `sitemap.xml`, JSON-LD ShoppingCenter included.
- Alt text, keyboard focus, 4.5:1 contrast.

## Data Model
- Tenants: `public/data/stores.json` (edit without code):
```json
{
  "slug": "mugg-and-bean",
  "name": "Mugg & Bean",
  "category": "Food",
  "logo": "/assets/logos/mugg-and-bean.png",
  "anchor": true,
  "hours": {"mon_fri":"08:00–19:00","sat":"08:00–17:00","sun":"09:00–15:00"}
}
```
- Logos: drop files into `/public/assets/logos/` matching filenames in JSON.

## Troubleshooting
- White screen → open console; router imports; use HashRouter.
- Tailwind not working → content globs / @tailwind directives.
- 404 refresh → HashRouter or host rewrite.
- Assets missing → filename case; path under `/public/assets`.
- Build differs from dev → `npm run build && npx serve dist` to preview.
- Forms without endpoint → `mailto:` fallback is used.

## Structure
```
public/
  assets/brand/ (logo, hero, OG)
  assets/logos/ (tenants)
  data/stores.json
  favicon.png
  robots.txt
  sitemap.xml
404.html
src/
  components/ (Navbar, Footer)
  pages/ (Home, About, Stores, Contact)
  App.jsx, main.jsx, index.css
tailwind.config.js, postcss.config.js, vite.config.js
README.md, SOP.md, PROJECT_DOCUMENTATION.md
```


## New: Store Detail & Promotions
- **Store Detail** route: `#/store/:slug` reading `public/data/stores.json`.
- **Promotions** page: `#/promotions` pulling `public/data/promotions.json` (cards auto-expire based on dates).
