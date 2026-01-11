import {Router} from "express";

const router = Router();

router.get("/register", registerPage);
router.get("/login", loginPage);
router.get("/forgot-password", forgotPasswordPage);
router.get("/change-password", changePasswordPage);

router.post("/register", registerHandler);
router.post("/login", loginHandler);

export default router;
