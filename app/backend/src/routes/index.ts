import { Router } from "express";

import claimRoutes from "./claim.routes";

const router = Router();

router.use("/claims", claimRoutes);

export default router;