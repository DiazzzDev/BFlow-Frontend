import { useTranslation } from "react-i18next";
import { SiClaude } from "@icons-pack/react-simple-icons";
import { BflowLogo } from "@/components/brand/BflowLogo";
import { useTheme } from "@/theme/ThemeProvider";

import gmailLogo from "../../assets/integrations/gmail.svg";
import excelLogo from "../../assets/integrations/excel.svg";
import chatGptLogo from "../../assets/integrations/chatgpt.svg";

// Elementos de la cuadrícula (4x3) con énfasis en el centro y desvanecimiento en los bordes
const gridItems: Array<{
  id: number;
  name: string;
  src?: string;
  Icon?: typeof SiClaude;
  isMain?: boolean;
  opacity?: string;
}> = [
  { id: 1, name: "Claude", Icon: SiClaude, opacity: "opacity-35 blur-[0.5px]" },
  { id: 2, name: "Excel", src: excelLogo, opacity: "opacity-80" },
  { id: 3, name: "Gmail", src: gmailLogo, opacity: "opacity-65" },
  { id: 4, name: "ChatGPT", src: chatGptLogo, opacity: "opacity-30 blur-[1px]" },

  { id: 5, name: "Gmail", src: gmailLogo, opacity: "opacity-85" },
  { id: 6, name: "Bflow", isMain: true },
  { id: 7, name: "Claude", Icon: SiClaude, opacity: "opacity-90" },
  { id: 8, name: "Excel", src: excelLogo, opacity: "opacity-45 blur-[0.5px]" },

  { id: 9, name: "ChatGPT", src: chatGptLogo, opacity: "opacity-35 blur-[1px]" },
  { id: 10, name: "Claude", Icon: SiClaude, opacity: "opacity-75" },
  { id: 11, name: "Excel", src: excelLogo, opacity: "opacity-85" },
  { id: 12, name: "Gmail", src: gmailLogo, opacity: "opacity-40 blur-[0.5px]" },
];

export const LandingIntegrations = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 pb-20 sm:px-8 md:pb-20 overflow-hidden"
      aria-labelledby="integrations-title"
    >
      <div className="grid items-center gap-12 bg-transparent p-4 sm:p-8 lg:grid-cols-2 lg:gap-16">
        {/* Columna Izquierda: Título y descripción */}
        <div className="max-w-md z-10">
          <h2
            id="integrations-title"
            className="text-3xl font-bold tracking-tight text-light md:text-5xl"
          >
            {t("home.integrations.title", "Control total, cero fricción")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-helper sm:text-lg">
            {t(
              "home.integrations.description",
              "Conecta tus herramientas favoritas y olvídate del trabajo manual. Importa datos de Excel, entra con Gmail y analiza cuentas con Claude o ChatGPT."
            )}
          </p>
        </div>

        {/* Columna Derecha: Cuadrícula isométrica con desvanecimiento radial */}
        <div className="relative w-full flex items-center justify-center py-8">
          {/* Resplandor ambiental sutil detrás de Bflow */}
          <div className="absolute h-10 w-50 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          {/* Contenedor con máscara radial para fundir los bordes como en el diseño claro */}
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl p-4"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 75% at 48% 50%, black 45%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 75% at 48% 50%, black 45%, transparent 95%)",
            }}
          >
            {/* Plano inclinado en perspectiva 3D */}
            <div
              className="grid grid-cols-4 gap-4 scale-110"
              style={{
                transform:
                  "perspective(950px) rotateX(22deg) rotateY(-16deg) rotateZ(10deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {gridItems.map((item) => {
                if (item.isMain) {
                  // Tarjeta central de Bflow sin borde naranja, con contraste oscuro limpio
                  return (
                    <div
                      key="bflow-main"
                      className="relative z-20 flex aspect-square items-center justify-center rounded-2xl border border-light-10 bg-surface p-3.5 shadow-custom"
                    >
                      <div className="h-9 w-9 text-orange-500 flex items-center justify-center">
                        <BflowLogo className="w-full h-full object-contain" />
                      </div>
                    </div>
                  );
                }

                // Azulejos oscuros con íconos en blanco/claro
                return (
                  <div
                    key={`${item.name}-${item.id}`}
                    className={`flex aspect-square items-center justify-center rounded-2xl border border-light-10 bg-surface-75 p-3.5 shadow-custom transition-all duration-300 ${item.opacity ?? ""}`}
                  >
                    {item.Icon ? (
                      <item.Icon
                        className="h-8 w-8 text-[#d97757] sm:h-9 sm:w-9"
                        aria-label={item.name}
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={item.name}
                        className={`h-8 w-8 object-contain opacity-90 sm:h-9 sm:w-9 ${item.name === "ChatGPT" && theme === "dark" ? "brightness-0 invert" : ""}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
