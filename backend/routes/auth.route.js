import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/send-otp", authController.sendOtpMobile);
router.post("/verify-otp", authController.verifyOtpMobile);
router.post("/resend-otp", authController.resenOtpMobile);

export default router;
