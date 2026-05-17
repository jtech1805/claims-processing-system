import {
    exclusionRule,
    coverageRule,
    financialRule
} from "../../services/RulesEngine";

describe("Rules Engine Unit Tests", () => {
    describe("Exclusion Rule", () => {
        it("should reject excluded service", () => {
            const item: any = {
                serviceType: "COSMETIC",
                claimedAmount: 5000
            };

            const policy: any = {
                exclusions: ["COSMETIC"]
            };

            const result = exclusionRule(
                item,
                policy
            );

            expect(
                result.item.status
            ).toBe("REJECTED");

            expect(
                result.item.approvedAmount
            ).toBe(0);
        });
    });

    describe("Coverage Rule", () => {
        it("should reject uncovered service", () => {
            const item: any = {
                serviceType: "DENTAL",
                claimedAmount: 4000
            };

            const policy: any = {
                coverageTypes: ["MRI"]
            };

            const result = coverageRule(
                item,
                policy
            );

            expect(
                result.item.status
            ).toBe("REJECTED");
        });
    });

    describe("Financial Rule", () => {
        it("should reject when deductible fully consumes claim", () => {
            const item: any = {
                serviceType: "MRI",
                claimedAmount: 1000
            };

            const policy: any = {
                deductible: 2000,
                annualLimit: 10000,
                usedAnnualLimit: 0
            };

            const result = financialRule(
                item,
                policy
            );

            expect(
                result.item.status
            ).toBe("REJECTED");

            expect(
                result.item.approvedAmount
            ).toBe(0);
        });

        it("should partially approve when annual limit is exceeded", () => {
            const item: any = {
                serviceType: "MRI",
                claimedAmount: 5000
            };

            const policy: any = {
                deductible: 0,
                annualLimit: 10000,
                usedAnnualLimit: 9000
            };

            const result = financialRule(
                item,
                policy
            );

            expect(
                result.item.status
            ).toBe(
                "PARTIAL_APPROVED"
            );

            expect(
                result.item.approvedAmount
            ).toBe(1000);
        });

        it("should partially approve when deductible is met but annual limit is exceeded", () => {
            const item: any = {
                serviceType: "MRI",
                claimedAmount: 7000
            };

            const policy: any = {
                deductible: 2000,
                annualLimit: 10000,
                usedAnnualLimit: 8000
            };

            const result = financialRule(
                item,
                policy
            );

            expect(
                result.item.status
            ).toBe(
                "PARTIAL_APPROVED"
            );

            expect(
                result.item.approvedAmount
            ).toBe(2000);

            expect(
                result.policy.deductible
            ).toBe(0);
        });
    });
});