import { useEffect } from "react";

import { bootstrapAuth } from "@/auth/services/bootstrapAuth";

interface Props {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    useEffect(() => {
        const controller = new AbortController();

        void bootstrapAuth({ signal: controller.signal });

        return () => {
            controller.abort();
        };
    }, []);

    return children;
};
