type Props = {
  children: React.ReactNode;
  "aria-label"?: string;
};

export default function PdpDetailsSection({ children, "aria-label": ariaLabel }: Props) {
  return (
    <section aria-label={ariaLabel} className="py-14 md:py-16">
      {children}
    </section>
  );
}
