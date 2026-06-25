import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export const useSession = () => {

    const [isLoading, setIsLoading] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const validate = async () => {

            try {

                const session =
                    await fetchAuthSession();

                setIsAuthenticated(
                    !!session.tokens?.accessToken
                );

            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        void validate();

    }, []);

    return {
        isLoading,
        isAuthenticated,
    };
};