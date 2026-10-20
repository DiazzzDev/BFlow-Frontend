import { useState } from "react";

// Selection modes:
// - "auto" → follow items[0] as the list changes
// - T      → user (or seed) picked a concrete item; no longer follows the list
// - null   → nothing selected
type Selection<T> = "auto" | T | null;

// "auto" tracks items[0]; calling setSelection with an item leaves auto mode
export const useAutoSelect = <T,>(items: T[], enabled = true) => {
    const [selection, setSelection] = useState<Selection<T>>("auto");

    const selectedItem = !enabled ? selection === "auto" ? null : selection : selection === "auto" ? (items[0] ?? null) : selection;

    return { selectedItem, setSelection, selection };
};