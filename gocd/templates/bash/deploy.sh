#!/bin/bash

eval $(regions-project-env-vars --region="${SENTRY_REGION}")

/devinfra/scripts/get-cluster-credentials \
  && k8s-deploy \
  --label-selector="${LABEL_SELECTOR}" \
  --image="us-docker.pkg.dev/sentryio/chartcuterie-mr/image:${GO_REVISION_CHARTCUTERIE_REPO}" \
  --container-name="chartcuterie"
