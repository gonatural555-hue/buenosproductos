import type { GoodIdeasTrustBarItem } from "@/components/good-ideas/home/GoodIdeasTrustBarIcons";

type TrustBarLabels = {
  shippingTitle: string;
  shippingDesc: string;
  secureTitle: string;
  secureDesc: string;
  innovativeTitle: string;
  innovativeDesc: string;
  supportTitle: string;
  supportDesc: string;
};

export function buildGoodIdeasHomeTrustBarItems(
  labels: TrustBarLabels
): GoodIdeasTrustBarItem[] {
  return [
    {
      id: "shipping",
      title: labels.shippingTitle,
      description: labels.shippingDesc,
    },
    {
      id: "secure",
      title: labels.secureTitle,
      description: labels.secureDesc,
    },
    {
      id: "innovative",
      title: labels.innovativeTitle,
      description: labels.innovativeDesc,
    },
    {
      id: "support",
      title: labels.supportTitle,
      description: labels.supportDesc,
    },
  ];
}
