module.exports = {
  apps: [
    {
      name: 'audit-api',
      script: 'server.js', // Pastikan file ini ada dan benar
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'kafka-consumer',
      script: 'kafka-consumer.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
