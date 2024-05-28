#!/bin/bash

/devinfra/scripts/checks/githubactions/checkruns.py \
  --repo="getsentry/chartcuterie" \
  --sha="${GO_REVISION_CHARTCUTERIE_REPO}" \
  --check_names="build"
