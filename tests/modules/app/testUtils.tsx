/* eslint-disable react-refresh/only-export-components */
import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";

import i18n from "@/i18n/i18n";

export const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
    },
});

export const TestProviders = ({
    children,
    initialEntry = "/",
}: PropsWithChildren<{ initialEntry?: string }>) => (
    <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={createTestQueryClient()}>
            <MemoryRouter initialEntries={[initialEntry]}>
                {children}
            </MemoryRouter>
        </QueryClientProvider>
    </I18nextProvider>
);

export const renderWithAppProviders = (
    ui: React.ReactElement,
    { initialEntry = "/" }: { initialEntry?: string } = {},
) => render(
    <TestProviders initialEntry={initialEntry}>{ui}</TestProviders>,
);
