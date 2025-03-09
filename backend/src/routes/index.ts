import {Router} from "express";
import emergencyRoutes from "./emergencyRoutes";
import responderRoutes from "./responderRoutes";

const router = Router();

router.use("/emergency", emergencyRoutes);
router.use("/responders", responderRoutes);

export default router;