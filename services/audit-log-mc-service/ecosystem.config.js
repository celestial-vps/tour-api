module.exports = {
  apps: [
    {
      name: 'audit-api',
      script: 'server.js',          // file utama API
      watch: true,                  // opsional, restart saat file berubah (dev mode)
      autorestart: true,            // restart otomatis jika crash
      max_restarts: 10,             // maksimal restart beruntun
      env: {
        NODE_ENV: 'production',     // default env
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5001,                 // bisa sesuai .env.development
      }, 
    },
    {
      name: 'kafka-consumer',
      script: 'kafka-consumer.js',
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      }, 
    },
  ],
};
