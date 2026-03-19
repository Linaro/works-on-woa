# Works on Windows on Arm

**Works on WoA** is a public-facing compatibility catalog for Windows on Arm — it lets users discover and verify whether apps and games run natively (or via emulation) on Arm-powered Windows devices. The site tracks over 5,000 verified applications, organized by publisher and category, with community-driven status reports, search/filter capabilities, and internationalization support (English, Japanese, Korean, Chinese).

## Getting Started Locally

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (ships with Node.js)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd works-on-woa

# 2. Install dependencies
npm install

# 3. Start the development server (runs on http://localhost:3000)
npm run dev
```

The dev server supports hot module replacement — edits to source files will reflect immediately in the browser.

### Other Useful Commands

| Command | Description |
| --- | --- |
| `npm run build` | Type-check with TypeScript then produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally for verification |
| `npm run lint` | Run ESLint across the project |
| `npm run format` | Auto-format all files with Prettier |
| `npm test` | Run the Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run migrate` | Run the Markdown-to-JSON data migration script |

## Site Architecture

The project is a **React 19 SPA** built with **Vite** and styled with **Tailwind CSS v4**. Key architectural decisions:

- **Routing** — `react-router-dom` v7 with lazy-loaded page components for code splitting (Home, Apps, Games, Publishers, FAQ, Learn, Custom Report, etc.).
- **State & Data Fetching** — `@tanstack/react-query` for async server state; `zustand` for lightweight client state. A pluggable `DataProvider` interface (`src/data/provider.ts`) abstracts data access — the default `LocalDataProvider` reads from a bundled `projects.json` file, but can be swapped for an API-backed provider.
- **Internationalization** — `i18next` + `react-i18next` with browser language detection. Translation files live under `src/locales/` (en, ja, ko, zh).

### Project Structure

```
src/
├── App.tsx              # Root component — providers & router
├── router.tsx           # Route definitions (lazy-loaded pages)
├── components/          # Reusable UI components (Common, Home, Layout, Projects, Publishers)
├── data/                # Data layer — provider interface, local/API providers, types, content (projects.json)
│   └── hooks/           # React Query hooks for data access
├── lib/                 # i18n setup, PDF/bulk-report generation
├── locales/             # Translation JSON files (en, ja, ko, zh)
├── pages/               # Page-level components (one per route)
└── utils/               # Formatting, filtering, and helper utilities
```

## Contributing

Details on the schemas used in application, game, and user report files can be found at https://www.worksonwoa.com/en/contributing.

## Questions?

If you have any questions about updating or building this website, please contact Linaro IT Support at [it-support@linaro.org](mailto:it-support@linaro.org).

