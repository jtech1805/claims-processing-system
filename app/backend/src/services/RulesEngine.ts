import { IPolicy } from "../models/policy.model";
import { ILineItem } from "../models/claim.model";

type RuleResult = {
    item: ILineItem;
    policy: IPolicy;
    continue: boolean;
};

type Rule = (
    item: ILineItem,
    policy: IPolicy
) => RuleResult;

/**
 * Rule 1: Exclusion Check
 * Fail fast if service is excluded
 */
const exclusionRule: Rule = (item, policy) => {
    const isExcluded = policy.exclusions.includes(
        item.serviceType
    );

    if (isExcluded) {
        item.status = "REJECTED";
        item.approvedAmount = 0;
        item.adjudicationReason =
            "Service is excluded from policy coverage";

        return {
            item,
            policy,
            continue: false
        };
    }

    return {
        item,
        policy,
        continue: true
    };
};

/**
 * Rule 2: Coverage Validation
 * Fail fast if service is not covered
 */
const coverageRule: Rule = (item, policy) => {
    const isCovered = policy.coverageTypes.includes(
        item.serviceType
    );

    if (!isCovered) {
        item.status = "REJECTED";
        item.approvedAmount = 0;
        item.adjudicationReason =
            "Service is not covered under policy";

        return {
            item,
            policy,
            continue: false
        };
    }

    return {
        item,
        policy,
        continue: true
    };
};

/**
 * Rule 3: Deductible + Annual Limit
 */
const financialRule: Rule = (item, policy) => {
    let payableAmount = item.claimedAmount;

    /**
     * Apply deductible directly on policy
     * so updated value persists for next claims
     */
    if (policy.deductible > 0) {
        const deductibleApplied = Math.min(
            policy.deductible,
            payableAmount
        );

        payableAmount -= deductibleApplied;

        policy.deductible -= deductibleApplied;
    }
    if (payableAmount <= 0) {
        item.status = "REJECTED";
        item.approvedAmount = 0;
        item.adjudicationReason = "Claim amount fully applied to deductible";

        return {
            item,
            policy,
            continue: false // Stop processing this item
        };
    }
    /**
     * Remaining annual coverage
     */
    const remainingAnnualLimit =
        policy.annualLimit - policy.usedAnnualLimit;

    if (remainingAnnualLimit <= 0) {
        item.status = "REJECTED";
        item.approvedAmount = 0;
        item.adjudicationReason =
            "Annual policy limit exhausted";

        return {
            item,
            policy,
            continue: false
        };
    }

    /**
     * Partial approval if claim exceeds limit
     */
    if (payableAmount > remainingAnnualLimit) {
        item.status = "PARTIAL_APPROVED";
        item.approvedAmount = remainingAnnualLimit;
        item.adjudicationReason =
            "Annual limit partially exhausted";

        policy.usedAnnualLimit += remainingAnnualLimit;

        return {
            item,
            policy,
            continue: false
        };
    }

    /**
     * Fully approved
     */
    item.status = "APPROVED";
    item.approvedAmount = payableAmount;
    item.adjudicationReason =
        "Claim approved successfully";

    policy.usedAnnualLimit += payableAmount;

    return {
        item,
        policy,
        continue: true
    };
};

/**
 * Functional rule pipeline
 */
const rules: Rule[] = [
    exclusionRule,
    coverageRule,
    financialRule
];

/**
 * Execute adjudication pipeline
 */
export const adjudicateLineItem = (
    item: ILineItem,
    policy: IPolicy
) => {
    let currentItem = item;
    let currentPolicy = policy;

    for (const rule of rules) {
        const result = rule(currentItem, currentPolicy);

        currentItem = result.item;
        currentPolicy = result.policy;

        if (!result.continue) {
            break;
        }
    }

    return {
        item: currentItem,
        policy: currentPolicy
    };
};