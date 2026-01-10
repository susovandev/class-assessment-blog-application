import { Router } from 'express';
import { AuthGuard } from '../middlewares/auth.middleware.js';
import { RoleGuard } from '../middlewares/authRole.middleware.js';
import {
	addBlogPage,
	addBlogHandler,
	getCategoriesPage,
	adminDashBoardPage,
	addCategoryHandler,
	deleteCategoryHandler,
	getBlogsPage,
	deleteBlogHandler,
	getUsersPage,
	updateBlogPage,
	updateBlogHandler,
	toggleUserStatus,
} from '../controllers/admin.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(AuthGuard, RoleGuard('admin'));

router.get('/users', getUsersPage);
router.get('/blogs', getBlogsPage);
router.get('/blogs/add', addBlogPage);
router.get('/categories', getCategoriesPage);
router.get('/dashboard', adminDashBoardPage);

router.post('/blogs/add', upload.single('image'), addBlogHandler);
router.post('/categories/add', addCategoryHandler);

router.post('/users/:id/toggle', toggleUserStatus);
router.get('/blogs/:id/edit', updateBlogPage);
router.post('/blogs/:id/edit', upload.single('image'), updateBlogHandler);
router.post('/categories/:id', deleteCategoryHandler);
router.post('/blogs/:id', deleteBlogHandler);

export default router;
