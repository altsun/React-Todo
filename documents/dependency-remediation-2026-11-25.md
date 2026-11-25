# Dependency remediation — 2026-11-25

Status: tested compatibility patch, not a complete security remediation. Baseline: `5413257`. No GitHub Dependabot alerts are claimed closed. The 24 November digest listed 23 package groups; live GitHub alert status was not verified.

## Compatibility groups

| Group | Candidate changes |
| --- | --- |
| 0 — resolution | Replace npm-force-resolutions and resolutions with native npm overrides; retain existing nth-check resolution only for css-select 2.1.0. |
| 1 — runtime/shared | path-to-regexp 1.9.0 under react-router 5.3.4; lodash 4.18.1; picomatch 2.3.2. |
| 2 — tooling | braces 3.0.3; minimatch 3.1.5/5.1.9; cross-spawn 6.0.6/7.0.6; flatted 3.4.4; micromatch 4.0.8. |
| 3 — high build | Babel SystemJS 7.29.15; rollup 2.80.0; jsonpath 1.3.0 with scoped underscore 1.13.8; svgo 2.8.4 on the 2.x branch. |
| 4 — other/partial | ejs 3.1.10; webpack 5.104.1; follow-redirects 1.16.2; yaml 1.10.3/2.9.1; middleware 5.3.4 and serialize-javascript 6.0.2 (partial only). |

`path-to-regexp` 1.x is reached through React Router; other candidates mostly affect build/lint/test/development tools. `lodash` and `picomatch` have shared dependency chains; bundle inclusion has not been verified. CRA is declared in root dependencies, so npm audit --omit=dev is not proof of runtime exposure.

## Remaining risk

- CRA 5 constrains webpack-dev-server 4.x, webpack-dev-middleware 5.x (CVE-2026-76844 remains), resolve-url-loader 4.x with PostCSS 7.x, old SVGR/SVGO 1.x, serialize-javascript 4.x/6.x (GHSA-5c6j-r48x-rmvq remains), uuid 8.x and @tootallnate/once 1.x. Do not force across incompatible major versions. Top-level PostCSS 8.5.28 and node-forge 1.4.3 were already present. Verify actual installed versions and current advisories before closing anything.
- jsonpath 1.3.0 pins underscore 1.13.6; override its child to 1.13.8 and verify build. Retain existing scoped nth-check workaround pending compatibility tests.
- Local npm audit still reports 25 package entries (11 high, 5 moderate, 9 low; 0 critical), compared with 40 on the baseline (20 high, 11 moderate, 9 low). These totals can include multiple dependency-chain entries for the same advisory; they do not establish production exploitability.

## Validation and release gate

- Downloaded the npm-generated lockfile from [the original draft run](https://github.com/altsun/React-Todo/actions/runs/45621561140) and verified the GitHub artifact digest. The audit there reported `follow-redirects` 1.16.0 as affected. Bumped only that same-major override to [1.16.2](https://github.com/follow-redirects/follow-redirects/releases/tag/v1.16.2), regenerated with npm, and verified that the generated delta from the artifact changed only that package. No manual lockfile changes.
- Node 22.23.5 and npm 10.9.9: clean `npm ci`, byte-for-byte lockfile comparison, `npm ls --all`, three app tests and production build passed. The original App test failed on the baseline as well: the fixture was missing Router and Redux Provider, not a dependency regression. The replacement covers routing, todo list/add, and login/callback/logout with Auth0 SDK mocks. No application runtime source was changed.
- PR CI uses the checked-in lockfile for all runs, including draft runs. It still uploads lock and audit artifacts and has no write or deployment step. Firebase preview is a separate workflow that skips drafts.
- Local Chromium loaded the production bundle at a direct /new-item URL, navigated to the list and back, and displayed a submitted todo. The todo feed was synthetic and the Auth0 authorize redirect was intercepted before network access. Live Auth0 and Firebase hosting were not exercised. Treat remaining CRA advisories as a separate migration decision, not a reason to force incompatible dependency versions into this patch.

References: https://github.com/altsun/React-Todo/security/dependabot ; https://github.com/altsun/healthtracker-front-end/pull/204 ; https://github.com/altsun/healthtracker-front-end/pull/211
