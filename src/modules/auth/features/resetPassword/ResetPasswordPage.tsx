import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

/**
 * Legacy route kept for backward-compatibility with any saved links.
 * Redirects to the unified forgot-password stepper, preserving the email
 * query param so the old URL still works gracefully.
 */
export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const email = params.get("email");

    useEffect(() => {
        const target = email
            ? `/auth/forgot-password?email=${encodeURIComponent(email)}`
            : "/auth/forgot-password";
        void navigate(target, { replace: true });
    }, [navigate, email]);

    return null;
};
