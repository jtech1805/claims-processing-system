import { Policy } from "../../../src/models/policy.model";

import { createClaim } from "../../../src/services/claim.service";

describe(
    "Claim Service Integration",
    () => {
        it(
            "should reject duplicate claims",
            async () => {
                const policy =
                    await Policy.create({
                        policyNumber:
                            "POL-001",

                        holderName:
                            "John Doe",

                        coverageTypes: [
                            "MRI"
                        ],

                        deductible: 0,

                        annualLimit:
                            10000,

                        usedAnnualLimit: 0,

                        exclusions: [],

                        startDate:
                            new Date(
                                "2026-01-01"
                            ),

                        endDate:
                            new Date(
                                "2026-12-31"
                            ),

                        isActive: true
                    });

                await createClaim({
                    policyId:
                        policy._id.toString(),

                    incidentDate:
                        new Date(
                            "2026-06-01"
                        ),

                    lineItems: [
                        {
                            serviceType:
                                "MRI",

                            claimedAmount: 5000
                        }
                    ]
                });

                await expect(
                    createClaim({
                        policyId:
                            policy._id.toString(),

                        incidentDate:
                            new Date(
                                "2026-06-01"
                            ),

                        lineItems: [
                            {
                                serviceType:
                                    "MRI",

                                claimedAmount: 5000
                            }
                        ]
                    })
                ).rejects.toThrow(
                    "Duplicate claim already exists"
                );
            }
        );
    }
);