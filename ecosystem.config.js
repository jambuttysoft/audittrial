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
      env: { NODE_ENV: 'production', PORT: 3645, NEXT_TELEMETRY_DISABLED: '1', GEMINI_MODEL: 'gemini-2.5-flash-lite', PRISMA_CLIENT_ENGINE_TYPE: 'binary', DATABASE_URL: 'mysql://root:test1234@localhost:3306/audittrial?connection_limit=10&pool_timeout=60'},
      instances: 1,
      exec_mode: 'fork',
      watch: false
    }
  ]
}