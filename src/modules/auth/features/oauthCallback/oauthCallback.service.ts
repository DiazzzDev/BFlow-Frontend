import { waitForSessionTokens, syncAuthUser } from "@/auth/services/session.service";
import type { InternalUser } from "@/auth/InternalUser";

export const completeOAuthLogin = async (): Promise<InternalUser> => {
    const tokens = await waitForSessionTokens();

    if (!tokens) {
        throw new Error("Tokens not found");
    }

    return syncAuthUser(tokens.idToken, tokens.email);
};
