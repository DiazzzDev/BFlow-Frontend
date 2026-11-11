import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import "./auth/cognito/amplify.ts";
import "./i18n/i18n.ts";

import App from './App.tsx'
import './index.css'
import { initializeTheme, ThemeProvider } from './theme/ThemeProvider.tsx'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
})

initializeTheme()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<App />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</ThemeProvider>
	</StrictMode>,
)
