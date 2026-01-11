import {Router} from "express";

import commentController from "../../../controllers/frontend/comment/comment.controller.js";
import {AuthGuard} from "../../../middlewares/auth.middleware.js";

const router = Router();

router.post("/add/:id", AuthGuard, commentController.addComment);

export default router;
