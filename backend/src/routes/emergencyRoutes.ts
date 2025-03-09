import {Router} from "express";
import {assignResponderToEmergency, createEmergency, getEmergencies, getEmergencyById, getEmergencyWithResponders, updateEmergency, removeResponderFromEmergency} from "../controllers/emergencyController";
const router = Router();

router.get("/", getEmergencies);
router.get("/:id", getEmergencyById);
router.post("/", createEmergency);
router.put("/:id", updateEmergency);
router.post("/:id/responders", assignResponderToEmergency);
router.get("/:id/responders", getEmergencyWithResponders);
router.delete("/:id/responders/:responderId", removeResponderFromEmergency);

export default router;