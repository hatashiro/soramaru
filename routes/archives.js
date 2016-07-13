import route from './async-route';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', route(async (req, res) => {
  res.json(await req.user.listArchives());
}));

export default router;
