#!/bin/bash

/devinfra/scripts/checks/googlecloud/checkcloudbuild.py \
  "${GO_REVISION_CHARTCUTERIE_REPO}" \
  sentryio \
  "us.gcr.io/sentryio/chartcuterie"
