#!/bin/bash

/devinfra/scripts/checks/githubactions/checkruns.py \
  "getsentry/chartcuterie" \
  "${GO_REVISION_CHARTCUTERIE_REPO}" \
  "build"
