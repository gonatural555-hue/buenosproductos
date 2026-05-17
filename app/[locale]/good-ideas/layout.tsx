import GoodIdeasBrandLayout from "@/components/good-ideas/GoodIdeasBrandLayout";

export default function GoodIdeasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GoodIdeasBrandLayout>{children}</GoodIdeasBrandLayout>;
}
