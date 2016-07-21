import route from './async-route';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', route(async (req, res) => {
  const archives = await req.user.listArchives();

  let listsCache = req.session.listsCache;

  if (!listsCache) {
    res.json(archives.map(archive => {
      const [owner, slug] = archive.split('/');
      return { owner, slug, name: slug };
    }));
    return;
  }

  const lists = listsCache.data.reduce((lists, rawList) => {
    lists[`${rawList.user.screen_name}/${rawList.slug}`] = {
      owner: rawList.user.screen_name,
      slug: rawList.slug,
      name: rawList.name,
    };
    return lists;
  }, {});

  res.json(archives.map(archive => {
    if (lists[archive]) {
      return lists[archive];
    }

    const [owner, slug] = archive.split('/');
    return { owner, slug, name: slug };
  }));
}));

router.get('/:owner/:slug', route(async (req, res) => {
  const list = `${req.params.owner}/${req.params.slug}`;
  const statuses = await req.user.listStatuses(list, req.query.to);

  if (statuses.length === 0) {
    res.json({ from: null, to: null, total: 0, filtered: 0, statuses: [] });
    return;
  }

  res.json({
    from: statuses[statuses.length - 1].idStr,
    to: statuses[0].idStr,
    total: statuses.length,
    filtered: statuses.length,
    statuses
  });
}));

export default router;
