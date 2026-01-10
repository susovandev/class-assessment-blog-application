import { Router } from 'express';
import { AuthGuard } from '../middlewares/auth.middleware.js';
import { RoleGuard } from '../middlewares/authRole.middleware.js';
import {
	addBlogPage,
	addBlogHandler,
	adminDashBoardPage,
} from '../controllers/admin.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(AuthGuard, RoleGuard('admin'));



router.get('/blogs/add', addBlogPage);
router.get('/dashboard', adminDashBoardPage);

router.post('/blogs/add', upload.single('image'), addBlogHandler);


export default router;
