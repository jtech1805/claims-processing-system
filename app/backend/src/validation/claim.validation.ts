// src/validations/claim.validation.ts

import { z } from "zod";

export const createClaimSchema = z.object({
    policyId: z
        .string()
        .min(1, "policyId is required"),

    incidentDate: z.coerce.date().refine(
        date => !isNaN(date.getTime()),
        { message: "Valid incidentDate is required" }
    ),

    lineItems: z
        .array(
            z.object({
                serviceType: z
                    .string()
                    .min(1, "serviceType is required"),

                claimedAmount: z
                    .number()
                    .refine(value => typeof value === "number", {
                        message: "claimedAmount must be a number"
                    })
                    .positive(
                        "claimedAmount must be greater than 0"
                    )
            })
        )
        .min(1, "At least one line item is required")
});

export type CreateClaimInput = z.infer<
    typeof createClaimSchema
>;