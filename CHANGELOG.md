# Changelong 

## 0.13.0

### Internal Changes 🔧

- Update @sentry/node to 11.0.0-alpha.1 by @andreiborza in [#244](https://github.com/getsentry/chartcuterie/pull/244)

## 0.12.0

### New Features ✨

- (telemetry) Add chart style and config version span attributes by @DominikB2014 in [#233](https://github.com/getsentry/chartcuterie/pull/233)
- Publish Docker image to GHCR by @aldy505 in [#218](https://github.com/getsentry/chartcuterie/pull/218)

### Bug Fixes 🐛

#### Render

- Disable return before full canvas paint by @nikkikapadia in [#237](https://github.com/getsentry/chartcuterie/pull/237)
- Disable ECharts progressive rendering with threshold by @nikkikapadia in [#236](https://github.com/getsentry/chartcuterie/pull/236)
- Disable ECharts progressive rendering by @gggritso in [#235](https://github.com/getsentry/chartcuterie/pull/235)

#### Other

- (explore) Allow ECharts to create more `canvas` elements by @gggritso in [#231](https://github.com/getsentry/chartcuterie/pull/231)
- Disable ECharts progressive rendering by @gggritso in [#234](https://github.com/getsentry/chartcuterie/pull/234)
- Revert "build(docker): Switch to Docker Hardened Images (DHI) (#214)" by @malwilley in [#215](https://github.com/getsentry/chartcuterie/pull/215)

### Internal Changes 🔧

#### Deps

- Bump echarts from 6.0.0 to 6.1.0 by @gggritso in [#228](https://github.com/getsentry/chartcuterie/pull/228)
- Bump brace-expansion from 2.0.2 to 2.0.3 by @dependabot in [#222](https://github.com/getsentry/chartcuterie/pull/222)
- Bump flatted from 3.2.7 to 3.4.2 by @dependabot in [#219](https://github.com/getsentry/chartcuterie/pull/219)
- Upgrade Node.js to 24 LTS and harden Docker image by @oioki in [#211](https://github.com/getsentry/chartcuterie/pull/211)
- Fix npm audit vulnerabilities via eslint-config-sentry-app upgrade by @oioki in [#210](https://github.com/getsentry/chartcuterie/pull/210)
- Upgrade js-yaml 4.x to 4.1.1 to fix GHSA-mh29-5h37-fv8m by @oioki in [#209](https://github.com/getsentry/chartcuterie/pull/209)
- Upgrade js-yaml 3.x to 3.14.2 to fix GHSA-mh29-5h37-fv8m by @oioki in [#208](https://github.com/getsentry/chartcuterie/pull/208)
- Bump @sentry/node and force minimatch to fix GHSA-3ppc-4f35-3m26 by @oioki in [#207](https://github.com/getsentry/chartcuterie/pull/207)
- Bump express and supertest to fix qs prototype pollution by @oioki in [#206](https://github.com/getsentry/chartcuterie/pull/206)
- Force json5 to >=2.2.3 via yarn resolutions by @oioki in [#205](https://github.com/getsentry/chartcuterie/pull/205)
- Bump canvas by @aldy505 in [#200](https://github.com/getsentry/chartcuterie/pull/200)
- Bump form-data from 4.0.0 to 4.0.4 by @dependabot in [#191](https://github.com/getsentry/chartcuterie/pull/191)
- Bump @babel/traverse from 7.20.1 to 7.25.7 by @dependabot in [#175](https://github.com/getsentry/chartcuterie/pull/175)
- Bump lodash from 4.17.21 to 4.17.23 by @dependabot in [#203](https://github.com/getsentry/chartcuterie/pull/203)

#### Docker

- Switch to Docker Hardened Images (DHI) by @oioki in [#214](https://github.com/getsentry/chartcuterie/pull/214)
- Switch to Docker Hardened Images (DHI) by @oioki in [#212](https://github.com/getsentry/chartcuterie/pull/212)

#### Gocd

- Bump gocd-jsonnet to v3.0.7 by @dmajere in [#239](https://github.com/getsentry/chartcuterie/pull/239)
- Gocd-jsonnet 3.0.4 by @dmajere in [#227](https://github.com/getsentry/chartcuterie/pull/227)
- Gocd-jsonnet 3.0.1 by @dmajere in [#224](https://github.com/getsentry/chartcuterie/pull/224)
- Bump gocd lib version to v2.18.0 by @dmajere in [#201](https://github.com/getsentry/chartcuterie/pull/201)

#### Other

- (release) Switch from action-prepare-release to Craft by @BYK in [#202](https://github.com/getsentry/chartcuterie/pull/202)
- Update @sentry/node to 11.0.0-alpha.0 by @andreiborza in [#242](https://github.com/getsentry/chartcuterie/pull/242)
- Remove disabled changelog-preview workflow by @oioki in [#241](https://github.com/getsentry/chartcuterie/pull/241)
- Update Node.js to 20.20.0 by @oioki in [#204](https://github.com/getsentry/chartcuterie/pull/204)

## 0.11.2

### Various fixes & improvements

- PRODENG-519: publish to MR registry in cloud build, pull from MR registry in craft (#198) by @mwarkentin
- PRODENG-519: push chartcuterie images to both SR and MR registries (#197) by @mwarkentin
- feat: upgrade to echarts v6 (#195) by @scttcper

## 0.11.0

### Various fixes & improvements

- chore: Bump @sentry/node to 10.0.0 (#194) by @andreiborza

## 0.10.0

### Various fixes & improvements

- chore: Use `10.0.0-beta.0` of `@sentry/node` for dogfooding (#193) by @andreiborza

## 0.9.0

### Various fixes & improvements

-  chore: Use `10.0.0-alpha.2` of `@sentry/node` for dogfooding (#192) by @andreiborza

## 0.8.0

### Various fixes & improvements

- chore: Use `10.0.0-alpha.1` of `@sentry/node` for dogfooding (#190) by @andreiborza
- ref(gocd): use console script entry points (#188) by @mchen-sentry

## 0.7.0

### Various fixes & improvements

- chore: Swap back to stable `@sentry/node` SDK (#189) by @andreiborza

## 0.6.0

### Various fixes & improvements

- chore: Use `9.36.0-alpha.2` of `@sentry/node` for dogfooding (#187) by @andreiborza
- Upgrade express to latest `4.21.2` version (#186) by @AbhiPrasad
- feat(deps): Upgrade Sentry SDKs from `9.16.1` to `9.30.0` (#185) by @AbhiPrasad
- feat(deps): Upgrade JS SDK to 9.16.1 (#183) by @AbhiPrasad
- feat: Send chartcuterie logs to Sentry (#182) by @AbhiPrasad
- ref(gocd): Cutting over to check_cloudbuild.py (#181) by @IanWoodard
- bump profiling and run it as trace lifecycle (#180) by @JonasBa
- deps: Bump SDK to `9.0.0-alpha.0` (#179) by @lforst
- feat(devservices): Add chartcuterie config (#178) by @hubertdeng123
- deps: bump sentry (#174) by @JonasBa
- build(deps): bump express from 4.18.1 to 4.20.0 (#168) by @dependabot
- build(deps): bump micromatch from 4.0.5 to 4.0.8 (#167) by @dependabot
- ref: Use the VM to execute local config files (#171) by @evanpurkhiser
- chore(ci): Updating and pinning all github actions used (#172) by @IanWoodard
- fix: Inject queueMicrotask into runInNewContext globals (#169) by @evanpurkhiser
- change: Update gocd jsonlib to 2.13 (#166) by @dmajere
- build(deps): bump braces from 3.0.2 to 3.0.3 (#159) by @dependabot
- Enable chartcuterie deploy where it needed (#165) by @nirajdewani
- chore(gocd): adding s4s deploy (#164) by @IanWoodard
- deps(sentry) bump to 8.11 (#163) by @JonasBa
- desp: bump sentry to 8.10.0 (#162) by @JonasBa
- feat(profiling) use continuous profiler instead of the span/txn based one (#161) by @JonasBa
- deps: bump sentry to 8.9 (#160) by @JonasBa
- fix(gocd): Adding elastic_profile_id (#158) by @IanWoodard

_Plus 78 more_

## 0.5.0

- Adds polling capabilities to reload the configuration periodically in when
  running in server mode.

## 0.4.0

- No documented changes.

## 0.3.0

- Actually build before releasing :)

## 0.2.0

- Inital implementation that produces charts

