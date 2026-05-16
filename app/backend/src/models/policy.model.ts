import mongoose, { Schema, Document } from "mongoose";

export interface IPolicy extends Document {
    policyNumber: string;
    holderName: string;

    coverageTypes: string[];

    deductible: number;
    annualLimit: number;
    usedAnnualLimit: number;

    startDate: Date;
    endDate: Date;

    exclusions: string[];

    isActive: boolean;
}

const PolicySchema = new Schema<IPolicy>(
    {
        policyNumber: {
            type: String,
            required: true,
            unique: true
        },

        holderName: {
            type: String,
            required: true
        },

        coverageTypes: [
            {
                type: String
            }
        ],

        deductible: {
            type: Number,
            default: 0
        },

        annualLimit: {
            type: Number,
            required: true
        },

        usedAnnualLimit: {
            type: Number,
            default: 0
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        exclusions: [
            {
                type: String
            }
        ],

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export const Policy = mongoose.model<IPolicy>(
    "Policy",
    PolicySchema
);