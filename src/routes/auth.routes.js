import {Router} from "express";
import {
  registerPage,
  loginPage,
  forgotPasswordPage,
  registerHandler,
  loginHandler,
  changePasswordPage,
  logoutHandler,
} from "../controllers/auth.controller.js";

import {AuthGuard} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/register", registerPage);
router.get("/login", loginPage);
router.get("/forgot-password", forgotPasswordPage);
router.get("/change-password", changePasswordPage);

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", AuthGuard, logoutHandler);

export default router;
