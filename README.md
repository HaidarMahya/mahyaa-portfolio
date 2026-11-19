# HAIDAR — Personal Portfolio

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Deployment (Vercel / Netlify)

- Project root: the folder containing this `package.json`
- Install command: `npm install` (or `npm ci`)
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 18 or newer

`vercel.json` and `public/_redirects` include SPA fallback routing. Static images must stay inside `public/images/` and are referenced with `/images/<filename>`.

## Content

Edit content in `src/data.js`. Photos and other static assets go in `public/images/`.
