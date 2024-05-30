#!/bin/bash

eval $(/devinfra/scripts/regions/project_env_vars.py --region="${SENTRY_REGION}")

/devinfra/scripts/k8s/k8stunnel \
  && /devinfra/scripts/k8s/k8s-deploy.py \
  --label-selector="${LABEL_SELECTOR}" \
  --image="us-central1-docker.pkg.dev/sentryio/chartcuterie/image:${GO_REVISION_CHARTCUTERIE_REPO}" \
  --container-name="chartcuterie"
