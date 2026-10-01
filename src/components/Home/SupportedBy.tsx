import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";

const SUPPORTERS = [
  { name: "Microsoft", logo: "/microsoft-logo.png" },
  { name: "Qualcomm", logo: "/qualcomm-logo.png" },
  { name: "NVIDIA", logo: "/nvidia-logo.png" },
  { name: "Arm", logo: "/arm-logo.png" },
];

export function SupportedBy() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <p className="text-center text-[13px] uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
        {t("hero.supportedBy")}
      </p>

      <div className="mt-6 w-full border-y border-[var(--color-border)]">
        <div className="mx-auto grid w-full max-w-[var(--max-width-content)] grid-cols-2 px-6 md:grid-cols-4">
          {SUPPORTERS.map((supporter, index) => (
            <div
              key={supporter.name}
              className={cn(
                "flex items-center justify-center px-4 py-5 md:px-8",
                // Divider between columns, skipping the first cell of each row
                "border-[var(--color-border)]",
                index % 2 !== 0 && "border-l",
                index === 2 && "border-l-0 md:border-l"
              )}
            >
              <img
                src={supporter.logo}
                alt={supporter.name}
                loading="lazy"
                className="h-6 w-auto max-w-full object-contain md:h-7"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
