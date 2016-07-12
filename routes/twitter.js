import Twit from 'twit';
import twitterConfig from '../config/twitter';
import { Router } from 'express';

const router = Router();

const authMiddleware = (req, res, next) => {
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
};

router.use(authMiddleware);

router.get('/lists', async (req, res) => {
  const raw = await req.twit.get('lists/list');
  res.json(raw.data.map(rawList => {
    return {
      id: rawList.id,
      name: rawList.name,
      description: rawList.description,
      uri: `https://twitter.com${rawList.uri}`,
      fullName: rawList.full_name,
    };
  }));
});

export default router;
