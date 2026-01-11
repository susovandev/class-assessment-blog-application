import {Router} from "express";
import adminCommentController from "../../../controllers/admin/comment/comment.controller.js";
import {AuthGuard} from "../../../middlewares/auth.middleware.js";
import {RoleGuard} from "../../../middlewares/authRole.middleware.js";

const router = Router();

router.use(AuthGuard);
router.use(RoleGuard("admin"));

router.get("/", adminCommentController.getCommentAnalytics);

export default router;
