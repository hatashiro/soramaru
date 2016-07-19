import route from './async-route';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

function rateLimitExceeded(raw) {
  return raw.data.errors &&
         raw.data.errors.some(err => err.code === 88);
}

router.get('/lists', route(async (req, res) => {
  let listsCache = req.session.listsCache;

  if (!listsCache || Date.now() - listsCache.timestamp > 60 * 1000) {
    const raw = await req.twit.get('lists/list');

    if (rateLimitExceeded(raw) && !listsCache) {
      res.status(429).send('too many requests');
      return;
    }

    listsCache = req.session.listsCache = { timestamp: Date.now(), data: raw.data };
  }

  res.json(listsCache.data.map(rawList => {
    return {
      id: rawList.id,
      name: rawList.name,
      slug: rawList.slug,
      owner: rawList.user.screen_name,
      description: rawList.description,
      url: `https://twitter.com${rawList.uri}`,
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
  const user = formatUser(status.user);
  return {
    idStr: status.id_str,
    user,
    text: status.text,
    url: `https://twitter.com/${user.screenName}/status/${status.id_str}`,
    photos: photos.map(formatPhoto),
    favorited: status.favorited,
    datetime: status.created_at,
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

  if (rateLimitExceeded(raw)) {
    res.status(429).send('too many requests');
    return;
  }

  let rawStatuses = raw.data;

  // exclude 'from' status
  if (req.query.from) {
    rawStatuses = rawStatuses.filter(status => status.id_str !== req.query.from);
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

  await Promise.all(statuses.map(async status => {
    const list = `${req.params.owner}/${req.params.slug}`;
    Object.assign(status, {archived: await req.user.hasArchived(list, status.idStr)})
  }));

  res.json({
    from: rawStatuses[rawStatuses.length - 1].id_str,
    to: rawStatuses[0].id_str,
    total: rawStatuses.length,
    filtered: statuses.length,
    statuses
  });
}));

router.post('/like', route(async (req, res) => {
  let raw = await req.twit.post('favorites/create', {
    id: req.body.statusId,
    include_entities: true,
  });

  if (rateLimitExceeded(raw)) {
    res.status(429).send('too many requests');
    return;
  }

  if (raw.data.errors && raw.data.errors[0].code === 139) {
    raw = await req.twit.get(`statuses/show/${req.body.statusId}`, {
      trim_user: false,
      include_entities: true,
    });

    if (rateLimitExceeded(raw)) {
      res.status(429).send('too many requests');
      return;
    }
  }

  const status = formatStatus(raw.data);

  const list = `${req.body.owner}/${req.body.slug}`;
  try {
    await req.user.saveStatus(list, status);
  } catch (err) {
    if (err.name !== 'SequelizeUniqueConstraintError') {
      throw err;
    }
  }

  res.json(status);
}));

router.get('/:id', route(async (req, res) => {
  res.json(await req.twit.get(`statuses/show/${req.params.id}`, {
    trim_user: false,
    include_entities: true,
  }));
}));

export default router;
