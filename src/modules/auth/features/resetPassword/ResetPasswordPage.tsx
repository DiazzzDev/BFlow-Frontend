import { useSearchParams } from "react-router-dom";

import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { useResetPassword } from "./hooks/useResetPassword";

export const ResetPasswordPage = () => {
    const [params] = useSearchParams();
    const email = params.get("email") ?? "";

    const { mutateAsync: resetPassword, isPending: isLoading } = useResetPassword();

    return (
        <div className="flex min-h-screen items-center justify-center">
            <ResetPasswordForm
                isLoading={isLoading}
                onSubmit={async ({ code, password }) => {
                    await resetPassword({ email, code, password });
                }}
            />
        </div>
    );
};
