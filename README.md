# React Todo

A React 18 todo demo using React Router, Redux Saga and Auth0. Vite builds the application and Vitest runs the component tests.

## Development

Use Node.js 22.22.2+ on the Node 22 line (the version used by CI), or a supported newer Node version listed in `package.json`.

- `npm ci` installs the locked dependencies.
- `npm start` starts Vite at [http://localhost:3000](http://localhost:3000). The strict port keeps the existing Auth0 callback URL stable.
- `npm test` runs the Vitest suite once; `npm run test:watch` watches for changes.
- `npm run build` creates the production site in `build/`; `npm run preview` serves that build locally on port 3000.
- `npx playwright install --only-shell chromium`, then `npm run build && npm run test:browser`, exercises the build in Chromium on port 3000. The browser scenarios use synthetic todo data and intercept the Auth0 authorization request; component tests cover callback/logout with a mocked SDK.

The production build follows Vite's default modern browser target. The legacy CRA Browserslist matrix is not tested for parity.

## Hosting

Firebase Hosting still publishes `build/` and rewrites SPA routes to `index.html`. The Firebase PR workflow is unchanged. It deploys previews for non-draft PRs from this repository, not production releases.

The existing Auth0 tenant and its localhost callback/logout URLs are unchanged. A live hosted login requires the appropriate allowed URLs and configuration in Auth0. Automated tests do not use the tenant or production Firebase.
