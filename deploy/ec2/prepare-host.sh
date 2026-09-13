#!/usr/bin/env bash
# Run as root on the inspected Amazon Linux 2023 app instance.
set -euo pipefail
preview_origin=${1:?Pass the temporary HTTP origin}
[[ "$preview_origin" =~ ^http://[a-zA-Z0-9.-]+$ ]] || { echo 'Invalid preview origin'; exit 1; }
if ! id zanich >/dev/null 2>&1; then
  useradd --system --create-home --home-dir /srv/zanich --shell /sbin/nologin zanich
fi
install -d -o root -g root -m 755 /srv/zanich /srv/zanich/releases
install -d -o root -g zanich -m 750 /etc/zanich
if [[ ! -e /etc/zanich/app.env ]]; then
  umask 027
  cat > /etc/zanich/app.env <<EOF
DEPLOYMENT_STAGE=preview
NEXT_PUBLIC_SITE_URL=$preview_origin
SITE_INDEXABLE=false
NEXT_PUBLIC_ANALYTICS_ENABLED=false
BRANDS_SERVED_CONFIRMED=false
TRUSTED_IP_HEADER=x-real-ip
NEXT_TELEMETRY_DISABLED=1
EOF
  chown root:zanich /etc/zanich/app.env
  chmod 640 /etc/zanich/app.env
fi
# The initial 1 GB instance needs headroom for dependency installation and builds.
if [[ ! -e /swapfile-zanich ]]; then
  fallocate -l 2G /swapfile-zanich
  chmod 600 /swapfile-zanich
  mkswap /swapfile-zanich
  swapon /swapfile-zanich
  printf '\n/swapfile-zanich none swap sw 0 0\n' >> /etc/fstab
fi
install -d -m 755 /etc/systemd/journald.conf.d
printf '[Journal]\nSystemMaxUse=100M\nMaxRetentionSec=14day\n' > /etc/systemd/journald.conf.d/zanich.conf
systemctl restart systemd-journald
node --version
npm --version
free -m
df -h /
