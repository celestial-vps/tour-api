module.exports = {
  apps: [
    {
      name: "tour-api",
      script: "server.js",   // sesuaikan kalau server ada di src/server.js
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 5101,
      },
    },
  ],
};
