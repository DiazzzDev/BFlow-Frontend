import { Outlet } from "react-router";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const AuthLayout = () => {
    useDocumentTitle();

    return <Outlet />;
};


