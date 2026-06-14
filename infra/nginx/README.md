# Nginx Infrastructure

Tracked copies of nginx configuration for the personal-website production deployment on the GCP VM (`gcp-showcase`).

## Layout

```
infra/nginx/
├── conf.d/
│   └── security-headers.conf   # CSP, HSTS, X-Frame-Options, etc.
├── sites-enabled/
│   └── showcase                 # Main site config (HTTP+HTTPS+redirects)
└── deploy.sh                    # Sync script
```

## Source of truth

**`/etc/nginx/conf.d/security-headers.conf`** and **`/etc/nginx/sites-enabled/showcase`** on the GCP VM are the live truth.

This directory is a **snapshot for reproducibility and recovery**. If you change configs on the VM (e.g., to add a new reverse proxy location), sync them back to the repo:

```bash
# On VM
ssh gcp-showcase
sudo cat /etc/nginx/conf.d/security-headers.conf
sudo cat /etc/nginx/sites-enabled/showcase

# On local repo
pbcopy < <(ssh gcp-showcase 'sudo cat /etc/nginx/conf.d/security-headers.conf')
# paste into infra/nginx/conf.d/security-headers.conf
```

## Deploy

```bash
cd /home/adurs/repos/GCP_Projects/personal-website
./infra/nginx/deploy.sh         # uses gcp-showcase SSH alias
```

The script:

1. `scp`s both config files to the VM
2. Validates with `sudo nginx -t`
3. Reloads with `sudo nginx -s reload`
4. Verifies the live CSP header includes `google-analytics.com` (catches the GA4-blocking regression)

## CSP & GA4

The Content-Security-Policy `connect-src` directive in `conf.d/security-headers.conf` must allow:

- `https://www.google-analytics.com` — primary hit endpoint
- `https://www.google.com` — alternate `g/collect` endpoint
- `https://*.analytics.google.com` — regional endpoints
- `https://www.googletagmanager.com` — gtag bootstrap pings

If a future CSP change accidentally removes these, GA4 hits will silently fail (the script doesn't catch every case — manual eyeballing helps).

## Certbot-managed blocks

The `showcase` file contains `server { ... }` blocks with comments like `# managed by Certbot`. Do not edit those directly. To re-issue certificates:

```bash
ssh gcp-showcase
sudo certbot --nginx -d agreddy.com -d www.agreddy.com
```

## Reverse proxy endpoints

`showcase` proxies these paths to locally-running services (PM2-managed):

| Path            | Backend                             | Project               |
| --------------- | ----------------------------------- | --------------------- |
| `/storybook/`   | `127.0.0.1:8000`                    | interactive-storybook |
| `/api/`         | `127.0.0.1:8000`                    | interactive-storybook |
| `/chat/`        | `127.0.0.1:3456`                    | chat-app              |
| `/socket.io/`   | `127.0.0.1:3456`                    | chat-app              |
| `/connect4/`    | `127.0.0.1:8081`                    | Connect 4             |
| `/lost-cities/` | `127.0.0.1:8082`                    | Lost Cities           |
| `/calendar/`    | `unix:/var/run/php/php8.4-fpm.sock` | calendar-app          |

If a port changes, update this file and re-run `deploy.sh`.
