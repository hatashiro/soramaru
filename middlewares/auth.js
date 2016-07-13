import Twit from 'twit';
import twitterConfig from '../config/twitter';

export default function authMiddleware(req, res, next) {
  if (!req.user) {
    res.status(403).send('unauthorized');
    return;
  }

  req.twit = new Twit({
    consumer_key: twitterConfig.consumerKey,
    consumer_secret: twitterConfig.consumerSecret,
    access_token: req.user.token,
    access_token_secret: req.user.tokenSecret,
  });

  next();
}
