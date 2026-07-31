# pm2 process definitions

`ecosystem.config.js` defines the six pm2-managed apps that run alongside this
site on the showcase VM and are reverse-proxied by `infra/nginx/`. They live in
their own repositories — only the process definitions are tracked here, next to
the nginx config that routes to them.

Before the GCP → Contabo migration these were started ad-hoc with
`pm2 start <script> --name <name>`, so the only record was `~/.pm2/dump.pm2` on
the VM. Two settings that were invisible that way and are easy to lose:

- `speedtest` needs `PORT=8083`; `server.js` defaults to `8082`, which
  `lost-cities` already uses.
- `SERVER_LABEL` is displayed in the speedtest UI, so it names the host.

`connect4` and `lost-cities` shell out to `javac`/`java` at startup and need a
JDK on the box.

## Deploy

```bash
scp infra/pm2/ecosystem.config.js contabo-showcase:/opt/ecosystem.config.js
ssh contabo-showcase "cd /tmp && sudo -u adurs env HOME=/home/adurs pm2 start /opt/ecosystem.config.js && sudo -u adurs env HOME=/home/adurs pm2 save"
```

`cd /tmp` matters — pm2 spawns fail with `EACCES` if the working directory
isn't readable by `adurs` (e.g. running from `/root`).

Boot persistence is via `pm2 startup systemd -u adurs --hp /home/adurs`, which
installs `pm2-adurs.service`.
