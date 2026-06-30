const HTML_TAG = /<[a-z][\s\S]*>/i;

type Props = {
  text: string;
  className?: string;
  as?: "p" | "div" | "li";
};

const BODY_CLASS =
  "font-body text-[15px] leading-[1.65] text-[rgba(232,236,241,0.82)] [&_strong]:font-semibold [&_strong]:text-[#E8ECF1] [&_a]:text-[#60A5FA] [&_a]:underline [&_a]:underline-offset-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1.5";

export function isPdpRichHtml(text: string): boolean {
  return HTML_TAG.test(text);
}

export default function PdpRichText({
  text,
  className = "",
  as = "p",
}: Props) {
  const Tag = as;

  if (isPdpRichHtml(text)) {
    return (
      <div
        className={`${BODY_CLASS} ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  return <Tag className={`${BODY_CLASS} ${className}`.trim()}>{text}</Tag>;
}
