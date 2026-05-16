// src/scripts/seed.ts

import mongoose from "mongoose";
import dotenv from "dotenv";

import { Policy } from "../models/policy.model";
import { Claim } from "../models/claim.model";

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);

        console.log("MongoDB Connected");

        await Policy.deleteMany({});
        await Claim.deleteMany({});

        /**
         * Seed Policy
         */
        const policy = await Policy.create({
            policyNumber: "POL-1001",
            holderName: "Jigar Patel",

            coverageTypes: [
                "SURGERY",
                "MEDICINE",
                "CONSULTATION"
            ],

            deductible: 500,

            annualLimit: 100000,
            usedAnnualLimit: 10000,

            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-12-31"),

            exclusions: ["COSMETIC_SURGERY"],

            isActive: true
        });

        /**
         * Seed Claim
         */
        const claim = await Claim.create({
            policyId: policy._id,

            totalClaimedAmount: 25000,
            totalApprovedAmount: 18000,

            status: "PARTIAL_APPROVED",

            lineItems: [
                {
                    serviceType: "SURGERY",

                    claimedAmount: 20000,
                    approvedAmount: 18000,

                    status: "PARTIAL_APPROVED",

                    adjudicationReason:
                        "Deductible applied before approval"
                },

                {
                    serviceType: "COSMETIC_SURGERY",

                    claimedAmount: 5000,
                    approvedAmount: 0,

                    status: "REJECTED",

                    adjudicationReason:
                        "Service excluded under policy"
                }
            ]
        });

        /**
         * Seed Claim Line Items
         */

        console.log("Seed completed");

        process.exit(0);
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

seedDatabase();