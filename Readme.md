# React E-Comm Website

A single-page product catalog and shopping cart built with React. It lists
products, lets you filter them by search, view product details, and manage a
basket with persisted quantities — all backed by client-side state, no
server of its own.

## Features

- Product catalog rendered from a live API, with loading and error states
- Debounced search that filters products by title and category
- Product detail view with quantity selection
- Shopping basket (add, update quantity, remove) persisted to `localStorage`
- Light/dark theme toggle
- Responsive layout for mobile and desktop

## Tech stack

- [React 18](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management, including a listener middleware for basket persistence
- [React Router 7](https://reactrouter.com/) for routing
- [Vite 6](https://vitejs.dev/) for tooling and dev server
- Hand-written CSS (no UI framework)

## Screenshots

_Add screenshots of the catalog, product details, and basket views here._

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # production build
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Data source

Product data is fetched from the public
[fakestoreapi.com](https://fakestoreapi.com) demo API, which requires no API
key. This project has **no backend of its own** — there is no real order
processing, payment, authentication, or persistence beyond the browser's
`localStorage`. It is a frontend sample only.
