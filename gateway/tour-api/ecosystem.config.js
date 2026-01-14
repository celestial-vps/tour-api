module.exports = {
  apps: [
    {
      name: 'tour-api',
      script: 'server.js',          // file utama API
      watch: true,                  // opsional, restart saat file berubah (dev mode)
      autorestart: true,            // restart otomatis jika crash
      max_restarts: 10,             // maksimal restart beruntun
      env: {
        NODE_ENV: 'production',     // default env
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5101,                 // bisa sesuai .env.development
      }, 
    },
     
  ],
};
