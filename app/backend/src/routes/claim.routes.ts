import { Router } from "express";

import { createClaim } from "../controllers/claim.controller";

import { validate } from "../middleware/validate";

import { createClaimSchema } from "../validation/claim.validation";

const router = Router();

router.post(
    "/",
    validate(createClaimSchema),
    createClaim
);

export default router;