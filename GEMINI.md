# Project: dblboxweb

## Overview
**dblboxweb** is a web application built with **Astro** designed to browse and display "Units" from the game *Dragon Ball Legends*. It fetches unit data from an external API and displays them in a gallery format.

The project is configured for Server-Side Rendering (SSR) and deployment on **Vercel**.

## Tech Stack
*   **Framework:** [Astro](https://astro.build/) (v5)
*   **Language:** TypeScript
*   **Deployment:** Vercel (`@astrojs/vercel` adapter)
*   **Styling:** CSS (Scoped & Global)
*   **Data Source:** External REST API

## Project Structure
```text
/
├── public/                 # Static assets
├── src/
│   ├── api/                # API fetch functions
│   │   └── getAllUnitSummary.ts # Fetches unit data
│   ├── components/         # UI Components
│   │   ├── filter/         # Filtering logic components
│   │   └── Header.astro
│   ├── layouts/            # Page layouts
│   ├── pages/              # File-based routing
│   │   ├── index.astro     # Root redirect
│   │   └── [lang]/         # Localized unit gallery (Entry point)
│   ├── types/              # TypeScript definitions
│   └── utils/              # Utility functions
├── astro.config.mjs        # Astro configuration
└── package.json            # Dependencies and scripts
```

## Key Files & Modules

### Data Fetching
*   **`src/api/getAllUnitSummary.ts`**: Contains `getAllUnits(lang)`. Fetches data from `${PUBLIC_API_URL}${PUBLIC_API_CURRENT_VERSION}/unit/all`.

### Pages
*   **`src/pages/[lang]/index.astro`**: The main page rendering the unit gallery. It currently fetches data server-side and maps over it to display images.
    *   **Note:** Imports `FilterSection` but currently does *not* use it in the template.
    *   **Note:** The filtering logic in `FilterSection` expects elements with class `.unit-card` and data attributes (`data-color`, etc.), which are currently missing from the elements rendered in this page.

### Configuration
*   **`astro.config.mjs`**: Configured with `output: 'server'` and the Vercel adapter.

## Setup & Development

### Prerequisites
*   Node.js installed.
*   Environment variables set (see below).

### Installation
```sh
npm install
```

### Running Locally
```sh
npm run dev
```
Starts the local development server at `http://localhost:4321`.

### Building
```sh
npm run build
```

## Environment Variables
The application relies on the following environment variables (accessed via `import.meta.env`):
*   `PUBLIC_API_URL`: Base URL for the data API.
*   `PUBLIC_API_CURRENT_VERSION`: API version string.
*   `API_BCHAICO`: Base URL for serving unit images (webps).

## Development Conventions
*   **Routing:** Uses dynamic routing `[lang]` for internationalization (defaulting to Spanish `/es/`).
*   **Types:** Domain models (Units, Lang, etc.) are strictly typed in `src/types/`.
*   **Styling:** Uses a mix of Astro-scoped styles and imported CSS files (e.g., in `FilterSection`).
