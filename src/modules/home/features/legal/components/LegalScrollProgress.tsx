import { useEffect, useState } from "react";

export const LegalScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
            <div
                className="h-full bg-(--primary) transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}; 
