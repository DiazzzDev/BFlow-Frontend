import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    confirmReceipt,
    getRecentActivity,
    registerQuickTransaction,
    uploadReceipt,
} from "@/modules/app/features/dashboard/dashboard.service";

const apiRequestMock = vi.hoisted(() => vi.fn());
const idempotentPostMock = vi.hoisted(() => vi.fn());

vi.mock("@/utils/api", async (importOriginal) => {
    const original = await importOriginal<typeof import("@/utils/api")>();
    return {
        ...original,
        apiRequest: apiRequestMock,
        idempotentPost: idempotentPostMock,
    };
});

describe("dashboard service requests", () => {
    beforeEach(() => {
        apiRequestMock.mockReset().mockResolvedValue({ success: true, data: {} });
        idempotentPostMock.mockReset().mockResolvedValue({ success: true, data: 1 });
    });

    it("normalizes recent-activity filters before requesting the dashboard", async () => {
        await getRecentActivity({ type: "EXPENSE", query: "  coffee  ", limit: 80 });

        const [url, options] = apiRequestMock.mock.calls[0] as [string, RequestInit];
        const query = new URL(url).searchParams;
        expect(url).toContain("/api/v1/dashboard/recent-activity?");
        expect(query.get("type")).toBe("EXPENSE");
        expect(query.get("query")).toBe("coffee");
        expect(query.get("limit")).toBe("50");
        expect(options.method).toBe("GET");
    });

    it("posts quick transactions through the idempotent endpoint", async () => {
        await registerQuickTransaction(24.5);

        expect(idempotentPostMock).toHaveBeenCalledWith(
            expect.stringContaining("/api/v1/expenses/quick"),
            { amount: 24.5 },
            expect.objectContaining({ friendlyMessage: expect.any(String) }),
        );
    });

    it("uses multipart upload and serializes receipt confirmation", async () => {
        const file = new File(["receipt"], "receipt.png", { type: "image/png" });
        await uploadReceipt(file);
        await confirmReceipt("receipt-1", {
            type: "EXPENSE",
            title: "Coffee",
            description: "Team meeting",
            amount: 4.5,
            categoryId: "category-1",
            date: "2026-11-13",
        });

        const uploadOptions = apiRequestMock.mock.calls[0][1] as RequestInit;
        expect(uploadOptions.method).toBe("POST");
        expect(uploadOptions.body).toBeInstanceOf(FormData);

        const [confirmUrl, confirmOptions] = apiRequestMock.mock.calls[1] as [string, RequestInit];
        expect(confirmUrl).toContain("/api/v1/receipts/receipt-1/confirm");
        expect(JSON.parse(String(confirmOptions.body))).toMatchObject({
            title: "Coffee",
            description: "Team meeting",
        });
    });
});
