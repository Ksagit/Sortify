# Master's Thesis

This repository contains my Master's Thesis as well as the projects created during writing it.

## Workspace Layout

- `apps/react` - React version of Sortify
- `apps/angular` - Angular version of Sortify
- `apps/thesis` - thesis sources

## Monorepo Commands

```bash
# Install dependencies for the whole workspace
pnpm install

# Run both apps through Turbo
pnpm dev

# Run only React
pnpm dev:react

# Run only Angular
pnpm dev:angular

# Build only the thesis PDF
pnpm build:thesis

# Build all apps
pnpm build
```

## Sortify - React

Interactive sorting algorithm visualizer built with React Router v7 and Tailwind CSS.

## Sortify - Angular

Interactive sorting algorithm visualizer rebuilt in Angular with standalone components, signals and Angular Router.

### Features

- Visual representation of sorting algorithms
- Step-by-step execution
- Adjustable animation speed
- Multiple sorting algorithms (Bubble Sort, Merge Sort, Quick Sort)

### Getting Started

```bash
# Install dependencies from the repo root
pnpm install

# Start only the React app
pnpm dev:react

# Build for production
pnpm --filter @sortify/react build
```

### Angular Getting Started

```bash
# Install dependencies from the repo root
pnpm install

# Start only the Angular app
pnpm dev:angular

# Build for production
pnpm --filter @sortify/angular build
```

### Tech Stack

- React 19
- React Router v7
- Tailwind CSS v4
- TypeScript
- Vite

## Angular Tech Stack

- Angular 21
- Angular Router
- Angular Signals
- TypeScript
- SCSS
