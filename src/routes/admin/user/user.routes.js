import { Router } from 'express';
import adminUserController from '../../../controllers/admin/user/user.controller.js';
import { AuthGuard } from '../../../middlewares/auth.middleware.js';
import { RoleGuard } from '../../../middlewares/authRole.middleware.js';

const router = Router();

router.use(AuthGuard);
router.use(RoleGuard('admin'));

router.get('/', adminUserController.getUsersPage);
router.post('/:id/toggle', adminUserController.toggleUserStatus);

export default router;
