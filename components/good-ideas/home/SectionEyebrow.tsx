import { giHomeClasses, giHomeJoinClasses } from "@/lib/ui/gi-home";

type Props = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
};

export default function SectionEyebrow({
  children,
  className,
  align = "left",
}: Props) {
  return (
    <p
      className={giHomeJoinClasses(
        giHomeClasses.eyebrow,
        align === "center" && giHomeClasses.eyebrowCenter,
        className
      )}
    >
      {children}
    </p>
  );
}
