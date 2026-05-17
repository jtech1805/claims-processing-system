import mongoose from "mongoose";

import { Policy } from "../models/policy.model";

export const getPolicyLimits =
    async (policyId: string) => {
        if (
            !mongoose.Types.ObjectId.isValid(
                policyId
            )
        ) {
            throw new Error(
                "Invalid policy ID"
            );
        }

        const policy =
            await Policy.findById(policyId);

        if (!policy) {
            throw new Error(
                "Policy not found"
            );
        }

        const remainingAnnualLimit =
            policy.annualLimit -
            policy.usedAnnualLimit;

        return {
            policyId: policy._id,

            deductibleRemaining:
                policy.deductible,

            annualLimit:
                policy.annualLimit,

            usedAnnualLimit:
                policy.usedAnnualLimit,

            remainingAnnualLimit
        };
    };