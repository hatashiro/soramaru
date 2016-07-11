import passport from 'passport';
import twitterConfig from '../config/twitter';
import TwitterStrategy from 'passport-twitter';
import User from '../models/user';

let user = null;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  done(null, await User.findById(id));
});

function getThumbnail(profile) {
  if (profile.photos.length === 0) {
    return null;
  }

  return profile.photos[0].value;
}

const twitterStrategy = new TwitterStrategy(
  twitterConfig,
  async (token, tokenSecret, profile, callback) => {
    const user = await User.insertOrUpdate({
      id: profile.id,
      username: profile.username,
      thumbnail: getThumbnail(profile),
      token,
      tokenSecret,
    });

    callback(null, await User.findById(profile.id));
  }
);

export default twitterStrategy;
