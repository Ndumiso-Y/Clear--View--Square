# Clearview Square Shopping Centre Website

Convenience shopping centre website for Clearview Square in Rustenburg, South Africa.

## Requirements
- **Node.js**: `>=22.12.0` (as defined in `package.json` engines)

## Setup & Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```

## Production Builds (Multi-Host Deployment)
To support different hosting environments and base paths, use the following build scripts:

- **Standard Build** (Builds to `/`):
  ```bash
  npm run build
  ```
- **GitHub Pages** (Builds to `/Clear--View--Square/` base path):
  ```bash
  npm run build:gh
  ```
- **Vercel**:
  ```bash
  npm run build:vercel
  ```
- **Netlify**:
  ```bash
  npm run build:netlify
  ```
- **cPanel**:
  ```bash
  npm run build:cpanel
  ```

Outputs are compiled into the `dist/` directory.

## Features
- Dynamic, data-driven Stores directory (`public/data/stores.json`).
- Promotions & Events feed (`public/data/promotions.json`).
- Fully keyboard and screen-reader accessible forms with POPIA compliance.
- Interactive Weather Widget and AI Assistant.
