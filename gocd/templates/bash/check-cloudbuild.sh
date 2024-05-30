#!/bin/bash

/devinfra/scripts/checks/googlecloud/checkcloudbuild.py \
  --sha="${GO_REVISION_CHARTCUTERIE_REPO}" \
  --project="sentryio" \
  --image_name="us-central1-docker.pkg.dev/sentryio/chartcuterie/image"
