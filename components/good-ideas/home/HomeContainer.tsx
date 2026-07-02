import { GI_HOME_INNER, GI_HOME_OUTER, giHomeJoinClasses } from "@/lib/ui/gi-home";

type Props = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  /** Si false, solo aplica el contenedor interior (sin padding lateral del outer). */
  withOuter?: boolean;
};

/**
 * Contenedor editorial de secciones home — max 1200px + padding responsive.
 */
export default function HomeContainer({
  children,
  className,
  innerClassName,
  withOuter = true,
}: Props) {
  if (!withOuter) {
    return (
      <div className={giHomeJoinClasses(GI_HOME_INNER, className, innerClassName)}>
        {children}
      </div>
    );
  }

  return (
    <div className={giHomeJoinClasses(GI_HOME_OUTER, className)}>
      <div className={giHomeJoinClasses(GI_HOME_INNER, innerClassName)}>{children}</div>
    </div>
  );
}
