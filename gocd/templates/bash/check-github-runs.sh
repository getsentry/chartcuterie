#!/bin/bash

checks-githubactions-checkruns2 \
  "getsentry/chartcuterie" \
  "${GO_REVISION_CHARTCUTERIE_REPO}" \
  "build" \
  "Build and push production image"
