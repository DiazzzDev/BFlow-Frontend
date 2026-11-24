import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Side = "left" | "right";
type DragAxis = "pending" | "horizontal" | "vertical";

export interface OptionWheelProps {
    items?: string[];
    defaultSelected?: number;
    selected?: number;
    onChange?: (index: number, item: string, position: number) => void;
    ariaLabel?: string;
    textColor?: string;
    activeColor?: string;
    side?: Side;
    fontSize?: number;
    spacing?: number;
    curve?: number;
    tilt?: number;
    blur?: number;
    fade?: number;
    minOpacity?: number;
    smoothing?: number;
    inset?: number;
    loop?: boolean;
    draggable?: boolean;
    renderItem?: (item: string, index: number, selected: boolean) => ReactNode;
    className?: string;
}

interface WheelConfig {
    count: number;
    items: string[];
    rowH: number;
    curve: number;
    tilt: number;
    blur: number;
    fade: number;
    minOpacity: number;
    side: Side;
    loop: boolean;
    smoothing: number;
    draggable: boolean;
}

interface DragState {
    x: number;
    y: number;
    start: number;
    id: number;
    pointerType: string;
    axis: DragAxis;
}

const DEFAULT_ITEMS = [
    "Ambient",
    "House",
    "Techno",
    "Jazz",
    "Lo-Fi",
    "Synthwave",
    "Trance",
    "Funk",
    "Disco",
    "Hip-Hop",
    "Chillwave",
    "Drum & Bass",
];

const OptionWheel = ({
    items = DEFAULT_ITEMS,
    defaultSelected = 3,
    selected,
    onChange,
    ariaLabel = "Option wheel",
    textColor = "#a6a6a6",
    activeColor = "#ffffff",
    side = "left",
    fontSize = 3,
    spacing = 1.4,
    curve = 1,
    tilt = 6,
    blur = 2,
    fade = 0.25,
    minOpacity = 0.05,
    smoothing = 200,
    inset = 80,
    loop = false,
    draggable = true,
    renderItem,
    className = "",
}: OptionWheelProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const wheelId = useId();
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const runFrameRef = useRef<(now: number) => void>(() => {});
    const posRef = useRef(defaultSelected);
    const targetRef = useRef(defaultSelected);
    const rafRef = useRef<number | null>(null);
    const lastRef = useRef(0);
    const cfgRef = useRef<WheelConfig>({} as WheelConfig);
    const onChangeRef = useRef(onChange);
    const selectedRef = useRef(defaultSelected);
    const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragRef = useRef<DragState | null>(null);
    const dragMovedRef = useRef(false);
    const isVisibleRef = useRef(false);
    const reduceMotionRef = useRef(false);
    const hasEnteredRef = useRef(false);
    const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
    const [isDragging, setIsDragging] = useState(false);

    const remPx = typeof window !== "undefined"
        ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        : 16;

    useLayoutEffect(() => {
        onChangeRef.current = onChange;
        cfgRef.current = {
            count: items.length,
            items,
            rowH: Math.max(fontSize * spacing * remPx, 1),
            curve,
            tilt,
            blur,
            fade,
            minOpacity,
            side,
            loop,
            smoothing,
            draggable,
        };
    }, [items, onChange, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, draggable, remPx]);

    const applyLayout = useCallback((position: number) => {
        const cfg = cfgRef.current;
        const n = cfg.count;
        const mirror = cfg.side === "right" ? -1 : 1;
        const tiltRad = (cfg.tilt * Math.PI) / 180;
        const radius = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;

        for (let i = 0; i < n; i++) {
            const element = itemRefs.current[i];
            if (!element) {continue;}

            let distanceFromCenter = i - position;
            if (cfg.loop && n > 1) {
                distanceFromCenter = ((distanceFromCenter % n) + n) % n;
                if (distanceFromCenter > n / 2) {distanceFromCenter -= n;}
            }

            const distance = Math.abs(distanceFromCenter);
            let x = 0;
            let y = distanceFromCenter * cfg.rowH;
            let rotation = 0;

            if (radius > 0) {
                const angle = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, distanceFromCenter * tiltRad),
                );
                y = radius * Math.sin(angle);
                x = -mirror * radius * (1 - Math.cos(angle)) * cfg.curve;
                rotation = (mirror * angle * 180) / Math.PI;
            }

            element.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rotation.toFixed(3)}deg)`;
            const opacity = Math.max(cfg.minOpacity, Math.pow(Math.max(0, 1 - distance * cfg.fade), 1.45));
            element.style.opacity = String(opacity);
            element.style.filter = `blur(${(Math.min(distance, 2) * cfg.blur).toFixed(2)}px)`;
            element.style.setProperty("--ow-p", Math.max(0, 1 - Math.min(distance, 1)).toFixed(4));
        }
    }, []);

    const runFrame = useCallback((now: number) => {
        const dt = Math.min((now - lastRef.current) / 1000, 0.05);
        lastRef.current = now;
        const cfg = cfgRef.current;
        const tau = Math.max(cfg.smoothing, 1) / 1000;
        const k = reduceMotionRef.current ? 1 : 1 - Math.exp(-dt / tau);
        const target = targetRef.current;
        const cur = posRef.current;
        let next = cur + (target - cur) * k;
        const settled = Math.abs(target - next) < 0.001;
        if (settled) {next = target;}
        posRef.current = next;
        applyLayout(next);

        if (settled || !isVisibleRef.current) {
            rafRef.current = null;
        } else {
            rafRef.current = requestAnimationFrame((frameTime) => runFrameRef.current(frameTime));
        }
    }, [applyLayout]);

    const startLoop = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        if (!isVisibleRef.current) {return;}
        lastRef.current = performance.now();
        rafRef.current = requestAnimationFrame((frameTime) => runFrameRef.current(frameTime));
    }, []);

    useEffect(() => {
        runFrameRef.current = runFrame;
    }, [runFrame]);

    const applyTarget = useCallback(
        (value: number, snap: boolean) => {
            const cfg = cfgRef.current;
            if (cfg.count === 0) {return;}

            let nextValue = value;
            if (!cfg.loop) {nextValue = Math.min(Math.max(nextValue, 0), cfg.count - 1);}
            if (snap) {nextValue = Math.round(nextValue);}
            targetRef.current = nextValue;

            const index = ((Math.round(nextValue) % cfg.count) + cfg.count) % cfg.count;
            if (index !== selectedRef.current) {
                selectedRef.current = index;
                setSelectedIndex(index);
                onChangeRef.current?.(index, cfg.items[index], Math.round(nextValue));
            }

            startLoop();
        },
        [startLoop],
    );

    useEffect(() => {
        const element = rootRef.current;
        if (!element) {return;}

        // The wheel is in the hero, so paint it before the observer callback runs.
        isVisibleRef.current = true;
        if (!hasEnteredRef.current && !reduceMotionRef.current) {
            posRef.current -= 0.22;
            hasEnteredRef.current = true;
        }
        applyLayout(posRef.current);
        startLoop();

        if (!("IntersectionObserver" in window)) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            const isVisible = entry.isIntersecting;
            isVisibleRef.current = isVisible;

            if (!isVisible && rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            } else if (isVisible) {
                startLoop();
            }
        }, { threshold: 0.01 });

        observer.observe(element);
        return () => observer.disconnect();
    }, [applyLayout, startLoop]);

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updatePreference = () => {
            reduceMotionRef.current = media.matches;
            if (media.matches && isVisibleRef.current) {startLoop();}
        };

        updatePreference();
        media.addEventListener("change", updatePreference);
        return () => media.removeEventListener("change", updatePreference);
    }, [startLoop]);

    useEffect(() => {
        const element = rootRef.current;
        if (!element) {return;}

        const onWheel = (event: WheelEvent) => {
            event.preventDefault();
            const cfg = cfgRef.current;
            const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
            const step = Math.max(-1, Math.min(1, delta / cfg.rowH));

            if (reduceMotionRef.current) {
                applyTarget(targetRef.current + step, true);
                return;
            }

            applyTarget(targetRef.current + step, false);
            if (wheelTimerRef.current) {clearTimeout(wheelTimerRef.current);}
            wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 140);
        };

        element.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            element.removeEventListener("wheel", onWheel);
            if (wheelTimerRef.current) {clearTimeout(wheelTimerRef.current);}
        };
    }, [applyTarget]);

    const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!cfgRef.current.draggable) {return;}
        dragRef.current = {
            x: event.clientX,
            y: event.clientY,
            start: targetRef.current,
            id: event.pointerId,
            pointerType: event.pointerType,
            axis: event.pointerType === "touch" ? "pending" : "vertical",
        };
        dragMovedRef.current = false;
        setIsDragging(true);
    }, []);

    const handlePointerMove = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const drag = dragRef.current;
            if (!drag) {return;}

            const dx = event.clientX - drag.x;
            const dy = event.clientY - drag.y;

            if (drag.axis === "pending" && Math.max(Math.abs(dx), Math.abs(dy)) > 6) {
                drag.axis = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
                if (drag.axis === "vertical") {return;}
            }

            if (drag.pointerType === "touch" && drag.axis === "vertical") {return;}
            if (drag.axis === "pending") {return;}

            if (!dragMovedRef.current) {
                dragMovedRef.current = true;
                rootRef.current?.setPointerCapture(drag.id);
            }

            const offset = drag.axis === "horizontal" ? dx : dy;
            applyTarget(drag.start - offset / cfgRef.current.rowH, false);
        },
        [applyTarget],
    );

    const handlePointerEnd = useCallback(() => {
        if (!dragRef.current) {return;}
        dragRef.current = null;
        setIsDragging(false);
        if (dragMovedRef.current) {applyTarget(targetRef.current, true);}
    }, [applyTarget]);

    const handleItemClick = useCallback(
        (index: number) => {
            if (dragMovedRef.current) {return;}
            const cfg = cfgRef.current;
            const {current} = targetRef;
            let distance = index - (((current % cfg.count) + cfg.count) % cfg.count);
            if (cfg.loop && cfg.count > 1) {
                if (distance > cfg.count / 2) {distance -= cfg.count;}
                else if (distance < -cfg.count / 2) {distance += cfg.count;}
            }
            applyTarget(current + distance, true);
        },
        [applyTarget],
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            let delta: number | null = null;
            if (event.key === "ArrowUp" || event.key === "ArrowLeft") {delta = -1;}
            else if (event.key === "ArrowDown" || event.key === "ArrowRight") {delta = 1;}
            if (delta === null) {return;}

            event.preventDefault();
            applyTarget(Math.round(targetRef.current) + delta, true);
        },
        [applyTarget],
    );

    useEffect(() => {
        selectedRef.current = Math.min(defaultSelected, Math.max(items.length - 1, 0));
        setSelectedIndex(selectedRef.current);
        posRef.current = selectedRef.current;
        targetRef.current = selectedRef.current;
        applyLayout(posRef.current);
        applyTarget(targetRef.current, false);
    }, [items, defaultSelected, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, applyLayout, applyTarget]);

    useEffect(() => {
        if (selected === undefined || selected === selectedRef.current) {return;}
        applyTarget(selected, true);
    }, [selected, applyTarget]);

    useEffect(
        () => () => {
            if (rafRef.current !== null) {cancelAnimationFrame(rafRef.current);}
            rafRef.current = null;
            if (wheelTimerRef.current) {clearTimeout(wheelTimerRef.current);}
        },
        [],
    );

    return (
        <div
            ref={rootRef}
            role="listbox"
            tabIndex={0}
            aria-label={ariaLabel}
            aria-activedescendant={`${wheelId}-option-${selectedIndex}`}
            className={`relative h-full w-full select-none overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface [touch-action:pan-y] ${isDragging ? "cursor-grabbing" : "cursor-grab"}${className ? ` ${className}` : ""}`}
            style={{
                "--ow-text-color": textColor,
                "--ow-active-color": activeColor,
                "--ow-font-size": `${fontSize}rem`,
                "--ow-inset": `${inset}px`,
            } as CSSProperties}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onKeyDown={handleKeyDown}
        >
            {items.map((label, index) => (
                <div
                    key={`${label}-${index}`}
                    ref={(element) => {
                        itemRefs.current[index] = element;
                    }}
                    id={`${wheelId}-option-${index}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    className={`absolute top-1/2 cursor-pointer whitespace-nowrap leading-none will-change-[transform,opacity] [font-size:var(--ow-font-size)] [color:color-mix(in_srgb,var(--ow-active-color)_calc(var(--ow-p,0)*100%),var(--ow-text-color))] ${
                        side === "right" ? "right-[var(--ow-inset)] origin-right" : "left-[var(--ow-inset)] origin-left"
                    } ${selectedIndex === index ? "font-medium" : "font-extralight"}`}
                    onClick={() => handleItemClick(index)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleItemClick(index);
                        }
                    }}
                >
                    {renderItem ? renderItem(label, index, selectedIndex === index) : label}
                </div>
            ))}
        </div>
    );
};

export default OptionWheel;
