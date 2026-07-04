import Link from "next/link";
import { giHomeClasses, giHomeJoinClasses, giHomeLightClasses } from "@/lib/ui/gi-home";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  /** `outline` sobre oscuro · `light` pill claro · `onLight` contorno sobre blanco. */
  variant?: "outline" | "light" | "onLight";
};

type LinkProps = BaseProps & {
  href: string;
  ariaLabel?: string;
};

type NativeButtonProps = BaseProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

type Props = LinkProps | NativeButtonProps;

export default function SecondaryButton(props: Props) {
  const { children, className, variant = "outline", ariaLabel } = props;
  const base =
    variant === "light"
      ? giHomeClasses.secondaryButtonLight
      : variant === "onLight"
        ? giHomeLightClasses.secondaryButtonOnLight
        : giHomeClasses.secondaryButton;
  const classes = giHomeJoinClasses(base, className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  const { type = "button", onClick, disabled } = props as NativeButtonProps;
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
