import {Router} from "express";
import blogController from "../../../controllers/frontend/blog/blog.controller.js";

const router = Router();

router.get("/", blogController.renderBlogPage);
router.get("/:id", blogController.getBlogDetailsPage);

export default router;
