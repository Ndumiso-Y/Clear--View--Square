# Clearview Square – Development SOP

**Last Updated:** December 2, 2025
**Project:** Clearview Square Shopping Centre Website
**Tech Stack:** React 18 + Vite + Tailwind CSS + React Router (HashRouter)
**Repository:** https://github.com/Ndumiso-Y/Clear--View--Square

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Router & Routing](#router--routing)
3. [Data Layer](#data-layer)
4. [Asset Management](#asset-management)
5. [Development Workflow](#development-workflow)
6. [Deployment](#deployment)
7. [Adding New Content](#adding-new-content)
8. [Troubleshooting](#troubleshooting)

---

## 1. Architecture Overview

### Technology Stack
- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 5.4.0
- **Styling:** Tailwind CSS 3.4.12
- **Routing:** React Router DOM 7.7.1 (HashRouter)
- **Deployment Targets:** GitHub Pages, cPanel, Netlify

### Project Structure
```
Website/
├── public/
│   ├── assets/
│   │   ├── brand/          # Logo, hero images, OG image
│   │   ├── logos/          # Store logos
│   │   ├── grandopeningphotos/
│   │   ├── hero/           # Hero section images
│   │   ├── centre/         # Building/exterior/interior
│   │   ├── stores/         # Store-specific images
│   │   ├── events/         # Promotion/event images
│   │   └── icons/          # UI icons, empty-state illustrations
│   ├── data/
│   │   ├── stores.json     # Tenant/store directory
│   │   └── promotions.json # Promotions and events
│   ├── favicon.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Carousel.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Stores.jsx
│   │   ├── Store.jsx       # Individual store detail (future)
│   │   ├── Promotions.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   └── assets.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── tailwind.config.js
├── package.json
└── CLEARVIEW_SOP.md (this file)
```

---

## 2. Router & Routing

### HashRouter Implementation

We use **HashRouter** for maximum compatibility across different hosting environments (GitHub Pages, cPanel, Netlify).

**Location:** `src/main.jsx`

```jsx
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
```

### Route Structure

All routes are prefixed with `#/`:

| Route          | Component      | Description                  |
|----------------|----------------|------------------------------|
| `/#/`          | Home.jsx       | Homepage with hero           |
| `/#/about`     | About.jsx      | About the centre             |
| `/#/stores`    | Stores.jsx     | Store directory & filters    |
| `/#/promotions`| Promotions.jsx | Promotions and events        |
| `/#/contact`   | Contact.jsx    | Contact & leasing enquiries  |
| `/#/store/:id` | Store.jsx      | Individual store (reserved)  |
| `*`            | NotFound.jsx   | 404 page                     |

### Navigation

- Always use `<Link>` or `<NavLink>` from `react-router-dom` for internal links
- Never use hard-coded `<a href="...">` for internal routes
- External links use standard `<a>` tags with `target="_blank" rel="noopener noreferrer"`

**Example:**
```jsx
import { Link } from 'react-router-dom'

<Link to="/stores">Browse Stores</Link>
```

### Scroll Behavior

A `ScrollToTop` component in `App.jsx` ensures the page scrolls to the top on route change:

```jsx
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
```

---

## 3. Data Layer

### stores.json

**Location:** `public/data/stores.json`

**Schema:**
```typescript
interface Store {
  id: string;                // kebab-case slug (e.g., "mugg-and-bean")
  name: string;              // Display name (e.g., "MUGG & BEAN")
  category: StoreCategory;   // See categories below
  description?: string;      // 1-2 sentence description
  tags?: string[];           // e.g., ["Anchor", "New"]
  isAnchor?: boolean;        // true for anchor tenants
  location?: string;         // e.g., "Ground floor, near Checkers"
  unit?: string | null;      // e.g., "Shop 12"
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logo?: string | null;      // Path: "/assets/logos/..."
  heroImage?: string | null;
}

type StoreCategory =
  | 'Anchor'
  | 'Food & Drink'
  | 'Groceries'
  | 'Fashion & Footwear'
  | 'Health & Beauty'
  | 'Electronics & Tech'
  | 'Services'
  | 'Fitness & Wellness'
  | 'Pets & Specialty'
  | 'Financial & ATMs'
  | 'Other';
```

**Current Canonical Tenants (30 total):**
- CHECKERS (Anchor)
- CHECKERS (LIQUOR)
- MUGG & BEAN (Anchor)
- CLICKS RETAILERS (Anchor)
- THE CRAZY STORE
- PNP CLOTHING
- CAPITEC ATM
- NEDBANK ATM
- Vuse
- BOESMANLAND BILTONG
- FISH & CHIPS
- ELECTRONICS HUB
- GAMING ZONE
- PC LINK
- MILKY LANE (STORAGE)
- MILKY LANE (SHOP)
- MAN CAVE BARBER
- PET SHOP
- SAUSAGE SALOON
- CASH CRUSADERS
- SPICE HAVEN
- NEXT STEP CLOTHING
- Postlink
- CANNAFRICA
- BRANDS SA
- BETTER SIGHT SOLUTIONS
- F45
- TONNY D FASHION
- LONDON PETAL
- Pen and In

### promotions.json

**Location:** `public/data/promotions.json`

**Schema:**
```typescript
interface Promotion {
  id: string;
  type: 'Promotion' | 'Event';
  title: string;
  storeId?: string;          // Links to Store.id (optional)
  description: string;
  startDate: string;         // ISO date: '2025-03-01'
  endDate: string;           // ISO date: '2025-03-10'
  highlightTag?: string;     // e.g., "Now On", "Upcoming"
  image?: string | null;     // Path: "/assets/events/..."
  ctaLabel?: string;         // e.g., "View Store"
  ctaUrl?: string;           // Internal (#/stores) or external
}
```

**Date Logic:**
- **"Now On"**: `today >= startDate && today <= endDate`
- **"Upcoming"**: `today < startDate`

---

## 4. Asset Management

### Vite Base Configuration

**Location:** `vite.config.js`

```js
export default defineConfig({
  plugins: [react()],
  base: '/Clear--View--Square/',
})
```

This `base` setting is critical for GitHub Pages deployment.

### Asset Paths

**Public Assets:**
- All assets in `public/` are served from the root
- Reference them as: `/assets/...`
- Vite automatically prepends `BASE_URL` during build

**In Code:**
```jsx
const baseUrl = import.meta.env.BASE_URL
<img src={`${baseUrl}assets/brand/hero.jpg`} alt="..." />
```

**For JSON files:**
```jsx
fetch(`${baseUrl}data/stores.json`)
```

### Missing Image Fallbacks

All components handle missing images gracefully:

```jsx
{store.logo ? (
  <img
    src={`${baseUrl}${logo}`}
    onError={(e) => {
      e.currentTarget.style.display = 'none'
      // Show fallback (initials, placeholder, etc.)
    }}
  />
) : (
  <div className="fallback-placeholder">
    {store.name.charAt(0)}
  </div>
)}
```

---

## 5. Development Workflow

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation
```bash
git clone https://github.com/Ndumiso-Y/Clear--View--Square.git
cd Clear--View--Square
npm install
```

### Environment Setup

**Weather Widget Configuration:**

The Weather Widget (in "Visit Us Today" section) requires an OpenWeatherMap API key to display live weather for Rustenburg.

**Steps:**
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
3. Open `.env` and replace the placeholder with your actual key:
   ```
   VITE_WEATHER_API_KEY=your-actual-api-key-here
   ```
4. Restart the dev server if running

**Important:**
- `.env` is automatically ignored by Git (see `.gitignore`) - your key will never be committed
- The widget gracefully degrades if no key is provided (renders nothing, no crashes)
- For production deployment, add the `VITE_WEATHER_API_KEY` to your hosting platform's environment variables

### Local Development
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Output: `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### File Watching
Changes to `.jsx`, `.css`, `.json` files trigger hot reload automatically.

---

## 6. Deployment

### GitHub Pages (Current Setup)

**GitHub Actions Workflow:** `.github/workflows/deploy.yml`

**Triggers:** Push to `main` branch

**Process:**
1. Checkout code
2. Install dependencies
3. Build (`npm run build`)
4. Copy `404.html` to `dist/`
5. Deploy to `gh-pages` branch

**Live URL:** `https://ndumiso-y.github.io/Clear--View--Square/`

### Manual Deployment (cPanel / Netlify)

1. Run `npm run build`
2. Upload contents of `dist/` folder to server
3. Ensure server supports SPA routing (HashRouter handles this automatically)

**Note:** HashRouter works out-of-the-box on any static host without server-side configuration.

---

## 7. Adding New Content

### Adding a New Store

1. Open `public/data/stores.json`
2. Add new store object:
```json
{
  "id": "new-store-name",
  "name": "NEW STORE NAME",
  "category": "Services",
  "description": "Brief description of the store.",
  "tags": [],
  "isAnchor": false,
  "location": "Ground floor",
  "unit": "Shop 30",
  "phone": null,
  "email": null,
  "website": null,
  "logo": "/assets/logos/new-store.png",
  "heroImage": null
}
```
3. Add logo to `public/assets/logos/` (if available)
4. Save and refresh – store appears on Stores page

### Adding a Promotion/Event

1. Open `public/data/promotions.json`
2. Add new promotion:
```json
{
  "id": "unique-id",
  "type": "Promotion",
  "title": "Summer Sale",
  "storeId": "store-id",
  "description": "Get 20% off all items!",
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "highlightTag": "Now On",
  "image": "/assets/events/summer-sale.jpg",
  "ctaLabel": "Shop Now",
  "ctaUrl": "#/stores"
}
```
3. Save – promotion auto-appears in correct section based on dates

### Updating Contact Information

Edit `src/pages/Contact.jsx`:
- **General contact:** Lines 56, 68, 80
- **Leasing contact:** Lines 210, 221

---

## 8. Troubleshooting

### Issue: Blank page after deployment
**Cause:** Incorrect `base` in `vite.config.js`
**Fix:** Ensure `base: '/Clear--View--Square/'` matches your GitHub repo name

### Issue: Routes show 404 on refresh
**Cause:** Using BrowserRouter instead of HashRouter
**Fix:** Confirm `src/main.jsx` uses `<HashRouter>`

### Issue: Images not loading
**Cause:** Incorrect asset paths
**Fix:** Always use `${baseUrl}assets/...` pattern

### Issue: Store/Promotion not appearing
**Cause:** Invalid JSON syntax or date format
**Fix:** Validate JSON at https://jsonlint.com/
**Fix:** Ensure dates are in `YYYY-MM-DD` format

### Issue: Build fails
**Cause:** Missing dependencies or Node version
**Fix:** Run `npm install` and ensure Node 16+

---

## Quick Reference

### Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Key Files
- **Router:** `src/main.jsx`, `src/App.jsx`
- **Data:** `public/data/stores.json`, `public/data/promotions.json`
- **Config:** `vite.config.js`
- **Pages:** `src/pages/*.jsx`

### Important URLs
- **Repo:** https://github.com/Ndumiso-Y/Clear--View--Square
- **Live Site:** https://ndumiso-y.github.io/Clear--View--Square/
- **Local Dev:** http://localhost:5173

---

**For questions or updates, contact:** development@brandssa.co.za

---

_This SOP serves as the template for all future BrandsSA shopping centre projects._
