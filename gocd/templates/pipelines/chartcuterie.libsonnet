local gocdtasks = import 'github.com/getsentry/gocd-jsonnet/libs/gocd-tasks.libsonnet';

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
                LABEL_SELECTOR: 'service=chartcuterie,env=canary',
              },
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
              GITHUB_TOKEN: '{{SECRET:[devinfra-github][token]}}',
            },
            tasks: [
              gocdtasks.script(importstr '../bash/check-github-runs.sh'),
              gocdtasks.script(importstr '../bash/check-cloudbuild.sh'),
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
              LABEL_SELECTOR: 'service=chartcuterie',
            },
            tasks: [
              gocdtasks.script(importstr '../bash/deploy.sh'),
            ],
          },
        },
      },
    },
  ],
}
