const defaultConfig = {
  // The callback to use for OAuth requests. This is the URL where the app is
  // running. For testing and running it locally, use 127.0.0.1.
  oAuthCallbackUrl: 'https://max.andrewsha.net/auth/google/callback',

  // The scopes to request. The app requires the photoslibrary.readonly and
  // plus.me scopes.
  scopes: [
    'https://www.googleapis.com/auth/photoslibrary.appendonly',
    'profile',
  ],

  mongodb: 'mongodb://mongo:27017/gphoto-bot',
  // The API end point to use. Do not change.
  apiEndpoint: 'https://photoslibrary.googleapis.com',

  port: 22000,
}

const devConfig = {
  ...defaultConfig,
  oAuthCallbackUrl: 'http://127.0.0.1:22000/auth/google/callback',
  mongodb: 'mongodb://localhost:27017/gphoto-bot',
}

const config = process.argv.includes('dev') ? devConfig : defaultConfig


export default config