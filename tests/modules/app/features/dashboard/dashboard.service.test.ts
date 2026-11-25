import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    confirmReceipt,
    getRecentActivity,
    registerQuickTransaction,
    uploadReceipt,
} from "@/modules/app/features/dashboard/dashboard.service";

type ApiRequestFn = (url: string, options?: RequestInit) => Promise<unknown>;
type IdempotentPostFn = (
    url: string,
    body?: unknown,
    options?: { friendlyMessage?: string },
) => Promise<unknown>;

const apiRequestMock = vi.hoisted(() => vi.fn<ApiRequestFn>());
const idempotentPostMock = vi.hoisted(() => vi.fn<IdempotentPostFn>());

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

        const [url, options] = apiRequestMock.mock.calls[0];
        const query = new URL(url).searchParams;
        expect(url).toContain("/api/v1/dashboard/recent-activity?");
        expect(query.get("type")).toBe("EXPENSE");
        expect(query.get("query")).toBe("coffee");
        expect(query.get("limit")).toBe("50");
        expect(options?.method).toBe("GET");
    });

    it("posts quick transactions through the idempotent endpoint", async () => {
        await registerQuickTransaction(24.5);

        const call = idempotentPostMock.mock.calls[0];
        expect(call[0]).toContain("/api/v1/expenses/quick");
        expect(call[1]).toEqual({ amount: 24.5 });
        expect(typeof call[2]?.friendlyMessage).toBe("string");
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

        const [, uploadOptions] = apiRequestMock.mock.calls[0];
        expect(uploadOptions?.method).toBe("POST");
        expect(uploadOptions?.body).toBeInstanceOf(FormData);

        const [confirmUrl, confirmOptions] = apiRequestMock.mock.calls[1];
        expect(confirmUrl).toContain("/api/v1/receipts/receipt-1/confirm");
        if (typeof confirmOptions?.body !== "string") {
            throw new Error("The receipt confirmation body must be JSON.");
        }
        expect(JSON.parse(confirmOptions.body)).toMatchObject({
            title: "Coffee",
            description: "Team meeting",
        });
    });
});