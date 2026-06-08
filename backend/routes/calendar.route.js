import calendarController from "../controllers/calendar.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authenticate.js";

const router = Router();

router.get('/calendar-booking', authMiddleware, calendarController.getCalendar);

export default router;
