local gocdtasks = import 'github.com/getsentry/gocd-jsonnet/libs/gocd-tasks.libsonnet';

// Regions that deploy by committing images to materialized-ops and waiting for ArgoCD.
local argocd_only_regions = ['s4s2'];

local argocd_only_env(region) =
  if std.member(argocd_only_regions, region) then {
    ARGOCD_ONLY: 'true',
    ARGOCD_SERVICE: 'chartcuterie',
  } else {};

local deploy_canary(region) =
  if region == 'us' || region == 'de' then
    [
      {
        'deploy-canary': {
          fetch_materials: true,
          jobs: {
            deploy: {
              timeout: 600,
              elastic_profile_id: 'chartcuterie',
              environment_variables: {
                // k8s-deploy dispatches deployment workflows using GitHub App credentials.
                GITHUB_APP_ID: '{{SECRET:[devinfra-github][app_id]}}',
                GITHUB_APP_PRIVATE_KEY: '{{SECRET:[devinfra-github][private_key]}}',
                LABEL_SELECTOR: 'service=chartcuterie,env=canary',
              } + argocd_only_env(region),
              tasks: [
                gocdtasks.script(importstr '../bash/deploy.sh'),
                gocdtasks.script(importstr '../bash/wait-canary.sh'),
              ],
            },
          },
        },
      },
    ]
  else
    [];

function(region) {
  environment_variables: {
    // SENTRY_REGION is used by the dev-infra scripts to connect to GKE
    SENTRY_REGION: region,
  },
  materials: {
    chartcuterie_repo: {
      git: 'git@github.com:getsentry/chartcuterie.git',
      shallow_clone: true,
      branch: 'master',
      destination: 'chartcuterie',
    },
  },
  lock_behavior: 'unlockWhenFinished',
  stages: [
    {
      checks: {
        fetch_materials: true,
        jobs: {
          checks: {
            timeout: 1200,
            elastic_profile_id: 'chartcuterie',
            environment_variables: {
              GITHUB_APP_ID: '{{SECRET:[devinfra-github][app_id]}}',
              GITHUB_APP_PRIVATE_KEY: '{{SECRET:[devinfra-github][private_key]}}',
            },
            tasks: [
              gocdtasks.script(importstr '../bash/check-github-runs.sh'),
            ],
          },
        },
      },
    },
  ] + deploy_canary(region) + [
    {
      'deploy-primary': {
        fetch_materials: true,
        jobs: {
          deploy: {
            timeout: 600,
            elastic_profile_id: 'chartcuterie',
            environment_variables: {
              // k8s-deploy dispatches deployment workflows using GitHub App credentials.
              GITHUB_APP_ID: '{{SECRET:[devinfra-github][app_id]}}',
              GITHUB_APP_PRIVATE_KEY: '{{SECRET:[devinfra-github][private_key]}}',
              LABEL_SELECTOR: 'service=chartcuterie',
            } + argocd_only_env(region),
            tasks: [
              gocdtasks.script(importstr '../bash/deploy.sh'),
            ],
          },
        },
      },
    },
  ],
}
