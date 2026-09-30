#!/usr/bin/env bash
# Run as the zanich user inside a new release directory, before activation.
set -euo pipefail
set -a
source /etc/zanich/app.env
set +a
export NODE_OPTIONS=--max-old-space-size=1536
export NEXT_TELEMETRY_DISABLED=1
export ZANICH_SMALL_INSTANCE=true
npm ci --no-audit --no-fund --maxsockets=3
npm run check:production
# Existing contract tests assert the final production canonical domain.
NEXT_PUBLIC_SITE_URL=https://zanichtraders.co.ke npm test
npm run typecheck
npm run lint
npm run build -- --webpack
mkdir -p .next/cache
