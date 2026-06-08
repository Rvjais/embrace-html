import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authenticate.js";
import upload from "../utils/multer.js";

const router = Router();

router.post("/add-practioner", userController.addPractitioner);
router.get("/get-practioner", userController.getPractitioners);
router.post(
  "/add-practionerImage",
  upload.single("file"),
  userController.addImagePractitiioner
);
router.get("/get-practionerList", userController.getPractitionsList);
router.post("/add-patient", userController.addPatient);
router.get("/get-patients", userController.getPractitioner_Patient);
router.get("/get-practioner-filter", userController.getPractioners_Filter);
router.post("/test-appointment", authMiddleware, userController.testAppointmentApi);
router.get("/get-locations", userController.getLocations);
router.get("/fetch-department", userController.fetchDepartment);
router.get("/fetch-slots", userController.fetchDoctorSlots);
router.get("/fetch-practioners", userController.fetchPractionerList);

export default router;
