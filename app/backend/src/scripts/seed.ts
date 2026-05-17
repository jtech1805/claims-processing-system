import mongoose from "mongoose";
import dotenv from "dotenv";

import { Policy } from "../models/policy.model";
import { Claim } from "../models/claim.model";

import { processClaim } from "../services/adjudication.service";

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI!
        );

        console.log(
            "⚙️ MongoDB Connected"
        );

        /**
         * CLEAN DATABASE
         */
        await Claim.deleteMany({});
        await Policy.deleteMany({});

        /**
         * =========================================================
         * POLICIES
         * =========================================================
         */

        /**
         * POLICY 1
         * Active policy
         * Used for:
         * - approved claims
         * - excluded service
         * - mixed line items
         * - deductible tests
         */
        const activePolicy =
            await Policy.create({
                policyNumber:
                    "POL-ACTIVE-001",

                holderName:
                    "John Doe",

                coverageTypes: [
                    "SURGERY",
                    "GENERAL_MEDICAL",
                    "DENTAL",
                    "VISION"
                ],

                deductible: 5000,

                annualLimit: 100000,

                usedAnnualLimit: 0,

                startDate: new Date(
                    "2026-01-01"
                ),

                endDate: new Date(
                    "2026-12-31"
                ),

                exclusions: [
                    "COSMETIC_SURGERY"
                ],

                isActive: true
            });

        /**
         * POLICY 2
         * Inactive policy
         */
        const inactivePolicy =
            await Policy.create({
                policyNumber:
                    "POL-INACTIVE-001",

                holderName:
                    "Jane Smith",

                coverageTypes: [
                    "GENERAL_MEDICAL"
                ],

                deductible: 2000,

                annualLimit: 50000,

                usedAnnualLimit: 0,

                startDate: new Date(
                    "2026-01-01"
                ),

                endDate: new Date(
                    "2026-12-31"
                ),

                exclusions: [],

                isActive: false
            });

        /**
         * POLICY 3
         * Expired / annual limit edge policy
         */
        const expiredPolicy =
            await Policy.create({
                policyNumber:
                    "POL-EXPIRED-001",

                holderName:
                    "Alex Brown",

                coverageTypes: [
                    "SURGERY",
                    "GENERAL_MEDICAL"
                ],

                deductible: 2000,

                annualLimit: 10000,

                usedAnnualLimit: 9000,

                startDate: new Date(
                    "2026-01-01"
                ),

                endDate: new Date(
                    "2026-01-31"
                ),

                exclusions: [],

                isActive: true
            });

        /**
         * =========================================================
         * CLAIMS
         * =========================================================
         */

        /**
         * CLAIM 1
         * Fully approved
         */
        const claim1 =
            await Claim.create({
                policyId:
                    activePolicy._id,

                incidentDate:
                    new Date("2026-03-10"),

                // submittedAt:
                //     new Date(),

                totalClaimedAmount:
                    15000,

                totalApprovedAmount:
                    0,

                status: "SUBMITTED",

                lineItems: [
                    {
                        serviceType:
                            "SURGERY",

                        claimedAmount:
                            15000,

                        approvedAmount: 0,

                        status: "PENDING"
                    }
                ]
            });

        /**
         * CLAIM 2
         * Excluded service
         */
        const claim2 =
            await Claim.create({
                policyId:
                    activePolicy._id,

                incidentDate:
                    new Date("2026-04-05"),

                // submittedAt:
                //     new Date(),

                totalClaimedAmount:
                    7000,

                totalApprovedAmount:
                    0,

                status: "SUBMITTED",

                lineItems: [
                    {
                        serviceType:
                            "COSMETIC_SURGERY",

                        claimedAmount:
                            7000,

                        approvedAmount: 0,

                        status: "PENDING"
                    }
                ]
            });

        /**
         * CLAIM 3
         * Uncovered service
         */
        const claim3 =
            await Claim.create({
                policyId:
                    activePolicy._id,

                incidentDate:
                    new Date("2026-05-01"),

                // submittedAt:
                //     new Date(),

                totalClaimedAmount:
                    5000,

                totalApprovedAmount:
                    0,

                status: "SUBMITTED",

                lineItems: [
                    {
                        serviceType:
                            "PHYSIOTHERAPY",

                        claimedAmount:
                            5000,

                        approvedAmount: 0,

                        status: "PENDING"
                    }
                ]
            });

        /**
         * CLAIM 4
         * Policy inactive
         */
        const claim4 =
            await Claim.create({
                policyId:
                    inactivePolicy._id,

                incidentDate:
                    new Date("2026-06-01"),

                // submittedAt:
                //     new Date(),

                totalClaimedAmount:
                    4000,

                totalApprovedAmount:
                    0,

                status: "SUBMITTED",

                lineItems: [
                    {
                        serviceType:
                            "GENERAL_MEDICAL",

                        claimedAmount:
                            4000,

                        approvedAmount: 0,

                        status: "PENDING"
                    }
                ]
            });

        /**
         * CLAIM 5
         * Mixed outcomes +
         * deductible +
         * annual limit edge case
         */
        const claim5 =
            await Claim.create({
                policyId:
                    expiredPolicy._id,

                incidentDate:
                    new Date("2026-01-15"),

                // submittedAt:
                //     new Date(),

                totalClaimedAmount:
                    15000,

                totalApprovedAmount:
                    0,

                status: "SUBMITTED",

                lineItems: [
                    {
                        serviceType:
                            "SURGERY",

                        claimedAmount:
                            12000,

                        approvedAmount: 0,

                        status: "PENDING"
                    },
                    {
                        serviceType:
                            "GENERAL_MEDICAL",

                        claimedAmount:
                            3000,

                        approvedAmount: 0,

                        status: "PENDING"
                    }
                ]
            });

        /**
         * =========================================================
         * RUN ADJUDICATION
         * =========================================================
         */

        console.log(
            "⚙️ Processing claims..."
        );

        await processClaim(
            claim1._id.toString()
        );

        await processClaim(
            claim2._id.toString()
        );

        await processClaim(
            claim3._id.toString()
        );

        await processClaim(
            claim4._id.toString()
        );

        await processClaim(
            claim5._id.toString()
        );

        console.log(
            "✅ Seed completed successfully"
        );

        console.log(
            "📦 Policies created: 3"
        );

        console.log(
            "📄 Claims created: 5"
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "❌ Seed failed:",
            error
        );

        process.exit(1);
    }
};

seedDatabase();