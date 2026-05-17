import { Claim, IClaim, ILineItem } from "../models/claim.model";
import { Policy } from "../models/policy.model";

import { adjudicateLineItem } from "./RulesEngine";

const deriveClaimStatus = (
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

export const processClaim = async (
    claimId: string
) => {
    /**
     * Fetch claim
     */
    const claim = await Claim.findById(claimId);

    if (!claim) {
        throw new Error("Claim not found");
    }

    /**
     * Only submitted claims can be processed
     */
    if (claim.status !== "SUBMITTED") {
        throw new Error(
            "Only submitted claims can be processed"
        );
    }

    /**
     * Fetch policy
     */
    const policy = await Policy.findById(
        claim.policyId
    );

    if (!policy) {
        throw new Error("Policy not found");
    }

    /**
     * Policy must be active
     */
    if (!policy.isActive) {
        claim.lineItems.forEach((item) => {
            item.status = "REJECTED";

            item.approvedAmount = 0;

            item.adjudicationReason =
                "Policy is inactive";
        });

        claim.totalApprovedAmount = 0;

        claim.status = "REJECTED";

        await claim.save();

        return claim;
    }

    /**
     * Move claim into processing state
     */
    claim.status = "PROCESSING";

    /**
     * Validate incident date
     */
    const incidentDate =
        new Date(claim.incidentDate);

    const policyStartDate =
        new Date(policy.startDate);

    const policyEndDate =
        new Date(policy.endDate);

    const isIncidentOutsideCoverage =
        incidentDate < policyStartDate ||
        incidentDate > policyEndDate;

    /**
     * Reject entire claim if incident
     * occurred outside policy coverage
     */
    if (isIncidentOutsideCoverage) {
        claim.lineItems.forEach((item) => {
            item.status = "REJECTED";

            item.approvedAmount = 0;

            item.adjudicationReason =
                "Incident date outside policy coverage period";
        });

        claim.totalApprovedAmount = 0;

        claim.status = "REJECTED";

        await claim.save();

        return claim;
    }

    /**
     * Adjudicate line items
     */
    let totalApprovedAmount = 0;

    for (
        let i = 0;
        i < claim.lineItems.length;
        i++
    ) {
        const result = adjudicateLineItem(
            claim.lineItems[i],
            policy
        );

        /**
         * Reassign only item
         * Policy mutates by reference
         */
        claim.lineItems[i] = result.item;

        totalApprovedAmount +=
            result.item.approvedAmount;
    }

    /**
     * Update totals
     */
    claim.totalApprovedAmount =
        totalApprovedAmount;

    /**
     * Derive final claim status
     */
    claim.status = deriveClaimStatus(
        claim.lineItems
    );

    /**
     * Persist changes
     */
    await policy.save();

    await claim.save();

    return claim;
};