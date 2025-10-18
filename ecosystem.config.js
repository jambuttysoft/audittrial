module.exports = {
  apps: [
    {
      name: 'audit-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: { NODE_ENV: 'production', PORT: 3646, NEXT_TELEMETRY_DISABLED: '1' },
      instances: 1,
      exec_mode: 'fork',
      watch: false
    },
    {
      name: 'audit-backend',
      cwd: './backend',
      script: 'npm',
      args: 'start',
      env: { NODE_ENV: 'production', PORT: 3645, NEXT_TELEMETRY_DISABLED: '1' },
      instances: 1,
      exec_mode: 'fork',
      watch: false
    }
  ]
}