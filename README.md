# ArthroFlex

**An AI-assisted early knee osteoarthritis screening interface for frontline health workers and clinical teams.**

> **Project status:** This repository contains a front-end prototype/demo of the ArthroFlex workflow. The screens illustrate patient registration, questionnaire-based screening, motion-assessment steps, risk summaries, patient review, analytics and referral workflows. The supplied code does not include a production backend, persistent database, authentication service, trained inference model, or live ESP32/MPU6050/camera integration. Do not use the displayed scores, records or dashboard statistics for clinical decisions.

## Table of contents

- [Overview](#overview)
- [Current implementation](#current-implementation)
- [Important scope and data notes](#important-scope-and-data-notes)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Application walkthrough](#application-walkthrough)
- [Localization](#localization)
- [Deployment on Vercel](#deployment-on-vercel)
- [Configuration](#configuration)
- [Limitations and future integration work](#limitations-and-future-integration-work)
- [Privacy and security](#privacy-and-security)

## Overview

ArthroFlex is presented as a digital workflow to support early identification of possible knee osteoarthritis (OA) risk in community and frontline screening settings. The interface provides two role-based experiences:

- **Field worker workspace:** a guided patient-screening flow and patient/record management views.
- **Doctor/clinical workspace:** a dashboard for reviewing priority cases, patient records, screening analytics, district-level views and referrals.

The interface includes English, Hindi and Marathi language options. The repository currently implements the web interface only; it should be treated as a prototype until the service, data and hardware integrations described in the wider project design are connected and validated.

## Current implementation

The following functionality is represented in the supplied source code:

### Field worker workspace

- Role selection from the welcome screen.
- Overview, Patients, New Screening, Sync Center and Profile navigation.
- A seven-stage screening sequence:
  1. Patient details and registration form.
  2. Occupational and medical history prompts.
  3. Pain questionnaire with language-aware text-to-speech support through the browser speech synthesis API when available.
  4. Motion assessment screen displaying ESP32 + MPU6050 and video-analysis status indicators.
  5. An AI-analysis progress/presentation screen.
  6. Risk result and contributing-factor presentation.
  7. Care-plan information.
- BMI calculation from the height and weight entered in the form.
- Patient list and patient report views.
- A Sync Center interaction that simulates a sync action and displays a completion message.

### Doctor/clinical workspace

- Overview dashboard with screening and risk summary cards.
- Priority/high-risk case queue with patient search and review navigation.
- Patient registry and a clinical case detail drawer.
- Screening analytics with period, district and risk filters.
- District surveillance/map-style view.
- Referral management view with status filtering and search.
- Profile/settings navigation affordances.

### Shared interface capabilities

- English, Hindi and Marathi interface dictionaries.
- Language selection shared through a React context and stored in browser `localStorage`.
- Responsive navigation patterns for smaller screens.
- Reusable UI elements, icons, badges, cards, forms and status indicators.
- Vercel Analytics component included in the root layout for production deployments.

> Some controls are demonstrative UI interactions. For example, the motion screen displays sensor and video-analysis states, and the analysis screen presents an analysis sequence; the checked-in implementation does not communicate with a physical sensor or execute a deployed OA inference pipeline.

## Important scope and data notes

**The geographic configuration in this code snapshot is Maharashtra-specific.** The data module is named `lib/maharashtra.ts`, and it supplies Maharashtra districts, divisions, sample patients and aggregate dashboard totals. The welcome-screen copy also refers to rural Maharashtra. This does not match a Northeast India deployment configuration (such as Assam and Mizoram). Before using this application for the intended Northeast India field setting, replace and validate the district dataset, labels, map representation, default district, demo records and regional copy consistently.

The included patient names, villages, scores, screening details and aggregate counts are hard-coded demonstration content in `lib/maharashtra.ts` and the UI components. Dashboard values are partly fixed or derived from those demo values. They are not live operational statistics. The initial screening form also contains prefilled sample values.

## Technology stack

| Area | Technology in this repository |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI runtime | React 19, TypeScript |
| Styling | Tailwind CSS 4, project CSS in `app/globals.css` |
| UI components | Base UI React, locally defined UI components, shadcn tooling/dependencies |
| Icons | Lucide React |
| Class utilities | `clsx`, `class-variance-authority`, `tailwind-merge` |
| Localization | Custom React context and English/Hindi/Marathi dictionaries |
| Speech | Browser Web Speech / speech synthesis API via `lib/speech.ts` |
| Analytics | `@vercel/analytics` |
| Package manager | pnpm (lockfile included) |
| Hosting configuration | Vercel-compatible Next.js project |

No backend framework, database client, authentication SDK, machine-learning runtime or hardware communication library is declared in the supplied `app/package.json`.

## Repository structure

The Git repository contains a wrapper/root directory and the actual Next.js application inside `app/`.

```text
repository-root/
├── .gitignore
├── package.json                 # Root scaffold; not the Next.js app manifest
├── pnpm-lock.yaml               # Root-level lockfile, if retained
└── app/                          # Actual Next.js project and Vercel root
    ├── app/
    │   ├── globals.css           # Global styles
    │   ├── layout.tsx            # Root layout, metadata, language provider, analytics
    │   └── page.tsx              # Main role-based application and screens
    ├── components/
    │   └── ui/
    │       └── button.tsx        # Reusable button component
    ├── lib/
    │   ├── i18n.tsx              # Language context, dictionaries and translation helpers
    │   ├── maharashtra.ts        # Maharashtra demo districts, totals and patient data
    │   ├── speech.ts             # Speech synthesis helper
    │   └── utils.ts              # Shared utility functions
    ├── public/                   # Icons and placeholder image assets
    ├── scripts/
    │   └── check-i18n.mjs        # Localization consistency check
    ├── package.json              # Next.js app dependencies and scripts
    ├── pnpm-lock.yaml            # App dependency lockfile
    ├── pnpm-workspace.yaml       # pnpm settings
    ├── next.config.mjs           # Next.js configuration
    ├── postcss.config.mjs        # PostCSS/Tailwind configuration
    └── tsconfig.json             # TypeScript configuration
```

## Getting started

### Prerequisites

- Node.js compatible with the installed Next.js 16 release (use a current supported LTS release).
- pnpm. The lockfile was generated with pnpm 12 in the supplied working copy; use a compatible pnpm release for reproducible installs.
- Git (optional, for cloning and source control).

### 1. Clone the repository

```bash
git clone https://github.com/arnavkumar6656-beep/ArthroFlex.git
cd ArthroFlex
```

### 2. Enter the Next.js application directory

```bash
cd app
```

### 3. Install dependencies

```bash
pnpm install
```

For a local install where you intentionally need pnpm to reconcile the lockfile, use:

```bash
pnpm install --no-frozen-lockfile
```

Commit any intentional changes to `package.json`, `pnpm-workspace.yaml` and `pnpm-lock.yaml` so CI and deployment use the same dependency graph.

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create a production build locally

```bash
pnpm build
pnpm start
```

The production server runs at [http://localhost:3000](http://localhost:3000) by default.

## Available scripts

Run these commands from the `app/` directory.

| Command | Description |
|---|---|
| `pnpm dev` | Starts the Next.js development server. |
| `pnpm build` | Creates a production build. |
| `pnpm start` | Serves the production build. Run after `pnpm build`. |
| `pnpm check:i18n` | Runs the repository's localization consistency script. |

## Application walkthrough

1. Open the application. The welcome screen offers a language selector and two role choices.
2. Choose the field-worker role to enter the screening workspace, or the doctor role to enter the clinical portal.
3. In the field-worker workspace, open **New Screening** to move through the seven-step form and assessment presentation.
4. Use **Patients** to view the sample patient records and report details.
5. Use **Sync Center** to see the prototype sync interaction.
6. In the doctor portal, explore **Overview**, **Priority Cases**, **Patients**, **Screening Analytics**, **District Map** and **Referrals**.
7. Change the interface language using the language selector. The available languages are English, Hindi and Marathi.

The UI starts with sample data and local React state. It is not currently a multi-user system and changes made during a session are not saved to a server-side database.

## Localization

Localization is implemented in `app/lib/i18n.tsx`.

- Supported language codes: `en`, `hi`, `mr`.
- `LanguageProvider` exposes the current language and translation helpers to the component tree.
- The selected language is persisted in browser `localStorage` under the key `arthroflex-language`.
- District names and patient/village labels are represented as localized values in the demo data module.
- `app/scripts/check-i18n.mjs` provides a script for checking translation-key consistency.

When adding a new language, add the language code and display name, extend the dictionaries and localized data types, and run `pnpm check:i18n` from `app/`.

## Deployment on Vercel

The Git repository's Next.js application is nested in the `app/` directory. When importing the repository into Vercel, configure:

| Vercel setting | Value |
|---|---|
| Framework preset | Next.js |
| Root Directory | `app` |
| Build command | `next build` (or the detected default) |
| Output directory | Next.js default |
| Install command | Automatic / pnpm |

The project includes `@vercel/analytics` and renders the Analytics component in production. No application-specific environment variables are referenced by the supplied frontend source snapshot. If future integrations add API URLs, Firebase credentials or other configuration, define the required variables in Vercel Project Settings and document only their names (never their secret values) here.

After changing code locally:

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

Vercel can then build the updated `main` branch automatically when Git integration is enabled.

## Configuration

- `app/next.config.mjs`: Next.js configuration. The current config sets `images.unoptimized` to `true`.
- `app/pnpm-workspace.yaml`: pnpm workspace-level settings, including the `msw` build allowance and `hono` override.
- `app/tsconfig.json`: TypeScript compiler configuration and path aliases.
- `app/postcss.config.mjs`: PostCSS/Tailwind processing configuration.

The current app source does not require a `.env` file to render the included prototype. Do not create placeholder environment variables unless a later integration actually consumes them.

## Limitations and future integration work

The following are not implemented by the supplied source snapshot and would be required for a production system:

- **Backend/API:** secure server-side APIs for registration, screening submission, patient records, referrals and reporting.
- **Database and persistence:** durable storage, migrations, backups, access controls and audit trails. Current data is seeded in source and held in client-side React state.
- **Authentication and authorization:** real field-worker and clinician sign-in, role-based permissions, session management and account lifecycle controls. The current role selection is a demo entry point, not authentication.
- **Hardware integration:** actual Bluetooth Low Energy communication with ESP32/MPU6050, sensor calibration, measurement capture, error handling and device lifecycle management. The current motion screen is a simulated presentation.
- **Camera/computer vision:** real camera capture, pose estimation and gait analysis. The UI references video analysis, but no camera or MediaPipe implementation is present in this repository snapshot.
- **Validated risk model:** a clinically evaluated and versioned screening algorithm/model, with documented training data, validation, thresholds, calibration and monitoring. The current result and risk contributors are demonstration values, not a functioning AI diagnosis or validated risk prediction.
- **Offline-first synchronization:** durable local storage, retry queues, conflict resolution, encryption at rest, sync status from a real API and safe recovery after app/browser restarts. The current Sync Center only simulates a sync action.
- **Regional configuration:** replace the Maharashtra-specific district and patient dataset with verified target-region data (for example, Assam and Mizoram, if that remains the deployment scope), including district names in supported languages and appropriate geographic visualizations.
- **Clinical governance:** clinician review, referral pathways, consent, privacy notices, retention policies and usability/accessibility testing with intended users.

ArthroFlex should be described as a screening-support concept/prototype, not as a diagnostic product. Any real-world deployment requires clinical, technical, privacy and regulatory review appropriate to the deployment jurisdiction.

## Privacy and security

- Do not commit `.env` files, credentials, private keys, access tokens or production patient records.
- Keep secrets in deployment environment-variable settings or a dedicated secrets manager.
- Use synthetic data in development, screenshots and public demonstrations.
- Before connecting real patient information, implement authentication, authorization, transport security, secure storage, audit logging, retention/deletion controls and an appropriate consent process.
- Restrict access to patient-level information to authorized roles and follow applicable data-protection and healthcare requirements.

---

**Maintainer:** ArthroFlex project team  
**Repository:** [arnavkumar6656-beep/ArthroFlex](https://github.com/arnavkumar6656-beep/ArthroFlex)
