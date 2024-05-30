#!/bin/bash

/devinfra/scripts/checks/googlecloud/checkcloudbuild.py \
  "${GO_REVISION_CHARTCUTERIE_REPO}" \
  "sentryio" \
  "us-central1-docker.pkg.dev/sentryio/chartcuterie/image"
