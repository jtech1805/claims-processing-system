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
export const getClaimsLedger =
    async (
        req: Request,
        res: Response
    ) => {
        const claims =
            await claimService.getProcessedClaimsLedger();

        res.status(200).json({
            success: true,
            count: claims.length,
            data: claims
        });
    };

export const getClaim =
    async (
        req: Request,
        res: Response
    ) => {
        const claim =
            await claimService.getClaimById(
                req.params.id as string
            );

        res.status(200).json({
            success: true,
            data: claim
        });
    };

export const getClaimsMetrics =
    async (
        req: Request,
        res: Response
    ) => {
        const metrics =
            await claimService.getClaimsMetricsSummary();

        res.status(200).json({
            success: true,
            data: metrics
        });
    };