module.exports = {
  apps: [
    {
      name: 'myapp',
      script: './src/index.js',
      watch: true,
      env: {
        oAuthClientID:
          '127766624439-5dbt43cr0rhp5lvjq7a19btdhutd19k0.apps.googleusercontent.com',
        oAuthclientSecret: 'Od38LE2o3fRp4cpLJHsLDm-3',
        TELEGRAM_TOKEN: '1305964524:AAHNK54vy5zVd3ZEAUO00UOIKF0fW3HFOSk',
      },
    },
  ],
}
