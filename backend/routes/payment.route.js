import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/authenticate.js";

const router = Router();

router.post("/add-payment", authMiddleware, paymentController.addPayment);
router.post("/verify-payment", authMiddleware, paymentController.verifyPayment);

export default router;
