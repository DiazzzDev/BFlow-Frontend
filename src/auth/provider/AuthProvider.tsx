import { AuthProvider as OidcAuthProvider } from "react-oidc-context";

import { cognitoConfig } from "../cognito/config";

interface Props {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    return (
        <OidcAuthProvider
            {...cognitoConfig}
            onSigninCallback={() => {
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );
            }}
        >
            {children}
        </OidcAuthProvider>
    );
};