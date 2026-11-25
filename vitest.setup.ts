import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

class ResizeObserverMock implements ResizeObserver {
	constructor(private readonly callback: ResizeObserverCallback) {
		void this.callback
	}

	disconnect() {}
	observe() {}
	unobserve() {}
	takeRecords(): ResizeObserverEntry[] {
		return []
	}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
	configurable: true,
	value: ResizeObserverMock,
})

afterEach(() => {
	cleanup()
})
