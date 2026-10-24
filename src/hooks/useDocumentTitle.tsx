import { useEffect } from "react";

const APPLICATION_NAME = "BFlow";

export function useDocumentTitle(title: string, keepOnUnmount = false) {
    useEffect(() => {
        const defaultTitle = APPLICATION_NAME;
        document.title = title || defaultTitle;

        return () => {
            if (!keepOnUnmount) {
                document.title = defaultTitle;
            }
        };
    }, [title, keepOnUnmount]);
}
