# Changelong 

## 0.6.0

### Various fixes & improvements

- deps: bump to node 20 to match sentry (#138) by @JonasBa
- chore: Capture config rendering errors as a Sentry error event (#136) by @dashed
- Fix not a git repo in GoCD validation action (#133) by @mattgauntseo-sentry
- ci: add GoCD pipeline validation (#130) by @joshuarli
- Make chartcuterie auto-deploy (#126) by @mattgauntseo-sentry
- build(deps): bump http-cache-semantics from 4.1.0 to 4.1.1 (#118) by @dependabot
- build(deps): bump @sideway/formula from 3.0.0 to 3.0.1 (#123) by @dependabot
- Progress from canary to prod without manual approval (#125) by @mattgauntseo-sentry
- chore: bump profiling sample rate to 1 (#124) by @AbhiPrasad
- chore: Upgrade Sentry JS SDK to 7.49.0 (#122) by @AbhiPrasad
- cd: auto canary and simplify (#121) by @joshuarli
- Update to new k8s deploy script (#120) by @mattgauntseo-sentry
- gocd: TIL job level env vars don't work (#115) by @joshuarli
- gocd: need github_token (#114) by @joshuarli
- add canary deployment stage for gocd (#113) by @asottile-sentry
- cd: add GoCD deployment pipeline (#111) by @joshuarli
- chore(deps): bump echarts from 5.3.3 to 5.4.0 (#109) by @gggritso
- Clarify local environment dependencies (#110) by @gggritso
- Remove multiarch image (#108) by @mattgauntseo-sentry
- Fix names for image jobs (#106) by @mattgauntseo-sentry
- Add ghcrio image (#105) by @mattgauntseo-sentry
- deps(sentry): bump packages (#104) by @JonasBa
- deps(profiling): bump 0.0.6 (#103) by @JonasBa
- deps(profiling): bump @sentry/profiling-node to 0.0.5 (#102) by @JonasBa

_Plus 39 more_

## 0.5.0

- Adds polling capabilities to reload the configuration periodically in when
  running in server mode.

## 0.4.0

- No documented changes.

## 0.3.0

- Actually build before releasing :)

## 0.2.0

- Inital implementation that produces charts

