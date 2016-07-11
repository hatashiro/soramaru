import appConfig from './app';

export default {
  consumerKey: 'TWITTER_CONSUMER_KEY',
  consumerSecret: 'TWITTER_CONSUMER_SECRET',
  callbackURL: `http://127.0.0.1:${appConfig.port}/auth/twitter/callback`
};
