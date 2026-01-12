import { Router } from 'express';

import { AuthGuard } from '../middlewares/auth.middleware.js';
import {
  updateProfilePage,
  userProfilePage,
} from '../controllers/user.controller.js';

const router = Router();

router.get('/profile', AuthGuard, userProfilePage);
router.get('/profile/edit', AuthGuard, updateProfilePage);

export default router;
