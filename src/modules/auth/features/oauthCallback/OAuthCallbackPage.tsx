import { MotionConfig } from "framer-motion";

import { CallbackAppSkeleton } from "./components/CallbackAppSkeleton";
import { CallbackLoader } from "./components/CallbackLoader";
import { useOAuthCallback } from "./hooks/useOAuthCallback";

export const OAuthCallbackPage = () => {
    // Kick off OAuth session sync on mount
    useOAuthCallback();

    return (
        <MotionConfig reducedMotion="user">
            <div role="status" aria-live="polite" className="fixed inset-0 overflow-hidden bg-surface-hard text-light">
                <CallbackAppSkeleton />

                <div className="absolute inset-0 flex items-center justify-center bg-surface-hard/60 px-6">
                    <CallbackLoader />
                </div>
            </div>
        </MotionConfig>
    );
};
