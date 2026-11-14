import { afterEach, describe, expect, it, vi } from "vitest";

import {
    getInvitationExpiryLabel,
    isInvitationExpired,
} from "@/modules/app/features/wallets/utils/invitationExpiry";

describe("wallet invitation expiry", () => {
    afterEach(() => vi.useRealTimers());

    it("distinguishes expired, active, missing, and invalid expiry dates", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-13T12:00:00Z"));

        expect(isInvitationExpired("2026-11-13T11:59:59Z")).toBe(true);
        expect(isInvitationExpired("2026-11-14T12:00:00Z")).toBe(false);
        expect(isInvitationExpired(null)).toBe(false);
        expect(isInvitationExpired("not-a-date")).toBe(false);
    });

    it("labels expired dates and omits absent expiry dates", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-13T12:00:00Z"));

        expect(getInvitationExpiryLabel("2020-01-01T00:00:00Z")).toBe("Expiró");
        expect(getInvitationExpiryLabel(null)).toBeNull();
    });
});
