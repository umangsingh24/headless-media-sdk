# Headless Media SDK Ecosystem & Component Library

A small headless media SDK ecosystem built around the Pexels API, featuring framework-agnostic core logic, platform wrappers, independent headless UI component libraries, and an interactive showcase application.

---

## Deliverables & Architecture Overview

```
headless-media-sdk/
├── packages/
│   ├── media-core/          # Pure TypeScript SDK (0 UI/DOM dependencies)
│   ├── media-react/         # React wrapper (Provider + hooks, 0 UI components)
│   ├── media-native/        # React Native wrapper (Provider + hooks)
│   ├── media-ui-react/      # Pure Headless UI for React Web (0 SDK imports)
│   ├── media-ui-native/     # Pure Headless UI for React Native (0 SDK imports)
│   └── app-web/             # React Web App wiring media-react + media-ui-react
├── docs/
│   ├── sdk-docs.md          # SDK API & Wrapper Documentation
│   └── components-docs.md   # Headless Component Library Documentation
└── skills/
    ├── media-react-data-wiring/
    │   └── SKILL.md         # AI Skill: Wiring provider, hooks & SDK events
    └── media-ui-headless-components/
        └── SKILL.md         # AI Skill: Consuming prop-getters & headless pattern
```

---

## Evaluation Constraints Compliance

1. **Dependency Direction**:
   - `app-web` → `media-react` → `media-core`
   - `app-web` → `media-ui-react`
   - `media-react` and `media-ui-react` **never import each other**.
   - `media-ui-react` **never imports `media-core`**.
   - `media-core` has **zero external UI dependencies**.
2. **Headless Component Pattern**:
   - `useGrid`, `useLightbox`, and `useReelSwiper` supply prop-getters (`getGridProps`, `getItemProps`, `getDialogProps`, `getContainerProps`, `getVideoPlayerProps`).
   - Components ship **no CSS styles** — consumers supply all markup and visual styling.
3. **AI Skills Integration**:
   - Two `SKILL.md` documents steer AI coding assistants when wiring data (`media-react-data-wiring`) and consuming headless components (`media-ui-headless-components`).

---

## AI Assistance & Development Log

| Component / Layer | Development Mode | Notes / AI Steering |
|---|---|---|
| `media-core` | AI-assisted | Auth, event emitter, cache, and Pexels normalization logic. |
| `media-react` | AI-assisted | Created React provider & custom hooks adhering to strict SDK separation. |
| `media-ui-react` | Hand-crafted + AI | Implemented prop-getter headless pattern for Grid, Lightbox, and Reel Swiper. |
| `app-web` UI | AI-steered via Skills | Built Web App by consuming the two `SKILL.md` guides. |

---

## Getting Started & Running Locally

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Tests
```bash
npm run test
```

### 3. Build Monorepo
```bash
npm run build
```

### 4. Run Web Application Demo
```bash
npm run dev
```

The showcase application will launch at `http://localhost:3000`.
