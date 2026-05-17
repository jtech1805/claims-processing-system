import { Router } from "express";

import { createClaim, getClaim, getClaimsLedger } from "../controllers/claim.controller";

import { validate } from "../middleware/validate";

import { createClaimSchema } from "../validation/claim.validation";

const router = Router();

router.post(
    "/",
    validate(createClaimSchema),
    createClaim
);
router.get(
    "/ledger",
    getClaimsLedger
);
router.get(
    "/:id",
    getClaim
);
export default router;