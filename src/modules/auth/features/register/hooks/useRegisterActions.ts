import { useNavigate } from "react-router-dom";

export const useRegisterActions = () => {
    const navigate = useNavigate();
    const isLoading = false;

    const onRegisterUser = (_email: string, _password: string, _fullName: string) => {
        void navigate("/auth/login");
    };

    return { onRegisterUser, isLoading };
};