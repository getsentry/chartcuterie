#!/bin/bash

checks-githubactions-checkruns \
  "getsentry/chartcuterie" \
  "${GO_REVISION_CHARTCUTERIE_REPO}" \
  "build"
