#!/bin/bash

checks-googlecloud-check-cloudbuild \
  sentryio \
  chartcuterie \
  chartcuterie-branch-builder \
  "${GO_REVISION_CHARTCUTERIE_REPO}" \
  master
