import route from './async-route';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', route(async (req, res) => {
  res.json(await req.user.listArchives());
}));

router.get('/:owner/:slug', route(async (req, res) => {
  const list = `${req.params.owner}/${req.params.slug}`;
  const statuses = await req.user.listStatuses(list, req.query.to);

  res.json({
    from: statuses[statuses.length - 1].idStr,
    to: statuses[0].idStr,
    total: statuses.length,
    filtered: statuses.length,
    statuses
  });
}));

export default router;
