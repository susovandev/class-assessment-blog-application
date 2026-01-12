import { Router } from 'express';
import {
  getUserProfilePage,
  updateProfilePage,
  updateProfileHandler,
  changePasswordHandler,
  getChangePasswordPage,
} from '../../controllers/user.controller.js';
import { AuthGuard } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';

const router = Router();

router.use(AuthGuard);

router.get('/profile/change-password', getChangePasswordPage);
router.post('/profile/change-password', changePasswordHandler);
router.get('/profile', getUserProfilePage);
router.get('/profile/edit', updateProfilePage);
router.post('/profile/edit', upload.single('image'), updateProfileHandler);

export default router;
