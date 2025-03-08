import {Router} from "express";
import {createEmergency, getEmergencies, getEmergencyById, updateEmergency} from "../controllers/emergencyController";
const router = Router();

router.get("/", getEmergencies);
router.get("/:id", getEmergencyById);
router.post("/", createEmergency);
router.put("/:id", updateEmergency);

export default router;