import { useSearchParams } from "react-router";

import { VerifyAccountForm } from "./components/VerifyAccountForm";
import { useVerifyAccount } from "./hooks/useVerifyAccount";

export const VerifyAccountPage = () => {
    const [params] = useSearchParams();
    const email = params.get("email") ?? "";

    const { mutateAsync: onSubmit, isPending: isLoading } = useVerifyAccount();

    return (
        <div className="flex min-h-screen items-center justify-center">
            <VerifyAccountForm
                isLoading={isLoading}
                onSubmit={(code) => onSubmit({ email, code })}
            />
        </div>
    );
};
