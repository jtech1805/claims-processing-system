import {
    IClaim,
    ILineItem
} from "../models/claim.model";

export const deriveClaimStatus = (
    lineItems: ILineItem[]
): IClaim["status"] => {
    const statuses = lineItems.map(
        (item) => item.status
    );

    const allRejected = statuses.every(
        (status) => status === "REJECTED"
    );

    if (allRejected) {
        return "REJECTED";
    }

    const allApproved = statuses.every(
        (status) => status === "APPROVED"
    );

    if (allApproved) {
        return "APPROVED";
    }

    return "PARTIAL_APPROVED";
};