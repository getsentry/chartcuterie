# Changelong 

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

