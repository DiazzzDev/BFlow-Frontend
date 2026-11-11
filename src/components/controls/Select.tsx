import {
    Children,
    forwardRef,
    isValidElement,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type ReactNode,
    type SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
}

interface SelectOption {
    value: string;
    label: ReactNode;
    disabled: boolean;
}

interface MenuPosition {
    left: number;
    width: number;
    top?: number;
    bottom?: number;
}

const getOptions = (children: ReactNode): SelectOption[] =>
    Children.toArray(children).flatMap((child) => {
        if (!isValidElement<{ value?: string | number; disabled?: boolean; children?: ReactNode }>(child)) {
            return [];
        }

        return [{
            value: String(child.props.value ?? ""),
            label: child.props.children,
            disabled: Boolean(child.props.disabled),
        }];
    });

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            id,
            children,
            className,
            name,
            value,
            defaultValue,
            disabled = false,
            onChange,
            onBlur,
            "aria-label": ariaLabel,
            "aria-describedby": ariaDescribedBy,
            ...props
        },
        ref,
    ) => {
        const options = getOptions(children);
        const initialValue =
            value === undefined
                ? String(defaultValue ?? options.find((option) => !option.disabled)?.value ?? "")
                : String(value);
        const [internalValue, setInternalValue] = useState(initialValue);
        const [isOpen, setIsOpen] = useState(false);
        const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const buttonRef = useRef<HTMLButtonElement>(null);
        const menuRef = useRef<HTMLUListElement>(null);
        const selectedValue = value === undefined ? internalValue : String(value);
        const selectedOption = options.find((option) => option.value === selectedValue);

        useEffect(() => {
            const handlePointerDown = (event: MouseEvent) => {
                const target = event.target as Node;
                if (!containerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
                    setIsOpen(false);
                }
            };

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    setIsOpen(false);
                }
            };

            document.addEventListener("mousedown", handlePointerDown);
            document.addEventListener("keydown", handleKeyDown);

            return () => {
                document.removeEventListener("mousedown", handlePointerDown);
                document.removeEventListener("keydown", handleKeyDown);
            };
        }, []);

        const updateMenuPosition = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) {
                return;
            }

            const menuHeight = Math.min(options.length * 40 + 12, 224);
            const openUp = window.innerHeight - rect.bottom < menuHeight && rect.top > menuHeight;

            setMenuPosition(
                openUp
                    ? { left: rect.left, width: rect.width, bottom: window.innerHeight - rect.top + 6 }
                    : { left: rect.left, width: rect.width, top: rect.bottom + 6 },
            );
        };

        useEffect(() => {
            if (!isOpen) {
                return;
            }

            updateMenuPosition();
            window.addEventListener("resize", updateMenuPosition);
            window.addEventListener("scroll", updateMenuPosition, true);

            return () => {
                window.removeEventListener("resize", updateMenuPosition);
                window.removeEventListener("scroll", updateMenuPosition, true);
            };
        }, [isOpen]);

        const createChangeEvent = (nextValue: string) =>
            ({
                target: { value: nextValue, name: name ?? id },
                currentTarget: { value: nextValue, name: name ?? id },
            }) as ChangeEvent<HTMLSelectElement>;

        const handleValueChange = (nextValue: string) => {
            if (value === undefined) {
                setInternalValue(nextValue);
            }

            onChange?.(createChangeEvent(nextValue));
            setIsOpen(false);
        };

        const handleBlur = () => {
            window.setTimeout(() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                    setIsOpen(false);
                    onBlur?.(
                        {
                            target: { value: selectedValue, name: name ?? id },
                            currentTarget: { value: selectedValue, name: name ?? id },
                        } as FocusEvent<HTMLSelectElement>,
                    );
                }
            }, 0);
        };

        return (
            <div ref={containerRef} className={`relative w-full ${className ?? ""}`}>
                <select
                    {...props}
                    ref={ref}
                    id={`${id}-native`}
                    name={name ?? id}
                    value={selectedValue}
                    disabled={disabled}
                    tabIndex={-1}
                    aria-hidden="true"
                    onChange={(event) => handleValueChange(event.target.value)}
                    className="sr-only"
                >
                    {children}
                </select>

                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    aria-label={ariaLabel}
                    aria-describedby={ariaDescribedBy}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    ref={buttonRef}
                    onClick={() => {
                        if (!isOpen) {
                            updateMenuPosition();
                        }
                        setIsOpen((open) => !open);
                    }}
                    onBlur={handleBlur}
                    onKeyDown={(event) => {
                        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                            event.preventDefault();
                            setIsOpen(true);
                        }
                    }}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-light-10 bg-surface-hard/40 px-3 py-2 text-left text-sm text-light shadow-sm transition-[border-color,box-shadow,background-color,transform] hover:border-light-25 focus:border-primary-75 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="min-w-0 truncate">{selectedOption?.label}</span>
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="ml-3 shrink-0 text-helper"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </motion.span>
                </button>

                {createPortal(
                    <AnimatePresence>
                        {isOpen && !disabled && menuPosition && (
                            <motion.ul
                            ref={menuRef}
                            role="listbox"
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.16, ease: "easeOut" }}
                            style={menuPosition}
                            className="fixed z-[100] max-h-56 overflow-y-auto rounded-lg border border-light-10 bg-surface p-1.5 shadow-custom"
                        >
                            {options.map((option) => {
                                const isSelected = option.value === selectedValue;

                                return (
                                    <li key={option.value} role="option" aria-selected={isSelected}>
                                        <button
                                            type="button"
                                            disabled={option.disabled}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => handleValueChange(option.value)}
                                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                                isSelected
                                                    ? "bg-primary-15 text-light"
                                                    : "text-light-75 hover:bg-light-10 hover:text-light"
                                            } disabled:cursor-not-allowed disabled:opacity-40`}
                                        >
                                            <span className="min-w-0 truncate">{option.label}</span>
                                            {isSelected && <Check className="ml-3 h-4 w-4 shrink-0 text-primary" />}
                                        </button>
                                    </li>
                                );
                            })}
                            </motion.ul>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
            </div>
        );
    },
);

Select.displayName = "Select";
