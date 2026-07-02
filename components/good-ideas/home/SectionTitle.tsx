import { giHomeClasses, giHomeJoinClasses } from "@/lib/ui/gi-home";

type Props = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
};

export default function SectionTitle({
  children,
  className,
  align = "left",
  as: Tag = "h2",
}: Props) {
  return (
    <Tag
      className={giHomeJoinClasses(
        giHomeClasses.title,
        align === "center" && giHomeClasses.titleCenter,
        className
      )}
    >
      {children}
    </Tag>
  );
}
