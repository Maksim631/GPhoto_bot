import config from '../config.js'
import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.oAuthClientID,
  process.env.oAuthclientSecret,
  config.oAuthCallbackUrl,
)

export default oauth2Client;
