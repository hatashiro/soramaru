import passport from 'passport';
import twitterConfig from '../config/twitter';
import TwitterStrategy from 'passport-twitter';
import { client as redis } from '../lib/redis';

const key = id => `soramaru|user|${id}`;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  redis.get(key(id), (err, raw) => {
    if (err) {
      done(err);
      return;
    }

    done(null, JSON.parse(raw));
  });
});

function getThumbnail(profile) {
  if (profile.photos.length === 0) {
    return null;
  }

  return profile.photos[0].value;
}

const twitterStrategy = new TwitterStrategy(
  twitterConfig,
  (token, tokenSecret, profile, callback) => {
    const user = {
      id: profile.id,
      username: profile.username,
      thumbnail: getThumbnail(profile),
      token,
      tokenSecret,
    };

    redis.set(key(profile.id), JSON.stringify(user), err => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, user);
    });
  }
);

export default twitterStrategy;
