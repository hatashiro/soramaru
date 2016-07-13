import route from './async-route';
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

router.get('/lists', route(async (req, res) => {
  const raw = await req.twit.get('lists/list');
  res.json(raw.data.map(rawList => {
    return {
      id: rawList.id,
      name: rawList.name,
      slug: rawList.slug,
      owner: rawList.user.screen_name,
      description: rawList.description,
      uri: `https://twitter.com${rawList.uri}`,
      fullName: rawList.full_name,
    };
  }));
}));

function getPhotos(status) {
  if (!status.entities.media) {
    return [];
  }
  return status.entities.media.filter(media => media.type === 'photo');
}

function formatStatus(status) {
  const photos = getPhotos(status);
  return {
    id: status.id,
    user: formatUser(status.user),
    text: status.text,
    url: photos[0].url,
    photos: photos.map(formatPhoto),
  };
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    screenName: user.screen_name,
    profileImage: user.profile_image_url,
  };
}

function formatPhoto(photo) {
  return {
    default: photo.media_url,
    small: photo.sizes.small ? photo.media_url + ':small' : null,
    large: photo.sizes.small ? photo.media_url + ':large' : null,
    thumb: photo.sizes.small ? photo.media_url + ':thumb' : null,
  };
}

router.get('/lists/:owner/:slug', route(async (req, res) => {
  const raw = await req.twit.get('lists/statuses', {
    slug: req.params.slug,
    owner_screen_name: req.params.owner,
    since_id: req.query.from,
    max_id: req.query.to,
    count: 50,
  });

  let rawStatuses = raw.data;

  // exclude 'from' status
  if (req.query.from) {
    const fromId = parseInt(req.query.from, 10);
    rawStatuses = rawStatuses.filter(status => status.id !== fromId);
  }

  if (rawStatuses.length === 0) {
    res.json({ from: null, to: null, total: 0, filtered: 0, statuses: [] });
    return;
  }

  const statuses = rawStatuses
    .filter(rawStatus => getPhotos(rawStatus).length > 0)
    .map(rawStatus => rawStatus.retweeted_status ?
      Object.assign(formatStatus(rawStatus.retweeted_status), {
        retweeter: formatUser(rawStatus.user)
      }) :
      formatStatus(rawStatus)
    );

  res.json({
    from: rawStatuses[rawStatuses.length - 1].id,
    to: rawStatuses[0].id,
    total: rawStatuses.length,
    filtered: statuses.length,
    statuses
  });
}));

export default router;
