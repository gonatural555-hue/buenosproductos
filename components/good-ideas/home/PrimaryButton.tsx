import Link from "next/link";
import { giHomeClasses, giHomeJoinClasses } from "@/lib/ui/gi-home";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
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

export default function PrimaryButton(props: Props) {
  const { children, className, fullWidth, ariaLabel } = props;
  const classes = giHomeJoinClasses(
    giHomeClasses.primaryButton,
    fullWidth && "w-full max-w-none",
    className
  );

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
