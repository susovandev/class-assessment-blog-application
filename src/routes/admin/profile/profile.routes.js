import { Router } from 'express';
import adminProfileController from '../../../controllers/admin/profile/profile.controller.js';
import { AuthGuard } from '../../../middlewares/auth.middleware.js';
import { RoleGuard } from '../../../middlewares/authRole.middleware.js';
import { upload } from '../../../middlewares/multer.middleware.js';

const router = Router();

router.use(AuthGuard);
router.use(RoleGuard('admin'));

router.get('/', adminProfileController.getProfilePage);
router.post(
  '/',
  upload.single('image'),
  adminProfileController.updateProfileHandler
);
router.post('/password', adminProfileController.changePasswordHandler);

export default router;
