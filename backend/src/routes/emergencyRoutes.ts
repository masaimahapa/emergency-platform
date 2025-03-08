import {Router} from "express";
import {getEmergencies} from "../controllers/emergencyController";
const router = Router();

router.get("/", getEmergencies);

export default router;