import { config } from '../../environment-hidden-prod';
export const environment = {
  production: true,
  api: config.api,
  client_id: config.client_id,
  client_secret: config.client_secret,
  refresh_token: config.refresh_token,
  firebase: config.firebaseConfig,
  facebookAppId: config.facebookAppId,
  socketUrl: config.socketUrl
};
