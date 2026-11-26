import { expect, test } from "@playwright/test";

test("Google login uses only the client scopes configured for this environment", async ({ page }) => {
    await page.goto("/auth/login");
    let authorizationUrl = "";
    await page.route("**/oauth2/authorize**", (route) => {
        authorizationUrl = route.request().url();
        return route.abort();
    });

    await page.getByRole("button", { name: /continuar con google|continue with google/i }).click();
    await expect.poll(() => authorizationUrl).not.toBe("");
    expect(new URL(authorizationUrl).searchParams.get("scope")).toBe("openid email profile");
    await expect(page).not.toHaveURL(/\/auth\/undefined\//);
});
