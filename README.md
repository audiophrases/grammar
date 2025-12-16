# ESL Grammar Study

A Vite + React + TypeScript single-page app for ESL grammar practice powered by Google Sheets.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The Vite config is set with `base: '/grammar/'` so assets are served correctly from GitHub Pages.

## Development notes

- Data sources live in `src/config.ts` and are pulled from published Google Sheets CSV URLs.
- Hash-based routing keeps deep links working on GitHub Pages.
- LocalStorage caches both the sheet data and practice attempts. Cached content renders immediately while background refresh keeps data current.

## Deployment

GitHub Actions builds and deploys `dist` to Pages on every push to `main` using the official Pages actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`).
