#!/bin/bash
cd /home/kavia/workspace/code-generation/hello-world-location-and-weather-dashboard-228752-228761/hello_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

