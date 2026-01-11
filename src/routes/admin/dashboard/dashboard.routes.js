import {Router} from "express";
import adminDashboardController from "../../../controllers/admin/dashboard/dashboard.controller.js";
import {AuthGuard} from "../../../middlewares/auth.middleware.js";
import {RoleGuard} from "../../../middlewares/authRole.middleware.js";

const router = Router();

router.use(AuthGuard);
router.use(RoleGuard("admin"));

router.get("/", adminDashboardController.adminDashBoardPage);

export default router;
