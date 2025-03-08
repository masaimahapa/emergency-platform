import {Router} from "express";
import emergencyRoutes from "./emergencyRoutes";

const router = Router();

router.use("/emergency", emergencyRoutes);

export default router;