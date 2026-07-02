import HomeContainer from "@/components/good-ideas/home/HomeContainer";
import { giHomeClasses, giHomeJoinClasses } from "@/lib/ui/gi-home";

type Props = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  /** `default`: borde superior · `flush`: sin borde · `surface`: fondo #151B24 */
  variant?: "default" | "flush" | "surface";
  /** Glow radial azul sutil en la parte superior de la sección. */
  withGlow?: boolean;
  "aria-label"?: string;
};

/**
 * Wrapper de sección para la landing home — spacing, borde y superficie unificados.
 */
export default function HomeSection({
  children,
  id,
  className,
  containerClassName,
  variant = "default",
  withGlow = false,
  "aria-label": ariaLabel,
}: Props) {
  const sectionClass =
    variant === "flush"
      ? giHomeClasses.sectionFlush
      : variant === "surface"
        ? giHomeJoinClasses(giHomeClasses.section, giHomeClasses.sectionSurface)
        : giHomeClasses.section;

  return (
    <section
      id={id}
      className={giHomeJoinClasses("relative isolate", sectionClass, className)}
      aria-label={ariaLabel}
    >
      {withGlow ? (
        <div
          className={`pointer-events-none absolute inset-0 ${giHomeClasses.sectionGlow}`}
          aria-hidden
        />
      ) : null}
      <HomeContainer className="relative z-[1]" innerClassName={containerClassName}>
        {children}
      </HomeContainer>
    </section>
  );
}
