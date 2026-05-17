import { Request, Response } from "express";

import * as policyService from "../services/policy.service";

export const getPolicyLimits =
    async (
        req: Request,
        res: Response
    ) => {
        const limits =
            await policyService.getPolicyLimits(
                req.params.id as string
            );

        res.status(200).json({
            success: true,
            data: limits
        });
    };