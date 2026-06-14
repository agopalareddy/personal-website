#!/usr/bin/env bash
# Sync nginx config from repo to GCP VM, validate, and reload.
#
# Usage: ./deploy.sh [ssh-alias]
#   ssh-alias: defaults to "gcp-showcase" (see ~/.ssh/config)
#
# This script is idempotent and safe to re-run.

set -euo pipefail

SSH_TARGET="${1:-gcp-showcase}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Files to sync (paths relative to this script)
CONFIGS=(
  "conf.d/security-headers.conf:/etc/nginx/conf.d/security-headers.conf"
  "sites-enabled/showcase:/etc/nginx/sites-enabled/showcase"
)

echo "==> Syncing nginx configs to ${SSH_TARGET}"
for entry in "${CONFIGS[@]}"; do
  local_rel="${entry%%:*}"
  remote_abs="${entry#*:}"
  local_path="${SCRIPT_DIR}/${local_rel}"
  if [[ ! -f "${local_path}" ]]; then
    echo "    [skip] ${local_rel} (not found locally)" >&2
    continue
  fi
  echo "    [scp]  ${local_rel} -> ${remote_abs}"
  scp -q "${local_path}" "${SSH_TARGET}:/tmp/nginx-deploy.tmp"
  ssh -q "${SSH_TARGET}" "sudo install -m 644 -o root -g root /tmp/nginx-deploy.tmp ${remote_abs} && sudo rm -f /tmp/nginx-deploy.tmp"
done

echo "==> Validating nginx config"
ssh -q "${SSH_TARGET}" "sudo nginx -t"

echo "==> Reloading nginx"
ssh -q "${SSH_TARGET}" "sudo nginx -s reload"

echo "==> Verifying live CSP header"
if ssh -q "${SSH_TARGET}" "curl -sI 'http://127.0.0.1/?cb='\$RANDOM" | grep -i 'content-security-policy' | grep -q 'google-analytics.com'; then
  echo "    [ok]  CSP includes google-analytics.com"
else
  echo "    [warn] CSP does NOT include google-analytics.com — check deploy" >&2
  exit 1
fi

echo "==> Done. Site live with synced config."
