#!/bin/bash

/devinfra/scripts/checks/googlecloud/check_cloudbuild.py \
  sentryio \
  chartcuterie \
  chartcuterie-branch-builder \
  "${GO_REVISION_CHARTCUTERIE_REPO}" \
  master
