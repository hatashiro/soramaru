import passport from 'passport';
import twitterConfig from '../config/twitter';
import TwitterStrategy from 'passport-twitter';

let user = null;

passport.serializeUser((user, done) => {
  done(null, 1);
});

passport.deserializeUser((id, done) => {
  done(null, user);
});

const twitterStrategy = new TwitterStrategy(
  twitterConfig,
  (token, tokenSecret, profile, callback) => {
    // TODO
    user = {token, tokenSecret, profile};
    callback(null, user);
  }
);

export default twitterStrategy;
