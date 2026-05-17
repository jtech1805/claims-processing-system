import mongoose, { Schema, Document } from "mongoose";

export type ClaimStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "PROCESSING"
    | "APPROVED"
    | "PARTIAL_APPROVED"
    | "REJECTED";

export type LineItemStatus =
    | "PENDING"
    | "APPROVED"
    | "PARTIAL_APPROVED"
    | "REJECTED";

export interface ILineItem {
    serviceType: string;

    claimedAmount: number;
    approvedAmount: number;

    status: LineItemStatus;

    adjudicationReason?: string;
}

export interface IClaim extends Document {
    policyId: mongoose.Types.ObjectId;
    incidentDate: Date;
    totalClaimedAmount: number;
    totalApprovedAmount: number;

    status: ClaimStatus;

    lineItems: ILineItem[];
}

const LineItemSchema = new Schema<ILineItem>(
    {
        serviceType: {
            type: String,
            required: true
        },

        claimedAmount: {
            type: Number,
            required: true
        },

        approvedAmount: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "PARTIAL_APPROVED",
                "REJECTED"
            ],
            default: 'PENDING'
        },

        adjudicationReason: {
            type: String
        }
    },
    {
        _id: false
    }
);

const ClaimSchema = new Schema<IClaim>(
    {
        policyId: {
            type: Schema.Types.ObjectId,
            ref: "Policy",
            required: true
        },
        incidentDate: {
            type: Date,
            required: true
        },
        totalClaimedAmount: {
            type: Number,
            required: true
        },

        totalApprovedAmount: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "SUBMITTED",
                "PROCESSING",
                "APPROVED",
                "PARTIAL_APPROVED",
                "REJECTED"
            ],
            default: "DRAFT"
        },

        lineItems: [LineItemSchema]
    },
    {
        timestamps: true
    }
);

export const Claim = mongoose.model<IClaim>(
    "Claim",
    ClaimSchema
);