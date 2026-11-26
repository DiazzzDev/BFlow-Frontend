import { describe, expect, it, vi } from "vitest";

const apiRequest = vi.hoisted(() => vi.fn());
vi.mock("@/utils/api", () => ({ apiRequest }));
vi.mock("@/config/config", () => ({ config: { API_BASE_URL: "https://api.example.test" } }));

describe("settings subscription data", () => {
    it("loads the authenticated user subscription history", async () => {
        apiRequest.mockResolvedValue({ data: [] });
        const { getMySubscriptions } = await import("@/modules/app/features/settings/settings.service");

        await expect(getMySubscriptions()).resolves.toEqual({ data: [] });
        expect(apiRequest).toHaveBeenCalledWith(
            "https://api.example.test/api/v1/subscriptions",
            expect.objectContaining({ method: "GET" }),
            "Error al cargar las suscripciones",
        );
    });
});
