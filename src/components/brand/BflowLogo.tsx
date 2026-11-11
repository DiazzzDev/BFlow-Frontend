import BflowLogoDark from "@/assets/BFlow logo.svg";
import BflowLogoLight from "@/assets/BFlow logo light.svg";
import { useTheme } from "@/theme/ThemeProvider";

interface BflowLogoProps {
    alt?: string;
    className?: string;
}

export const BflowLogo = ({ alt = "", className }: BflowLogoProps) => {
    const { theme } = useTheme();

    return <img src={theme === "light" ? BflowLogoLight : BflowLogoDark} alt={alt} className={className} />;
};
