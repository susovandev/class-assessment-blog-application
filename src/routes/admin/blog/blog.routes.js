import {Router} from "express";
import adminBlogController from "../../../controllers/admin/blog/blog.controller.js";
import {upload} from "../../../middlewares/multer.middleware.js";
import {AuthGuard} from "../../../middlewares/auth.middleware.js";
import {RoleGuard} from "../../../middlewares/authRole.middleware.js";

const router = Router();

router.use(AuthGuard);
router.use(RoleGuard("admin"));

router.get("/", adminBlogController.getBlogsPage);
router.get("/add", adminBlogController.addBlogPage);
router.get("/:id/edit", adminBlogController.updateBlogPage);

router.post("/add", upload.single("image"), adminBlogController.addBlogHandler);
router.post("/:id/edit", upload.single("image"), adminBlogController.updateBlogHandler);

router.post("/:id", adminBlogController.deleteBlogHandler);

export default router;
