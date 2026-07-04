import { giHomeClasses, giHomeJoinClasses, giHomeLightClasses, type GiHomeSectionTheme } from "@/lib/ui/gi-home";

type Props = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
  theme?: GiHomeSectionTheme;
};

export default function SectionTitle({
  children,
  className,
  align = "left",
  as: Tag = "h2",
  theme = "dark",
}: Props) {
  const tokens = theme === "light" ? giHomeLightClasses : giHomeClasses;

  return (
    <Tag
      className={giHomeJoinClasses(
        tokens.title,
        align === "center" && tokens.titleCenter,
        className
      )}
    >
      {children}
    </Tag>
  );
}
