import { beforeEach, describe, expect, it } from "vitest";

import {
    assertEmailActionAllowed,
    EmailActionRateLimitError,
} from "@/auth/utils/emailActionRateLimit";

describe("email action throttling", () => {
    beforeEach(() => localStorage.clear());

    it("blocks the fourth password-reset request before it reaches Cognito", () => {
        const now = 1_000_000;
        for (let attempt = 0; attempt < 3; attempt += 1) {
            expect(() => assertEmailActionAllowed("password-reset", "a@b.com", now + attempt)).not.toThrow();
        }
        expect(() => assertEmailActionAllowed("password-reset", "a@b.com", now + 4)).toThrow(EmailActionRateLimitError);
    });

    it("uses a stricter budget for account creation emails", () => {
        const now = 1_000_000;
        assertEmailActionAllowed("signup", "a@b.com", now);
        assertEmailActionAllowed("signup", "a@b.com", now + 1);
        expect(() => assertEmailActionAllowed("signup", "a@b.com", now + 2)).toThrow(EmailActionRateLimitError);
    });

    it("allows a request again after the window expires", () => {
        assertEmailActionAllowed("verification-resend", "a@b.com", 0);
        assertEmailActionAllowed("verification-resend", "a@b.com", 1);
        assertEmailActionAllowed("verification-resend", "a@b.com", 2);
        expect(() => assertEmailActionAllowed("verification-resend", "a@b.com", 3_600_001)).not.toThrow();
    });
});
