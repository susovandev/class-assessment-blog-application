import {Router} from "express";
import adminCategoryController from "../../../controllers/admin/category/category.controller.js";
import {AuthGuard} from "../../../middlewares/auth.middleware.js";
import {RoleGuard} from "../../../middlewares/authRole.middleware.js";

const router = Router();

router.use(AuthGuard);
router.use(RoleGuard("admin"));

router.get("/", adminCategoryController.getCategoriesPage);

router.post("/add", adminCategoryController.addCategoryHandler);

router.post("/:id", adminCategoryController.deleteCategoryHandler);

export default router;
