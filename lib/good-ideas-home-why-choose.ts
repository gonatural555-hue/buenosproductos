export type GoodIdeasWhyChooseItemId =
  | "quality"
  | "innovation"
  | "pricing"
  | "returns";

export type GoodIdeasWhyChooseItem = {
  id: GoodIdeasWhyChooseItemId;
  title: string;
  description: string;
};

type WhyChooseLabels = {
  qualityTitle: string;
  qualityDesc: string;
  innovationTitle: string;
  innovationDesc: string;
  pricingTitle: string;
  pricingDesc: string;
  returnsTitle: string;
  returnsDesc: string;
};

export function buildGoodIdeasHomeWhyChooseItems(
  labels: WhyChooseLabels
): GoodIdeasWhyChooseItem[] {
  return [
    {
      id: "quality",
      title: labels.qualityTitle,
      description: labels.qualityDesc,
    },
    {
      id: "innovation",
      title: labels.innovationTitle,
      description: labels.innovationDesc,
    },
    {
      id: "pricing",
      title: labels.pricingTitle,
      description: labels.pricingDesc,
    },
    {
      id: "returns",
      title: labels.returnsTitle,
      description: labels.returnsDesc,
    },
  ];
}
