#!/bin/bash

eval $(regions-project-env-vars --region="${SENTRY_REGION}")

IMAGE="us-central1-docker.pkg.dev/sentryio/chartcuterie/image:${GO_REVISION_CHARTCUTERIE_REPO}"

/devinfra/scripts/get-cluster-credentials \
  && k8s-deploy \
  --label-selector="${LABEL_SELECTOR}" \
  --image="${IMAGE}" \
  --container-name="chartcuterie" \
  && materialized-ops-set-image \
  --service="chartcuterie" \
  --label-selector="${LABEL_SELECTOR}" \
  --container-name="chartcuterie" \
  --image="${IMAGE}"
