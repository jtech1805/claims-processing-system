import { Router } from "express";

import claimRoutes from "./claim.routes";
import policyRoutes from "./policy.routes"

const router = Router();

router.use("/claims", claimRoutes);
router.use("/policy", policyRoutes)

export default router;