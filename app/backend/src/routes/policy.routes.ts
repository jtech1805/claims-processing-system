import { Router } from "express";

import {
    getPolicyLimits
} from "../controllers/policy.controller";

const router = Router();

router.get(
    "/:id",
    getPolicyLimits
);

export default router;