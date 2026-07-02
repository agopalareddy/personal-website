# Nginx & Analytics

Production Nginx configuration is tracked in `infra/nginx/` for reproducibility.

## Configuration layout

```
infra/nginx/
├── conf.d/
│   └── security-headers.conf   # CSP, HSTS, X-Frame-Options
├── sites-enabled/
│   └── showcase                # Main site vhost (HTTP + HTTPS + redirects)
└── deploy.sh                   # Sync, validate, reload
```

## Deploying Nginx changes

```bash
./infra/nginx/deploy.sh
```

The script:

1. `scp`s config files to the VM
2. Validates with `sudo nginx -t`
3. Reloads with `sudo nginx -s reload`
4. Verifies live CSP header includes GA4 endpoints

## CSP & GA4

The CSP `connect-src` directive must allow:

- `https://www.google-analytics.com`
- `https://www.google.com`
- `https://*.analytics.google.com`
- `https://www.googletagmanager.com`

If tightened, GA4 hits silently fail. Run `./scripts/verify_ga4.py` after CSP changes.

## GA4 verification

Source: `scripts/verify_ga4.py` (~5 KB)

Smoke tests the GA4 Realtime API using a service account key at `~/.config/gcp/ga-verifier.json` (gitignored).

```bash
./scripts/verify_ga4.py                    # defaults
./scripts/verify_ga4.py --property-id 123456
./scripts/verify_ga4.py --expect-min-users 1
```

Exits non-zero if the API call fails or no active users in the last 30 minutes.

## Source of truth

Live config on the GCP VM is authoritative. This directory is a snapshot for recovery. After changing configs on the VM, sync them back to the repo.

## Source map

- `infra/nginx/conf.d/security-headers.conf`
- `infra/nginx/sites-enabled/showcase`
- `infra/nginx/deploy.sh`
- `infra/nginx/README.md`
- `scripts/verify_ga4.py`
