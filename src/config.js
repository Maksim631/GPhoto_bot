const config = {
  // The OAuth client ID from the Google Developers console.
  oAuthClientID:
    '127766624439-5dbt43cr0rhp5lvjq7a19btdhutd19k0.apps.googleusercontent.com',

  // The OAuth client secret from the Google Developers console.
  oAuthclientSecret: 'uWDx3NN3Ry_6Ib201dhil-lT',

  // The callback to use for OAuth requests. This is the URL where the app is
  // running. For testing and running it locally, use 127.0.0.1.
  oAuthCallbackUrl: 'https://max.andrewsha.net/auth/google/callback',
  
  // The scopes to request. The app requires the photoslibrary.readonly and
  // plus.me scopes.
  scopes: [
    'https://www.googleapis.com/auth/photoslibrary.appendonly',
    'profile',
  ],

  // The API end point to use. Do not change.
  apiEndpoint: 'https://photoslibrary.googleapis.com',

  tgToken: '1305964524:AAHVgkCtEKnR9swVbgqyxhxb1W1yh4giuFQ',

  // The port where the app should listen for requests.

  port: 3000,
}

export default config
