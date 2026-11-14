import { describe, expect, it } from "vitest";

import {
    getWalletAllowedTransactionTypes,
    getVisibleWalletViewTabs,
    isDetailTab,
    resolveWalletViewTab,
} from "@/modules/app/features/walletView/utils/tabs/walletViewTabs";

describe("wallet view access by member count", () => {
    it("shows transfers and allows them for an owner wallet", () => {
        expect(getVisibleWalletViewTabs(1).map(({ id }) => id)).toContain("transfers");
        expect(getWalletAllowedTransactionTypes(1)).toContain("TRANSFER");
    });

    it("hides transfers and redirects its tab for a shared wallet", () => {
        expect(getVisibleWalletViewTabs(2).map(({ id }) => id)).not.toContain("transfers");
        expect(getWalletAllowedTransactionTypes(2)).toEqual(["INCOME", "EXPENSE"]);
        expect(resolveWalletViewTab("transfers", 2)).toBe("overview");
    });

    it("validates tabs persisted in the URL", () => {
        expect(isDetailTab("members")).toBe(true);
        expect(isDetailTab("bogus")).toBe(false);
        expect(isDetailTab(null)).toBe(false);
    });
});
