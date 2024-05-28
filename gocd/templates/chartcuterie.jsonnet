local chartcuterie = import './pipelines/chartcuterie.libsonnet';
local pipedream = import 'github.com/getsentry/gocd-jsonnet/libs/pipedream.libsonnet';

// Pipedream can be configured using this object, you can learn more about the
// configuration options here: https://github.com/getsentry/gocd-jsonnet#readme
local pipedream_config = {
  name: 'chartcuterie',
  auto_deploy: true,
  materials: {
    chartcuterie_repo: {
      git: 'git@github.com:getsentry/chartcuterie.git',
      shallow_clone: true,
      branch: 'master',
      destination: 'chartcuterie',
    },
  },
  rollback: {
    material_name: 'chartcuterie_repo',
    stage: 'deploy-primary',
    elastic_profile_id: 'chartcuterie',
  },
  exclude_regions: ['s4s', 'customer-1', 'customer-2', 'customer-3', 'customer-3', 'customer-4', 'customer-6', 'customer-7'],
};

pipedream.render(pipedream_config, chartcuterie)
