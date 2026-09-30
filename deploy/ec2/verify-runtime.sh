#!/usr/bin/env bash
# Run as the zanich user after RDS setup. Never enable shell tracing here.
set -euo pipefail
set -a
source /etc/zanich/app.env
source /etc/zanich/database.env
set +a
cd /srv/zanich/current
node deploy/ec2/verify-rds.mjs
npm run check:production
