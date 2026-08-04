import { Link } from "react-router-dom";

import { useLandingHome } from "../hooks/custom/useLandingHome.tsx";
import BflowLogo from ".././../../assets/BFlow logo.svg";


const GitHubIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.921.43.372.813 1.102.813 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12 24 5.37 18.627 0 12 0z" />
    </svg>
);

export const LandingFooter = () => {
    const { handleNavClick } = useLandingHome();

    return (
        <footer className="border-t border-light-10 bg-surface-hard px-8 md:px-16 xl:px-24 pt-16 pb-10">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 mb-6 border-b border-light-10 pb-10">
                    <div className="flex flex-col items-start">
                        <div className="flex flex-col items-start gap-3 mb-3">
                            <img src={BflowLogo} alt="BFlow Studio" className="w-8 h-8" />
                            <span className="text-lg font-bold tracking-tight">BFlow <span className="text-light-75">Studio</span></span>
                        </div>
                        <p className="text-sm text-helper mb-5 max-w-xs">
                            El control financiero que siempre quisiste
                        </p>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex text-helper hover:text-light transition-colors"
                            aria-label="GitHub"
                        >
                            <GitHubIcon />
                        </a>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-4">Nosotros</h4>
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="text-sm text-helper hover:text-light transition-colors text-left cursor-pointer"
                            >
                                Inicio
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNavClick("faq")}
                                className="text-sm text-helper hover:text-light transition-colors text-left cursor-pointer"
                            >
                                Preguntas frecuentes
                            </button>
                            <a
                                href="mailto:hola@bflow.studio"
                                className="text-sm text-helper hover:text-light transition-colors"
                            >
                                Contacto
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-4">Planes</h4>
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => handleNavClick("pricing")}
                                className="text-sm text-helper hover:text-light transition-colors text-left cursor-pointer"
                            >
                                Personal
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNavClick("pricing")}
                                className="text-sm text-helper hover:text-light transition-colors text-left cursor-pointer"
                            >
                                Bflow pro
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-4">Legal</h4>
                        <div className="flex flex-col gap-3">
                            <Link to="/terms" className="text-sm text-helper hover:text-light transition-colors">
                                Términos y condiciones
                            </Link>
                            <Link to="/privacy" className="text-sm text-helper hover:text-light transition-colors">
                                Política de privacidad
                            </Link>
                            <Link to="/cookies" className="text-sm text-helper hover:text-light transition-colors">
                                Política de cookies
                            </Link>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-label">2026 Bflow Studio</p>
            </div>
        </footer>
    );
};
