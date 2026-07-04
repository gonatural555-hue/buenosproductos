import { giHomeClasses, giHomeJoinClasses, giHomeLightClasses, type GiHomeSectionTheme } from "@/lib/ui/gi-home";

type Props = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  theme?: GiHomeSectionTheme;
};

export default function SectionEyebrow({
  children,
  className,
  align = "left",
  theme = "dark",
}: Props) {
  const tokens = theme === "light" ? giHomeLightClasses : giHomeClasses;

  return (
    <p
      className={giHomeJoinClasses(
        tokens.eyebrow,
        align === "center" && tokens.eyebrowCenter,
        className
      )}
    >
      {children}
    </p>
  );
}
