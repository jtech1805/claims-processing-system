import mongoose from "mongoose";

import { Policy } from "../models/policy.model";

export const getPolicyLimits =
    async (search: string) => {
        const escapedSearch =
            search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        const policies =
            await Policy.aggregate([
                {
                    $match: {
                        policyNumber: {
                            $regex: `^${escapedSearch}`,
                            $options: "i"
                        }
                    }
                },

                {
                    $project: {
                        _id: {
                            $toString: "$_id"
                        },

                        policyId:
                            "$policyNumber",

                        holderName: 1,

                        planType: 1,

                        annualLimit: 1,

                        usedAnnualLimit: 1,

                        deductible: 1,

                        remainingDeductible:
                            "$deductible"
                    }
                },

                {
                    $limit: 10
                }
            ]);

        return policies;
    };