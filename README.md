# FePlayground

This project is a Vue 3 playground using Vite, Element Plus, Pinia, and more. It includes mock API support, unit and e2e tests, and a rich set of scripts for
development and testing.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) +
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language
service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a
[Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following
steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev         # Start Vite dev server
npm run dev:mock    # Start dev server with mock API
npm run host        # Start dev server with host/https
```

### Type-Check, Compile and Minify for Production

```sh
npm run build       # Type-check and build for production
npm run build_dev   # Build for development mode
npm run buildTest   # Build with VITE_CJS_TRACE enabled
npm run build3      # Build using vue-tsc -b
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run preview         # Preview production build on port 5050
npm run test:e2e        # Open Cypress after preview
npm run test:e2e:ci     # Run Cypress headless after preview
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Type Checking

```sh
npm run typecheck   # Type-check using vue-tsc
```

### Check Node version [NodeVersion](https://github.com/coreybutler/nvm-windows)

```sh
nvm -v
```

### Update Packages with [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

```sh
ncu -u
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Mocking Information

This project uses mock data for display purposes only. The mock API does not support full CRUD operations and is limited to displaying data for a single
vehicle.

- Mock handlers are located in `src/mocks`.
- The mock data is used to simulate API responses for UI development and testing.
- No data is persisted or modified through the mock API.
- The mock setup is intended for frontend display and demo scenarios, not for backend emulation.

### Mocking Script

```sh
npm run dev:mock
```

(empty)

## Main Dependencies

- Vue 3
- Vite
- Element Plus
- Pinia
- Vue Router
- Vitest
- Cypress
- Lodash
- Axios
- Day.js
- Tiptap
- DomPurify

See `package.json` for the full list.
