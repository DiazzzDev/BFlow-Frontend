import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useLandingHashScroll = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const id = hash.replace("#", "")
            const element = document.getElementById(id)
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" })
                }, 0)
            }
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [hash])
}
