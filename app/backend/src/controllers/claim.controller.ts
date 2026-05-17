import { Request, Response } from "express";

import * as claimService from "../services/claim.service";

export const createClaim = async (
    req: Request,
    res: Response
) => {
    const claim =
        await claimService.createClaim(
            req.body
        );

    res.status(201).json({
        success: true,
        data: claim
    });
};