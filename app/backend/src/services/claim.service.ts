import { Claim } from "../models/claim.model";

import { processClaim } from "./adjudication.service";

import { CreateClaimInput } from "../validation/claim.validation";
import mongoose from "mongoose";

export const createClaim = async (
    payload: CreateClaimInput
) => {
    /**
     * Duplicate claim validation
     */
    const existingClaim = await Claim.findOne({
        policyId: payload.policyId,
        incidentDate: payload.incidentDate
    });
    console.log(existingClaim, payload)
    if (existingClaim) {
        throw new Error(
            "Duplicate claim already exists"
        );
    }

    /**
     * Calculate total claimed amount
     */
    const totalClaimedAmount =
        payload.lineItems.reduce(
            (sum, item) =>
                sum + item.claimedAmount,
            0
        );

    /**
     * Create submitted claim
     */
    const claim = await Claim.create({
        policyId: payload.policyId,

        incidentDate: payload.incidentDate,

        status: "SUBMITTED",

        totalClaimedAmount,

        totalApprovedAmount: 0,

        lineItems: payload.lineItems.map(
            (item) => ({
                ...item,
                approvedAmount: 0,
                // status: "PENDING"
            })
        )
    });

    /**
     * Immediate adjudication
     */
    const processedClaim =
        await processClaim(
            claim._id.toString()
        );

    return processedClaim;
};
export const getProcessedClaimsLedger =
    async () => {
        const claims =
            await Claim.aggregate([
                {
                    $match: {
                        status: {
                            $in: [
                                "APPROVED",
                                "PARTIAL_APPROVED",
                                "REJECTED"
                            ]
                        }
                    }
                },

                {
                    $project: {
                        _id: {
                            $toString: "$_id"
                        },

                        policyId: {
                            $toString: "$policyId"
                        },

                        incidentDate: {
                            $dateToString: {
                                date: "$incidentDate",
                                format:
                                    "%Y-%m-%dT%H:%M:%S.%LZ"
                            }
                        },

                        submittedAt: {
                            $dateToString: {
                                date: "$createdAt",
                                format:
                                    "%Y-%m-%dT%H:%M:%S.%LZ"
                            }
                        },

                        totalBilled:
                            "$totalClaimedAmount",

                        totalApproved:
                            "$totalApprovedAmount",

                        status: 1,

                        lineItems: 1
                    }
                },

                {
                    $sort: {
                        submittedAt: -1
                    }
                }
            ]);

        return claims;
    };

export const getClaimById =
    async (claimId: string) => {
        if (
            !mongoose.Types.ObjectId.isValid(
                claimId
            )
        ) {
            throw new Error(
                "Invalid claim ID"
            );
        }

        const claim =
            await Claim.findById(claimId);

        if (!claim) {
            throw new Error(
                "Claim not found"
            );
        }

        return claim;
    };

export const getClaimsMetricsSummary =
    async () => {
        const claims = await Claim.find({
            status: {
                $in: [
                    "APPROVED",
                    "PARTIAL_APPROVED",
                    "REJECTED"
                ]
            }
        });

        const totalClaims =
            claims.length;

        const totalPaidOut =
            claims.reduce(
                (sum, claim) =>
                    sum +
                    claim.totalApprovedAmount,
                0
            );

        const totalSavedByDeductibles =
            claims.reduce(
                (sum, claim) =>
                    sum +
                    (claim.totalClaimedAmount -
                        claim.totalApprovedAmount),
                0
            );

        return {
            totalClaims,
            totalPaidOut,
            totalSavedByDeductibles
        };
    };