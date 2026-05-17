import { Claim } from "../../../src/models/claim.model";
import { Policy } from "../../../src/models/policy.model";

import { processClaim } from "../../../src/services/adjudication.service";

describe(
    "Adjudication Service Integration",
    () => {
        it(
            "should reject entire claim when policy is inactive",
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

                        isActive: false
                    });

                const claim =
                    await Claim.create({
                        policyId:
                            policy._id,

                        incidentDate:
                            new Date(
                                "2026-06-01"
                            ),

                        status:
                            "SUBMITTED",

                        totalClaimedAmount: 5000,

                        totalApprovedAmount: 0,

                        lineItems: [
                            {
                                serviceType:
                                    "MRI",

                                claimedAmount: 5000,

                                approvedAmount: 0,

                                status:
                                    "PENDING"
                            }
                        ]
                    });

                const result =
                    await processClaim(
                        claim._id.toString()
                    );

                expect(
                    result.status
                ).toBe(
                    "REJECTED"
                );

                expect(
                    result.lineItems[0]
                        .status
                ).toBe(
                    "REJECTED"
                );
            }
        );

        it(
            "should partially approve when annual limit is exceeded",
            async () => {
                const policy =
                    await Policy.create({
                        policyNumber:
                            "POL-002",

                        holderName:
                            "John Doe",

                        coverageTypes: [
                            "MRI"
                        ],

                        deductible: 0,

                        annualLimit:
                            10000,

                        usedAnnualLimit: 9000,

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

                const claim =
                    await Claim.create({
                        policyId:
                            policy._id,

                        incidentDate:
                            new Date(
                                "2026-06-01"
                            ),

                        status:
                            "SUBMITTED",

                        totalClaimedAmount: 5000,

                        totalApprovedAmount: 0,

                        lineItems: [
                            {
                                serviceType:
                                    "MRI",

                                claimedAmount: 5000,

                                approvedAmount: 0,

                                status:
                                    "PENDING"
                            }
                        ]
                    });

                const result =
                    await processClaim(
                        claim._id.toString()
                    );

                expect(
                    result.status
                ).toBe(
                    "PARTIAL_APPROVED"
                );

                expect(
                    result.lineItems[0]
                        .approvedAmount
                ).toBe(1000);

                /**
                 * Verify DB persistence
                 */
                const updatedPolicy =
                    await Policy.findById(
                        policy._id
                    );

                expect(
                    updatedPolicy?.usedAnnualLimit
                ).toBe(10000);
            }
        );
    }
);