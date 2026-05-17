import { deriveClaimStatus } from "../../utils/deriveClaimStatus";

describe("deriveClaimStatus", () => {
    it("should derive APPROVED status", () => {
        const result =
            deriveClaimStatus([
                {
                    status: "APPROVED"
                } as any
            ]);

        expect(result).toBe(
            "APPROVED"
        );
    });

    it("should derive REJECTED status", () => {
        const result =
            deriveClaimStatus([
                {
                    status: "REJECTED"
                } as any
            ]);

        expect(result).toBe(
            "REJECTED"
        );
    });

    it("should derive PARTIAL_APPROVED status", () => {
        const result =
            deriveClaimStatus([
                {
                    status: "APPROVED"
                },
                {
                    status: "REJECTED"
                }
            ] as any);

        expect(result).toBe(
            "PARTIAL_APPROVED"
        );
    });
});