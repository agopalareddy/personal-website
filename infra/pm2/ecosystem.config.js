// pm2 process definitions for the apps on contabo-showcase (agreddy.com).
//
// Previously these were started ad-hoc with `pm2 start <script> --name <name>`
// and only persisted in ~/.pm2/dump.pm2 — captured here during the GCP →
// Contabo migration so the process list is reproducible.
//
// Deploy:  pm2 start /opt/ecosystem.config.js && pm2 save
module.exports = {
  apps: [
    {
      name: 'chat-app',
      cwd: '/opt/chat-app',
      script: 'chat-server.js',
      max_memory_restart: '500M',
    },
    {
      name: 'storybook',
      cwd: '/opt/storybook-full/interactive-storybook',
      script: 'server/index.js',
      max_memory_restart: '700M',
    },
    {
      // server.js compiles + runs Connect4.java with { cwd: __dirname },
      // so it does not depend on the process cwd. Needs a JDK on PATH.
      name: 'connect4',
      cwd: '/opt/CS340Final-Connect4',
      script: 'server.js',
      max_memory_restart: '500M',
    },
    {
      name: 'lost-cities',
      cwd: '/opt/LostCities',
      script: 'server.js',
      max_memory_restart: '500M',
    },
    {
      // PORT is required — server.js defaults to 8082, which lost-cities owns.
      name: 'speedtest',
      cwd: '/opt/speedtest',
      script: 'server.js',
      max_memory_restart: '500M',
      env: {
        PORT: 8083,
        SERVER_LABEL: 'contabo-showcase (us-central)',
      },
    },
    {
      name: 'wellness-companion',
      cwd: '/opt/wellness-companion',
      script: '.venv/bin/python',
      args: '-m uvicorn app.fast_api_app:app --host 127.0.0.1 --port 8090',
      interpreter: 'none',
      max_memory_restart: '1G',
      env: {
        NO_COLOR: 1,
      },
    },
  ],
};
