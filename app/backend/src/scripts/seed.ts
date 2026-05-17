import mongoose from "mongoose";
import dotenv from "dotenv";
import { Policy } from "../models/policy.model"; // Ensure your import paths are correct
import { Claim } from "../models/claim.model";

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("⚙️ MongoDB Connected");

        // Clear existing data
        await Policy.deleteMany({});
        await Claim.deleteMany({});

        /**
         * 1. Seed the Policy based on your exact schema
         */
        const policy = await Policy.create({
            policyNumber: "POL-IND-2026",
            holderName: "Jigar Pariyar",
            coverageTypes: [
                "SURGERY",
                "GENERAL_MEDICAL",
                "DENTAL",
                "VISION"
            ],
            deductible: 5000,          // ₹5,000 deductible before paying out
            annualLimit: 500000,       // ₹5,00,000 total global limit
            usedAnnualLimit: 10000,    // Reflects previous claims
            startDate: new Date("2026-01-01"),
            endDate: new Date("2026-12-31"),
            exclusions: ["COSMETIC_SURGERY"],
            isActive: true
        });

        /**
         * 2. Seed a Past Approved Claim (Explains the usedAnnualLimit)
         */
        await Claim.create({
            policyId: policy._id,
            incidentDate: new Date("2026-02-15"), // Using your new field
            totalClaimedAmount: 15000,
            totalApprovedAmount: 10000, // ₹15k claimed - ₹5k deductible = ₹10k approved
            status: "APPROVED",
            lineItems: [
                {
                    serviceType: "SURGERY",
                    claimedAmount: 15000,
                    approvedAmount: 10000,
                    status: "APPROVED",
                    adjudicationReason: "₹5000 deductible applied. Remaining balance covered."
                }
            ]
        });

        /**
         * 3. Seed a NEW Pending Claim (For your Adjudication Engine to process)
         */
        await Claim.create({
            policyId: policy._id,
            incidentDate: new Date(), // Today
            totalClaimedAmount: 65000, // 50k Medical + 10k Dental + 5k Cosmetic
            totalApprovedAmount: 0,
            status: "SUBMITTED",
            lineItems: [
                {
                    serviceType: "GENERAL_MEDICAL",
                    claimedAmount: 50000,
                    approvedAmount: 0,
                    status: "PENDING"
                },
                {
                    serviceType: "DENTAL",
                    claimedAmount: 10000,
                    approvedAmount: 0,
                    status: "PENDING"
                },
                {
                    serviceType: "COSMETIC_SURGERY",
                    claimedAmount: 5000,
                    approvedAmount: 0,
                    status: "PENDING"
                }
            ]
        });

        console.log("✅ Seed completed successfully. Policy and Claims generated.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();