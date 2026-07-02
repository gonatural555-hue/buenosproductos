import { giHomeClasses, giHomeJoinClasses } from "@/lib/ui/gi-home";

type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function DarkCard({ children, className, hover = false }: Props) {
  return (
    <div
      className={giHomeJoinClasses(
        giHomeClasses.darkCard,
        hover && giHomeClasses.darkCardHover,
        className
      )}
    >
      {children}
    </div>
  );
}
