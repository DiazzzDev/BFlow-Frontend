import { describe, expect, it } from "vitest";

import { isWalletTypeFilter } from "@/modules/app/features/wallets/utils/filters";

describe("isWalletTypeFilter", () => {
    it.each([
        ["MINE", true],
        ["SHARED", true],
        [null, false],
        ["ALL", false],
        ["mine", false],
        ["", false],
    ])("accepts %s as a wallet scope: %s", (value, expected) => {
        expect(isWalletTypeFilter(value)).toBe(expected);
    });
});
