import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { useForgotPassword } from "./hooks/useForgotPassword";

export const ForgotPasswordPage = () => {
    const { mutateAsync: onSubmit, isPending: isLoading } = useForgotPassword();

    return (
        <div className="flex min-h-screen items-center justify-center">
            <ForgotPasswordForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};
