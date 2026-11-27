import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.mock('framer-motion', async () => {
    const React = await import('react')
    const components = new Map<string, React.ForwardRefExoticComponent<Record<string, unknown>>>()
    const motion = new Proxy({}, {
        get: (_, tag: string) => {
            const cached = components.get(tag)
            if (cached) {
                return cached
            }

            const component = React.forwardRef<HTMLElement, Record<string, unknown>>(({
                animate: _animate,
                exit: _exit,
                initial: _initial,
                layout: _layout,
                layoutId: _layoutId,
                transition: _transition,
                whileHover: _whileHover,
                ...props
            }, ref) => React.createElement(tag, { ...props, ref }))
            components.set(tag, component)
            return component
        },
    })

    return {
        AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
        MotionConfig: ({ children }: { children: React.ReactNode }) => children,
        animate: () => ({ stop: () => {} }),
        motion,
        useReducedMotion: () => true,
    }
})

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
