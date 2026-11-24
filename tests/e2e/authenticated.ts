import { expect, type Page } from "@playwright/test";

export const credentials = {
    email: process.env.PLAYWRIGHT_E2E_EMAIL,
    password: process.env.PLAYWRIGHT_E2E_PASSWORD,
};

export const hasCredentials = Boolean(credentials.email && credentials.password);

export const loginForE2E = async (page: Page) => {
    await page.goto("/auth/login");
    await page.locator("#txtEmail").fill(credentials.email!);
    await page.locator("#txtPassword").fill(credentials.password!);
    await page.getByRole("button", { name: /sign in|iniciar sesión/i }).click();
    await expect(page).toHaveURL(/\/app\/dashboard/, { timeout: 20_000 });
};
