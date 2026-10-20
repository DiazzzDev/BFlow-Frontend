import { useEffect, useState } from "react";

// Band below the sticky navbar where a section counts as "being read"
const OBSERVER_MARGIN = "-80px 0px -65% 0px";

export const useActiveSection = (ids: string[]) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    // Joined so a new array with the same ids does not re-create the observer
    const idsKey = ids.join(",");

    useEffect(() => {
        const elements = idsKey
            .split(",")
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);

        const observer = new IntersectionObserver(
            (entries) => {
                const [topEntry] = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (topEntry) {
                    setActiveId(topEntry.target.id);
                }
            },
            { rootMargin: OBSERVER_MARGIN },
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [idsKey]);

    return activeId !== null && ids.includes(activeId) ? activeId : ids[0];
};
