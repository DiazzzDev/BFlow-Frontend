import { motion } from "framer-motion";

const STAGGER_SECONDS = 0.06;

interface SkeletonBlockProps {
    className: string;
    order: number;
}

// Fades in by `order` so the fake app shell assembles piece by piece
export const SkeletonBlock = ({ className, order }: SkeletonBlockProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: order * STAGGER_SECONDS, duration: 0.4, ease: "easeOut" }}
            className={`animate-pulse rounded-lg bg-light-5 ${className}`}
        />
    );
};
