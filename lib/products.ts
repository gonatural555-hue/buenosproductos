export type ProductVariantOption = {
  label: string;
  value?: string;
  priceModifier?: number;
};

export type ProductVariants = {
  type: string;
  label: string;
  default?: string;
  options: ProductVariantOption[];
};

import type { Locale } from "@/lib/i18n/config";

export type ProductTranslation = {
  title?: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string[];
  features?: string[];
  seo?: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
  };
};

export type Product = {
  id: string;
  slug?: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  shortDescription?: string;
  longDescription?: string[];
  features?: string[];
  freeShipping?: boolean;
  /** Overrides PDP trust copy (desktop). If omitted, site i18n defaults are used. */
  pdpTrust?: {
    shippingEurope?: string;
    shippingLatam?: string;
    returns?: string;
  };
  translations?: Partial<Record<Locale, ProductTranslation>>;
  variants?: ProductVariants | ProductVariants[];
};

const PRODUCTS: Product[] = [
  // ===== FISHING PRODUCTS =====
  {
    id: "gn-fishing-001",
    title: "Caña de Pescar Telescópica de Carbono Ultraligera",
    price: 22.90,
    category: "Fishing",
    images: [
          "/assets/images/products/gn-fishing-001/image.webp"
    ],
    description:
      "Varilla telescópica ultraligera para spinning y casting, fabricada en fibra de carbono de alta resistencia. Diseñada para pescadores que buscan sensibilidad, potencia y portabilidad en un solo equipo.",
    features: [
      "Fibra de carbono potente, sensible y ligera",
      "Asiento de carrete reforzado y antideslizante",
      "Anillas guía de cerámica de alta calidad",
      "Diseño telescópico compacto y portátil",
      "Incluye bolsa individual de transporte",
    ],
    translations: {
      en: {
        title: "Ultralight Carbon Telescopic Fishing Rod",
        description:
          "Ultralight telescopic rod for spinning and casting, made from high-strength carbon fiber. Designed for anglers who want sensitivity, power, and portability in one setup.",
        features: [
          "Powerful, sensitive, and lightweight carbon fiber",
          "Reinforced non-slip reel seat",
          "High-quality ceramic guide rings",
          "Compact, portable telescopic design",
          "Includes individual carry bag",
        ],
      },
      fr: {
        title: "Canne à pêche télescopique en carbone ultralégère",
        description:
          "Canne télescopique ultralégère pour le spinning et le casting, fabriquée en fibre de carbone haute résistance. Pensée pour les pêcheurs qui recherchent sensibilité, puissance et portabilité dans un seul ensemble.",
        features: [
          "Fibre de carbone puissante, sensible et légère",
          "Porte-moulinet renforcé antidérapant",
          "Anneaux de guidage en céramique de haute qualité",
          "Design télescopique compact et portable",
          "Housse de transport individuelle incluse",
        ],
      },
      it: {
        title: "Canna da pesca telescopica in carbonio ultraleggera",
        description:
          "Canna telescopica ultraleggera per spinning e casting, realizzata in fibra di carbonio ad alta resistenza. Pensata per chi cerca sensibilità, potenza e portabilità in un unico attrezzo.",
        features: [
          "Fibra di carbonio potente, sensibile e leggera",
          "Porta-mulinello rinforzato antiscivolo",
          "Anelli guida in ceramica di alta qualità",
          "Design telescopico compatto e portatile",
          "Borsa di trasporto individuale inclusa",
        ],
      },
    },
  },
  {
    id: "gn-fishing-004",
    title: "Caña UL/L para Trucha en Carbono Sólido",
    price: 34.99,
    category: "Fishing",
    images: [
        "/assets/images/products/gn-fishing-004/casting/featured.webp"
    ],
    description:
      "Caña ultraligera diseñada específicamente para pesca de trucha, con máxima sensibilidad para técnicas finesse y señuelos pequeños.",
    features: [
      "Blank de carbono sólido de alta sensibilidad",
      "Punta UL/L flexible y precisa",
      "Peso ultraliviano y equilibrado",
      "Anillas SIC resistentes",
      "Acabados premium",
    ],
    translations: {
      en: {
        title: "UL/L Solid Carbon Trout Rod",
        description:
          "Ultralight rod designed for trout fishing, with maximum sensitivity for finesse techniques and small lures.",
        features: [
          "High-sensitivity solid carbon blank",
          "Flexible, precise UL/L tip",
          "Ultralight, balanced feel",
          "Durable SIC guide rings",
          "Premium finishes",
        ],
      },
      es: {
        title: "Caña UL/L para Trucha en Carbono Sólido",
        description:
          "Caña ultraligera diseñada específicamente para pesca de trucha, con máxima sensibilidad para técnicas finesse y señuelos pequeños.",
        features: [
          "Blank de carbono sólido de alta sensibilidad",
          "Punta UL/L flexible y precisa",
          "Peso ultraliviano y equilibrado",
          "Anillas SIC resistentes",
          "Acabados premium",
        ],
      },
      fr: {
        title: "Canne UL/L en carbone plein pour truite",
        description:
          "Canne ultralégère conçue pour la pêche à la truite, avec une sensibilité maximale pour les techniques finesse et les petits leurres.",
        features: [
          "Blank en carbone plein très sensible",
          "Pointe UL/L flexible et précise",
          "Poids ultraléger et équilibré",
          "Anneaux SIC résistants",
          "Finitions premium",
        ],
      },
      it: {
        title: "Canna UL/L in carbonio pieno per trota",
        description:
          "Canna ultraleggera progettata per la pesca alla trota, con massima sensibilità per tecniche finesse e piccoli artificiali.",
        features: [
          "Blank in carbonio pieno ad alta sensibilità",
          "Cimino UL/L flessibile e preciso",
          "Peso ultraleggero e bilanciato",
          "Anelli SIC resistenti",
          "Finiture premium",
        ],
      },
    },
  },
  // ===== FISHING EQUIPMENT =====
  {
    id: "gn-fishing-eq-006",
    title: "Alicates de Pesca Multifunción con Cortador de Línea",
    price: 9.89,
    category: "Fishing Equipment",
    images: [
      "/assets/images/products/gn-fishing-eq-006/blue/image.webp"
    ],
    description:
      "Herramienta compacta y multifunción diseñada para cortar línea, remover anzuelos y manipular peces con seguridad. Ideal para pesca en agua dulce y salada.",
    features: [
      "Cortador de línea integrado",
      "Punta dentada para extracción profunda de anzuelos",
      "Sistema de bloqueo de seguridad",
      "Mandíbula con resorte asistido",
      "Mango ergonómico antideslizante",
    ],
    translations: {
      en: {
        title: "Multi-Function Fishing Pliers with Line Cutter",
        description:
          "Compact multi-tool for cutting line, removing hooks, and handling fish safely. Ideal for fresh and saltwater fishing.",
        features: [
          "Integrated line cutter",
          "Serrated tip for deep hook removal",
          "Safety lock system",
          "Spring-assisted jaw",
          "Non-slip ergonomic grip",
        ],
      },
      es: {
        title: "Alicates de Pesca Multifunción con Cortador de Línea",
        description:
          "Herramienta compacta y multifunción diseñada para cortar línea, remover anzuelos y manipular peces con seguridad. Ideal para pesca en agua dulce y salada.",
        features: [
          "Cortador de línea integrado",
          "Punta dentada para extracción profunda de anzuelos",
          "Sistema de bloqueo de seguridad",
          "Mandíbula con resorte asistido",
          "Mango ergonómico antideslizante",
        ],
      },
      fr: {
        title: "Pince de pêche multifonction avec coupe-fil",
        description:
          "Outil compact et multifonction pour couper la ligne, retirer les hameçons et manipuler le poisson en sécurité. Idéal en eau douce et salée.",
        features: [
          "Coupe-fil intégré",
          "Pointe dentée pour extraction d’hameçons profonds",
          "Système de verrouillage de sécurité",
          "Mâchoire à ressort assisté",
          "Poignée ergonomique antidérapante",
        ],
      },
      it: {
        title: "Pinza da pesca multifunzione con tagliafilo",
        description:
          "Strumento compatto e multifunzione per tagliare la lenza, rimuovere ami e maneggiare il pesce in sicurezza. Ideale per acqua dolce e salata.",
        features: [
          "Tagliafilo integrato",
          "Punta dentellata per estrazione profonda degli ami",
          "Sistema di blocco di sicurezza",
          "Morsa con molla assistita",
          "Impugnatura ergonomica antiscivolo",
        ],
      },
    },
  },
  {
    id: "gn-fishing-eq-007",
    title: "BEARKING BKT Carrete Giratorio Spinning",
    price: 40.00,
    category: "Fishing Equipment",
    images: [
      "/assets/images/products/gn-fishing-eq-007/2000/featured.webp"
    ],
    description:
      "Carrete giratorio robusto y potente, diseñado para spinning en agua dulce y salada. Destaca por su suavidad, durabilidad y gran capacidad de arrastre.",
    features: [
      "Arrastre máximo hasta 18 kg",
      "11 rodamientos de acero inoxidable",
      "Relación de transmisión 5.2:1",
      "Cuerpo metálico resistente al agua",
      "Bobina de aluminio mecanizado",
    ],
    translations: {
      en: {
        title: "BEARKING BKT Spinning Reel",
        description:
          "Robust spinning reel designed for freshwater and saltwater fishing. Smooth, durable, and with strong drag capacity.",
        features: [
          "Max drag up to 18 kg",
          "11 stainless steel bearings",
          "5.2:1 gear ratio",
          "Water-resistant metal body",
          "Machined aluminum spool",
        ],
      },
      es: {
        title: "BEARKING BKT Carrete Giratorio Spinning",
        description:
          "Carrete giratorio robusto y potente, diseñado para spinning en agua dulce y salada. Destaca por su suavidad, durabilidad y gran capacidad de arrastre.",
        features: [
          "Arrastre máximo hasta 18 kg",
          "11 rodamientos de acero inoxidable",
          "Relación de transmisión 5.2:1",
          "Cuerpo metálico resistente al agua",
          "Bobina de aluminio mecanizado",
        ],
      },
      fr: {
        title: "Moulinet spinning BEARKING BKT",
        description:
          "Moulinet robuste conçu pour la pêche en eau douce et salée. Fluide, durable et avec une forte capacité de frein.",
        features: [
          "Frein max jusqu’à 18 kg",
          "11 roulements en acier inoxydable",
          "Rapport de transmission 5,2:1",
          "Corps métallique résistant à l’eau",
          "Bobine en aluminium usiné",
        ],
      },
      it: {
        title: "Mulinello spinning BEARKING BKT",
        description:
          "Mulinello robusto per pesca in acqua dolce e salata. Scorrevole, durevole e con alta capacità di frizione.",
        features: [
          "Freno massimo fino a 18 kg",
          "11 cuscinetti in acciaio inox",
          "Rapporto di trasmissione 5,2:1",
          "Corpo metallico resistente all’acqua",
          "Bobina in alluminio lavorato",
        ],
      },
    },
    variants: {
      type: "series",
      label: "Capacidad del Carrete",
      default: "1000",
      options: [
        { value: "1000", label: "Serie 1000", priceModifier: 0 },
        { value: "2000", label: "Serie 2000", priceModifier: 2 },
        { value: "3000", label: "Serie 3000", priceModifier: 4 },
        { value: "4000", label: "Serie 4000", priceModifier: 6 },
        { value: "5000", label: "Serie 5000", priceModifier: 8 },
      ],
    },
  },
  // ===== SKI & SNOWBOARD =====
  {
    id: "gn-ski-snow-001",
    title: "KAPVOE Gafas de Esquí Fotocromáticas para Outdoor",
    price: 69.90,
    category: "Ski & Snow Equipment",
    images: [
      "/assets/images/products/gn-ski-snow-001/model-1/image.webp"
    ],
    description:
      "Gafas de esquí KAPVOE con lentes fotocromáticas, protección UV400 y diseño antivaho, ideales para esquí y snowboard en condiciones de luz variables.",
    features: [
      "Lentes fotocromáticas",
      "Protección UV400",
      "Tratamiento antivaho",
      "Diseño outdoor",
    ],
    translations: {
      en: {
        title: "KAPVOE Photochromic Ski Goggles for Outdoor",
        description:
          "KAPVOE ski goggles with photochromic lenses, UV400 protection, and anti-fog design, ideal for skiing and snowboarding in changing light.",
        features: [
          "Photochromic lenses",
          "UV400 protection",
          "Anti-fog treatment",
          "Outdoor-ready design",
        ],
      },
      es: {
        title: "KAPVOE Gafas de Esquí Fotocromáticas para Outdoor",
        description:
          "Gafas de esquí KAPVOE con lentes fotocromáticas, protección UV400 y diseño antivaho, ideales para esquí y snowboard en condiciones de luz variables.",
        features: [
          "Lentes fotocromáticas",
          "Protección UV400",
          "Tratamiento antivaho",
          "Diseño outdoor",
        ],
      },
      fr: {
        title: "Masque de ski photochromique KAPVOE pour l’outdoor",
        description:
          "Masque de ski KAPVOE avec verres photochromiques, protection UV400 et traitement antibuée, idéal en conditions de lumière variables.",
        features: [
          "Verres photochromiques",
          "Protection UV400",
          "Traitement antibuée",
          "Design outdoor",
        ],
      },
      it: {
        title: "Maschera da sci fotocromatica KAPVOE per outdoor",
        description:
          "Maschera da sci KAPVOE con lenti fotocromatiche, protezione UV400 e trattamento antiappannamento, ideale con luce variabile.",
        features: [
          "Lenti fotocromatiche",
          "Protezione UV400",
          "Trattamento antiappannamento",
          "Design outdoor",
        ],
      },
    },
    variants: {
      type: "model",
      label: "Modelo",
      default: "model-1",
      options: [
        { value: "model-1", label: "Modelo 1", priceModifier: 0 },
        { value: "model-2", label: "Modelo 2", priceModifier: 0 },
        { value: "model-3", label: "Modelo 3", priceModifier: 0 },
        { value: "model-4", label: "Modelo 4", priceModifier: 0 },
        { value: "model-5", label: "Modelo 5", priceModifier: 0 },
        { value: "model-6", label: "Modelo 6", priceModifier: 0 },
        { value: "model-7", label: "Modelo 7", priceModifier: 0 },
      ],
    },
  },
  {
    id: "gn-ski-snow-002",
    title: "Parka Militar con Capucha para Hombre – Outdoor & Nieve",
    price: 59.99,
    category: "Ski & Snow Equipment",
    images: [
          "/assets/images/products/gn-ski-snow-002/caqui/image.webp"
    ],
    description:
      "Parka técnica de estilo militar con capucha, diseñada para clima frío, nieve y actividades outdoor. Resistente al viento, térmica y robusta.",
    features: [
      "Abrigo térmico",
      "Capucha integrada",
      "Windproof",
      "Snow ready",
    ],
    translations: {
      en: {
        title: "Military Hooded Parka for Men — Outdoor & Snow",
        description:
          "Military-style technical parka with hood, designed for cold weather, snow, and outdoor use. Wind-resistant, warm, and durable.",
        features: [
          "Thermal insulation",
          "Integrated hood",
          "Windproof",
          "Snow ready",
        ],
      },
      es: {
        title: "Parka Militar con Capucha para Hombre – Outdoor & Nieve",
        description:
          "Parka técnica de estilo militar con capucha, diseñada para clima frío, nieve y actividades outdoor. Resistente al viento, térmica y robusta.",
        features: [
          "Abrigo térmico",
          "Capucha integrada",
          "Windproof",
          "Snow ready",
        ],
      },
      fr: {
        title: "Parka militaire à capuche pour homme — Outdoor & neige",
        description:
          "Parka technique style militaire avec capuche, conçue pour le froid, la neige et l’outdoor. Coupe-vent, chaude et robuste.",
        features: [
          "Isolation thermique",
          "Capuche intégrée",
          "Coupe-vent",
          "Prête pour la neige",
        ],
      },
      it: {
        title: "Parka militare con cappuccio da uomo — Outdoor & neve",
        description:
          "Parka tecnica stile militare con cappuccio, pensata per freddo, neve e uso outdoor. Antivento, calda e robusta.",
        features: [
          "Isolamento termico",
          "Cappuccio integrato",
          "Antivento",
          "Pronta per la neve",
        ],
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "negro",
        options: [
          { value: "negro", label: "Negro" },
          { value: "sapphire", label: "Sapphire" },
          { value: "verde-militar", label: "Verde Militar" },
          { value: "rojo", label: "Rojo" },
          { value: "caqui", label: "Caqui" },
        ],
      },
      {
        type: "size",
        label: "Talle",
        default: "eu-s",
        options: [
          { value: "eu-s", label: "EU S", priceModifier: 0 },
          { value: "eu-m", label: "EU M", priceModifier: 5 },
          { value: "eu-l", label: "EU L", priceModifier: 10 },
          { value: "eu-xl", label: "EU XL", priceModifier: 15 },
          { value: "eu-xxl", label: "EU XXL", priceModifier: 20 },
          { value: "eu-3xl", label: "EU 3XL", priceModifier: 25 },
          { value: "eu-4xl", label: "EU 4XL", priceModifier: 30 },
        ],
      },
    ],
  },
  {
    id: "gn-ski-snow-003",
    title: "JNLN Chaqueta de lana impermeable Unisex térmica cortaviento",
    price: 55.59,
    category: "Ski & Snow / Outdoor Apparel",
    images: [
        "/assets/images/products/gn-ski-snow-003/amarillo/image.webp"
    ],
    description:
      "Chaqueta térmica impermeable y cortaviento, pensada para uso outdoor y clima frío con protección real contra nieve y viento.",
    features: [
      "Abrigo térmico",
      "Capucha integrada",
      "Windproof",
      "Snow ready",
    ],
    translations: {
      en: {
        title: "JNLN Waterproof Wool Jacket — Unisex Thermal Windproof",
        description:
          "Thermal waterproof and windproof jacket for outdoor use and cold weather, with real protection against snow and wind.",
        features: [
          "Thermal insulation",
          "Integrated hood",
          "Windproof",
          "Snow ready",
        ],
      },
      es: {
        title: "JNLN Chaqueta de lana impermeable Unisex térmica cortaviento",
        description:
          "Chaqueta térmica impermeable y cortaviento, pensada para uso outdoor y clima frío con protección real contra nieve y viento.",
        features: [
          "Abrigo térmico",
          "Capucha integrada",
          "Windproof",
          "Snow ready",
        ],
      },
      fr: {
        title: "Veste en laine imperméable JNLN — Unisexe, thermique et coupe-vent",
        description:
          "Veste thermique, imperméable et coupe-vent, pensée pour l’outdoor et le froid avec protection réelle contre neige et vent.",
        features: [
          "Isolation thermique",
          "Capuche intégrée",
          "Coupe-vent",
          "Prête pour la neige",
        ],
      },
      it: {
        title: "Giacca in lana impermeabile JNLN — Unisex termica antivento",
        description:
          "Giacca termica impermeabile e antivento, pensata per outdoor e clima freddo con protezione reale da neve e vento.",
        features: [
          "Isolamento termico",
          "Cappuccio integrato",
          "Antivento",
          "Pronta per la neve",
        ],
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "negro",
        options: [
          { value: "negro", label: "Negro" },
          { value: "verde", label: "Verde" },
          { value: "marron", label: "Marron" },
          { value: "naranja", label: "Naranja" },
          { value: "amarillo", label: "Amarillo" },
          { value: "blanco", label: "Blanco" },
          { value: "rojo", label: "Rojo" }
        ],
      },
      {
        type: "size",
        label: "Talle",
        default: "s",
        options: [
          { value: "s", label: "S", priceModifier: 0 },
          { value: "m", label: "M", priceModifier: 2 },
          { value: "l", label: "L", priceModifier: 10 },
          { value: "xl", label: "XL", priceModifier: 15 },
          { value: "xxl", label: "XXL", priceModifier: 20 },
          { value: "xxxl", label: "XXXL", priceModifier: 25 },
        ],
      },
    ],
  },
  {
    id: "gn-ski-snow-004",
    title: "Chaqueta de lana de invierno térmica con capucha",
    price: 40.90,
    category: "Ski & Snow / Outdoor Apparel",
    images: [
        "/assets/images/products/gn-ski-snow-004/caqui/image.webp"
    ],
    description:
      "Chaqueta térmica de lana con capucha, diseñada para invierno, outdoor y nieve. Abrigo suave con protección contra frío y viento.",
    features: [
      "Abrigo térmico",
      "Capucha integrada",
      "Windproof",
      "Snow ready",
    ],
    translations: {
      en: {
        title: "Thermal Winter Wool Jacket with Hood",
        description:
          "Thermal wool jacket with hood, designed for winter, outdoor use, and snow. Soft warmth with protection against cold and wind.",
        features: [
          "Thermal insulation",
          "Integrated hood",
          "Windproof",
          "Snow ready",
        ],
      },
      es: {
        title: "Chaqueta de lana de invierno térmica con capucha",
        description:
          "Chaqueta térmica de lana con capucha, diseñada para invierno, outdoor y nieve. Abrigo suave con protección contra frío y viento.",
        features: [
          "Abrigo térmico",
          "Capucha integrada",
          "Windproof",
          "Snow ready",
        ],
      },
      fr: {
        title: "Veste en laine d’hiver thermique avec capuche",
        description:
          "Veste thermique en laine avec capuche, conçue pour l’hiver, l’outdoor et la neige. Chaleur douce et protection contre le froid et le vent.",
        features: [
          "Isolation thermique",
          "Capuche intégrée",
          "Coupe-vent",
          "Prête pour la neige",
        ],
      },
      it: {
        title: "Giacca in lana invernale termica con cappuccio",
        description:
          "Giacca termica in lana con cappuccio, progettata per inverno, outdoor e neve. Calore morbido con protezione da freddo e vento.",
        features: [
          "Isolamento termico",
          "Cappuccio integrato",
          "Antivento",
          "Pronta per la neve",
        ],
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "negro",
        options: [
          { value: "negro", label: "Negro" },
          { value: "gris", label: "Gris" },
          { value: "azul-cielo", label: "Azul cielo" },
          { value: "rojo", label: "Rojo" },
          { value: "caqui", label: "Caqui" },
        ],
      },
      {
        type: "size",
        label: "Talle",
        default: "s",
        options: [
          { value: "s", label: "S", priceModifier: 0 },
          { value: "m", label: "M", priceModifier: 5 },
          { value: "l", label: "L", priceModifier: 10 },
          { value: "xl", label: "XL", priceModifier: 15 },
          { value: "xxl", label: "XXL", priceModifier: 20 },
          { value: "xxxl", label: "XXXL", priceModifier: 25 },
        ],
      },
    ],
  },
  {
    id: "gn-ski-snow-005",
    title: "Chaqueta de lana de invierno",
    price: 38.90,
    category: "Ski / Snow / Outdoor",
    images: [
          "/assets/images/products/gn-ski-snow-005/verde/image.webp"
    ],
    description:
      "Chaqueta de lana térmica para invierno, pensada para outdoor y nieve con abrigo y confort.",
    features: [
      "Abrigo térmico",
      "Capucha integrada",
      "Windproof",
      "Snow ready",
    ],
    translations: {
      en: {
        title: "Winter Wool Jacket",
        description:
          "Thermal wool jacket for winter, designed for outdoor use and snow with warmth and comfort.",
        features: [
          "Thermal insulation",
          "Integrated hood",
          "Windproof",
          "Snow ready",
        ],
      },
      es: {
        title: "Chaqueta de lana de invierno",
        description:
          "Chaqueta de lana térmica para invierno, pensada para outdoor y nieve con abrigo y confort.",
        features: [
          "Abrigo térmico",
          "Capucha integrada",
          "Windproof",
          "Snow ready",
        ],
      },
      fr: {
        title: "Veste en laine d’hiver",
        description:
          "Veste thermique en laine pour l’hiver, pensée pour l’outdoor et la neige avec chaleur et confort.",
        features: [
          "Isolation thermique",
          "Capuche intégrée",
          "Coupe-vent",
          "Prête pour la neige",
        ],
      },
      it: {
        title: "Giacca in lana invernale",
        description:
          "Giacca termica in lana per l’inverno, pensata per outdoor e neve con calore e comfort.",
        features: [
          "Isolamento termico",
          "Cappuccio integrato",
          "Antivento",
          "Pronta per la neve",
        ],
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "negro",
        options: [
          { value: "negro", label: "Negro" },
          { value: "azul-cielo", label: "Azul cielo" },
          { value: "verde", label: "Verde" },
          { value: "caqui", label: "Caqui" },
        ],
      },
      {
        type: "size",
        label: "Talle",
        default: "s",
        options: [
          { value: "s", label: "S", priceModifier: 0 },
          { value: "m", label: "M", priceModifier: 0 },
          { value: "l", label: "L", priceModifier: 0 },
          { value: "xl", label: "XL", priceModifier: 0 },
          { value: "xxl", label: "XXL", priceModifier: 0 },
        ],
      },
    ],
  },
  // ===== CYCLING =====
  {
    id: "gn-cycling-010",
    title: "Kapvoe UV400 gafas de sol para ciclismo MTB",
    price: 39.90,
    category: "Cycling Equipment",
    images: [
      "/assets/images/products/gn-cycling-010/model-01/image.webp",
    ],
    description:
      "Gafas deportivas UV400 para ciclismo MTB y ruta, lentes TR90 ultraligeros, ideales para outdoor, senderismo y ciclismo de carretera.",
    features: [
      "Protección UV400",
      "Montura TR90 ultraligera",
      "Uso outdoor y ciclismo",
    ],
    translations: {
      en: {
        title: "Kapvoe UV400 Cycling Sunglasses for MTB",
        description:
          "UV400 sports glasses for MTB and road cycling with ultralight TR90 frame, ideal for outdoor and road use.",
        features: [
          "UV400 protection",
          "Ultralight TR90 frame",
          "Outdoor and cycling use",
        ],
      },
      es: {
        title: "Kapvoe UV400 gafas de sol para ciclismo MTB",
        description:
          "Gafas deportivas UV400 para ciclismo MTB y ruta, lentes TR90 ultraligeros, ideales para outdoor, senderismo y ciclismo de carretera.",
        features: [
          "Protección UV400",
          "Montura TR90 ultraligera",
          "Uso outdoor y ciclismo",
        ],
      },
      fr: {
        title: "Lunettes de soleil Kapvoe UV400 pour VTT",
        description:
          "Lunettes sport UV400 pour VTT et route avec monture TR90 ultralégère, idéales pour l’outdoor et le cyclisme.",
        features: [
          "Protection UV400",
          "Monture TR90 ultralégère",
          "Usage outdoor et cyclisme",
        ],
      },
      it: {
        title: "Occhiali da sole Kapvoe UV400 per MTB",
        description:
          "Occhiali sportivi UV400 per MTB e strada con montatura TR90 ultraleggera, ideali per outdoor e ciclismo.",
        features: [
          "Protezione UV400",
          "Montatura TR90 ultraleggera",
          "Uso outdoor e ciclismo",
        ],
      },
    },
    variants: {
      type: "model",
      label: "Modelo",
      default: "model-01",
      options: [
        { value: "model-01", label: "Modelo 1", priceModifier: 0 },
        { value: "model-02", label: "Modelo 2", priceModifier: 0 },
        { value: "model-03", label: "Modelo 3", priceModifier: 0 },
        { value: "model-04", label: "Modelo 4", priceModifier: 0 },
        { value: "model-05", label: "Modelo 5", priceModifier: 0 },
        { value: "model-06", label: "Modelo 6", priceModifier: 0 },
        { value: "model-07", label: "Modelo 7", priceModifier: 0 },
        { value: "model-08", label: "Modelo 8", priceModifier: 0 },
        { value: "model-09", label: "Modelo 9", priceModifier: 0 },
        { value: "model-10", label: "Modelo 10", priceModifier: 0 },
        { value: "model-11", label: "Modelo 11", priceModifier: 0 },
        { value: "model-12", label: "Modelo 12", priceModifier: 0 },
      ],
    },
  },
  {
    id: "gn-cycling-011",
    title: "Kapvoe gafas de sol fotocromáticas para ciclismo (UV400)",
    price: 49.90,
    category: "Cycling Equipment",
    images: [
      "/assets/images/products/gn-cycling-011/model-01/image.webp"
    ],
    description:
      "Gafas de sol fotocromáticas UV400 para ciclismo, con ajuste cómodo y lentes adaptativas para uso outdoor.",
    features: [
      "Lente fotocromática",
      "Protección UV400",
      "Montura ligera",
    ],
    translations: {
      en: {
        title: "Kapvoe Photochromic Cycling Sunglasses (UV400)",
        description:
          "UV400 photochromic sunglasses for cycling with comfortable fit and adaptive lenses for outdoor use.",
        features: [
          "Photochromic lens",
          "UV400 protection",
          "Lightweight frame",
        ],
      },
      es: {
        title: "Kapvoe gafas de sol fotocromáticas para ciclismo (UV400)",
        description:
          "Gafas de sol fotocromáticas UV400 para ciclismo, con ajuste cómodo y lentes adaptativas para uso outdoor.",
        features: [
          "Lente fotocromática",
          "Protección UV400",
          "Montura ligera",
        ],
      },
      fr: {
        title: "Lunettes de soleil photochromiques Kapvoe pour cyclisme (UV400)",
        description:
          "Lunettes photochromiques UV400 pour le cyclisme, avec ajustement confortable et verres adaptatifs.",
        features: [
          "Verre photochromique",
          "Protection UV400",
          "Monture légère",
        ],
      },
      it: {
        title: "Occhiali da sole fotocromatici Kapvoe per ciclismo (UV400)",
        description:
          "Occhiali fotocromatici UV400 per ciclismo con vestibilità comoda e lenti adattive per uso outdoor.",
        features: [
          "Lente fotocromatica",
          "Protezione UV400",
          "Montatura leggera",
        ],
      },
    },
    variants: {
      type: "model",
      label: "Modelo",
      default: "model-01",
      options: [
        { value: "model-01", label: "Modelo 1", priceModifier: 0 },
        { value: "model-02", label: "Modelo 2", priceModifier: 0 },
        { value: "model-03", label: "Modelo 3", priceModifier: 0 },
        { value: "model-04", label: "Modelo 4", priceModifier: 0 },
        { value: "model-05", label: "Modelo 5", priceModifier: 0 },
        { value: "model-06", label: "Modelo 6", priceModifier: 0 },
        { value: "model-07", label: "Modelo 7", priceModifier: 0 },
        { value: "model-08", label: "Modelo 8", priceModifier: 0 }
      ],
    },
  },
  {
    id: "gn-cycling-012",
    title: "ROCKBROS Mascarilla Facial Térmica de Invierno",
    price: 6.55,
    category: "Cycling Equipment",
    images: [
      "/assets/images/products/gn-cycling-012/image.webp",
    ],
    description:
      "Mascarilla facial térmica para invierno, uso outdoor y ciclismo con protección contra frío y viento.",
    features: [
      "Protección contra frío",
      "Talla única",
      "Uso outdoor",
    ],
    translations: {
      en: {
        title: "ROCKBROS Winter Thermal Face Mask",
        description:
          "Thermal winter face mask for outdoor and cycling use with protection against cold and wind.",
        features: [
          "Cold protection",
          "One size",
          "Outdoor use",
        ],
      },
      es: {
        title: "ROCKBROS Mascarilla Facial Térmica de Invierno",
        description:
          "Mascarilla facial térmica para invierno, uso outdoor y ciclismo con protección contra frío y viento.",
        features: [
          "Protección contra frío",
          "Talla única",
          "Uso outdoor",
        ],
      },
      fr: {
        title: "Masque facial thermique d’hiver ROCKBROS",
        description:
          "Masque thermique pour l’hiver, usage outdoor et cyclisme avec protection contre le froid et le vent.",
        features: [
          "Protection contre le froid",
          "Taille unique",
          "Usage outdoor",
        ],
      },
      it: {
        title: "Maschera facciale termica invernale ROCKBROS",
        description:
          "Maschera termica invernale per outdoor e ciclismo con protezione da freddo e vento.",
        features: [
          "Protezione dal freddo",
          "Taglia unica",
          "Uso outdoor",
        ],
      },
    },
  },
  {
    id: "gn-cycling-013",
    title: "ROCKBROS Máscara Polar Térmica para Ciclismo",
    price: 7.99,
    category: "Cycling Equipment",
    images: [
      "/assets/images/products/gn-cycling-013/image.webp",
    ],
    description:
      "Máscara polar térmica para ciclismo y outdoor, talla única, color negro (YDWB001).",
    features: [
      "Talla única",
      "Color negro",
      "Uso ciclismo / outdoor",
    ],
    translations: {
      en: {
        title: "ROCKBROS Thermal Fleece Cycling Mask",
        description:
          "Thermal fleece mask for cycling and outdoor use, one size, black color (YDWB001).",
        features: [
          "One size",
          "Black color",
          "Cycling / outdoor use",
        ],
      },
      es: {
        title: "ROCKBROS Máscara Polar Térmica para Ciclismo",
        description:
          "Máscara polar térmica para ciclismo y outdoor, talla única, color negro (YDWB001).",
        features: [
          "Talla única",
          "Color negro",
          "Uso ciclismo / outdoor",
        ],
      },
      fr: {
        title: "Masque polaire thermique ROCKBROS pour cyclisme",
        description:
          "Masque polaire thermique pour le cyclisme et l’outdoor, taille unique, coloris noir (YDWB001).",
        features: [
          "Taille unique",
          "Couleur noire",
          "Usage cyclisme / outdoor",
        ],
      },
      it: {
        title: "Maschera termica in pile ROCKBROS per ciclismo",
        description:
          "Maschera termica in pile per ciclismo e outdoor, taglia unica, colore nero (YDWB001).",
        features: [
          "Taglia unica",
          "Colore nero",
          "Uso ciclismo / outdoor",
        ],
      },
    },
  },
  {
    id: "gn-cycling-014",
    title: "ROCKBROS Guantes de Ciclismo Medio Dedo Antideslizantes",
    price: 10.99,
    category: "Cycling Equipment",
    images: [
      "/assets/images/products/gn-cycling-014/rojo/image.webp",
    ],
    description:
      "Guantes de ciclismo medio dedo para verano, antideslizantes, ideales para MTB y ruta.",
    features: [
      "Medio dedo",
      "Antideslizantes",
      "Uso MTB / ruta",
    ],
    translations: {
      en: {
        title: "ROCKBROS Half-Finger Anti-Slip Cycling Gloves",
        description:
          "Half-finger cycling gloves for summer, anti-slip, ideal for MTB and road rides.",
        features: [
          "Half-finger design",
          "Anti-slip grip",
          "MTB / road use",
        ],
      },
      es: {
        title: "ROCKBROS Guantes de Ciclismo Medio Dedo Antideslizantes",
        description:
          "Guantes de ciclismo medio dedo para verano, antideslizantes, ideales para MTB y ruta.",
        features: [
          "Medio dedo",
          "Antideslizantes",
          "Uso MTB / ruta",
        ],
      },
      fr: {
        title: "Gants de cyclisme ROCKBROS mi-doigts antidérapants",
        description:
          "Gants mi-doigts pour l’été, antidérapants, idéaux pour VTT et route.",
        features: [
          "Mi-doigts",
          "Antidérapants",
          "Usage VTT / route",
        ],
      },
      it: {
        title: "Guanti da ciclismo ROCKBROS a mezzo dito antiscivolo",
        description:
          "Guanti da ciclismo a mezzo dito per l’estate, antiscivolo, ideali per MTB e strada.",
        features: [
          "Mezzo dito",
          "Antiscivolo",
          "Uso MTB / strada",
        ],
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "negro",
        options: [
          { value: "rojo", label: "Rojo" },
          { value: "negro", label: "Negro" },
          { value: "azul", label: "Azul" },
          { value: "celeste", label: "Celeste" },
        ],
      },
      {
        type: "size",
        label: "Talle",
        default: "s",
        options: [
          { value: "s", label: "S", priceModifier: 0 },
          { value: "m", label: "M", priceModifier: 0 },
          { value: "l", label: "L", priceModifier: 0 },
          { value: "xl", label: "XL", priceModifier: 0 },
          { value: "xxl", label: "XXL", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-cycling-015",
    title: "Luz Trasera de Bicicleta ROCKBROS USB – IPX6 / IPX7",
    price: 14.99,
    category: "Cycling",
    images: [
          "/assets/images/products/gn-cycling-015/image.webp",
    ],
    description:
      "Luz trasera compacta e impermeable para ciclismo nocturno y lluvia.",
    features: [
      "Alta visibilidad",
      "Varios modos de iluminación",
      "Resistente al agua",
      "Compacta",
      "Recargable USB",
    ],
    translations: {
      en: {
        title: "ROCKBROS USB Bike Rear Light — IPX6 / IPX7",
        description:
          "Compact waterproof rear light for night cycling and rainy conditions.",
        features: [
          "High visibility",
          "Multiple light modes",
          "Water resistant",
          "Compact",
          "USB rechargeable",
        ],
      },
      es: {
        title: "Luz Trasera de Bicicleta ROCKBROS USB – IPX6 / IPX7",
        description:
          "Luz trasera compacta e impermeable para ciclismo nocturno y lluvia.",
        features: [
          "Alta visibilidad",
          "Varios modos de iluminación",
          "Resistente al agua",
          "Compacta",
          "Recargable USB",
        ],
      },
      fr: {
        title: "Feu arrière vélo ROCKBROS USB — IPX6 / IPX7",
        description:
          "Feu arrière compact et étanche pour le cyclisme de nuit et la pluie.",
        features: [
          "Haute visibilité",
          "Plusieurs modes d’éclairage",
          "Résistant à l’eau",
          "Compact",
          "Rechargeable USB",
        ],
      },
      it: {
        title: "Luce posteriore bici ROCKBROS USB — IPX6 / IPX7",
        description:
          "Luce posteriore compatta e impermeabile per ciclismo notturno e pioggia.",
        features: [
          "Alta visibilità",
          "Modalità di illuminazione multiple",
          "Resistente all’acqua",
          "Compatta",
          "Ricaricabile USB",
        ],
      },
    },
  },
  {
    id: "gn-cycling-016",
    title: "Luz Trasera ROCKBROS con Sensor de Freno Inteligente (USB-C)",
    price: 16.99,
    category: "Cycling",
    images: [
          "/assets/images/products/gn-cycling-016/image.webp",
    ],
    description:
      "Luz trasera inteligente con sensor de frenado automático para máxima seguridad.",
    features: [
      "Sensor de frenado automático",
      "Incremento de intensidad al frenar",
      "Cuerpo de aluminio",
      "Impermeable",
      "Recarga USB-C",
    ],
    translations: {
      en: {
        title: "ROCKBROS Rear Light with Smart Brake Sensor (USB-C)",
        description:
          "Smart rear light with automatic braking sensor for maximum safety.",
        features: [
          "Automatic braking sensor",
          "Boosts brightness when braking",
          "Aluminum body",
          "Waterproof",
          "USB-C recharge",
        ],
      },
      es: {
        title: "Luz Trasera ROCKBROS con Sensor de Freno Inteligente (USB-C)",
        description:
          "Luz trasera inteligente con sensor de frenado automático para máxima seguridad.",
        features: [
          "Sensor de frenado automático",
          "Incremento de intensidad al frenar",
          "Cuerpo de aluminio",
          "Impermeable",
          "Recarga USB-C",
        ],
      },
      fr: {
        title: "Feu arrière ROCKBROS avec capteur de freinage intelligent (USB-C)",
        description:
          "Feu arrière intelligent avec capteur de freinage automatique pour une sécurité maximale.",
        features: [
          "Capteur de freinage automatique",
          "Augmente l’intensité au freinage",
          "Corps en aluminium",
          "Étanche",
          "Recharge USB-C",
        ],
      },
      it: {
        title: "Luce posteriore ROCKBROS con sensore di frenata intelligente (USB-C)",
        description:
          "Luce posteriore intelligente con sensore di frenata automatico per massima sicurezza.",
        features: [
          "Sensore di frenata automatico",
          "Aumenta l’intensità in frenata",
          "Corpo in alluminio",
          "Impermeabile",
          "Ricarica USB-C",
        ],
      },
    },
  },
  {
    id: "gn-cycling-eq-001",
    title: "ROCKBROS Mini Compresor Eléctrico 150 PSI",
    price: 45.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-eq-001/image.webp"
    ],
    description:
      "Mini compresor eléctrico portátil para bicicleta con presión digital de hasta 150 PSI.",
    features: [
      "Pantalla digital LED",
      "Presión hasta 150 PSI",
      "Recargable por USB",
      "Compacto y portátil",
      "Compatible con bicicletas, motos y balones",
    ],
    translations: {
      en: {
        title: "ROCKBROS Mini Electric Compressor 150 PSI",
        description:
          "Portable electric mini compressor for bikes with digital pressure up to 150 PSI.",
        features: [
          "LED digital display",
          "Up to 150 PSI pressure",
          "USB rechargeable",
          "Compact and portable",
          "Compatible with bikes, motorcycles, and balls",
        ],
      },
      es: {
        title: "ROCKBROS Mini Compresor Eléctrico 150 PSI",
        description:
          "Mini compresor eléctrico portátil para bicicleta con presión digital de hasta 150 PSI.",
        features: [
          "Pantalla digital LED",
          "Presión hasta 150 PSI",
          "Recargable por USB",
          "Compacto y portátil",
          "Compatible con bicicletas, motos y balones",
        ],
      },
      fr: {
        title: "Mini compresseur électrique ROCKBROS 150 PSI",
        description:
          "Mini compresseur électrique portable pour vélo avec pression numérique jusqu’à 150 PSI.",
        features: [
          "Écran LED numérique",
          "Pression jusqu’à 150 PSI",
          "Rechargeable USB",
          "Compact et portable",
          "Compatible vélos, motos et ballons",
        ],
      },
      it: {
        title: "Mini compressore elettrico ROCKBROS 150 PSI",
        description:
          "Mini compressore elettrico portatile per bici con pressione digitale fino a 150 PSI.",
        features: [
          "Display LED digitale",
          "Pressione fino a 150 PSI",
          "Ricaricabile via USB",
          "Compatto e portatile",
          "Compatibile con bici, moto e palloni",
        ],
      },
    },
  },
  {
    id: "gn-cycling-eq-002",
    slug: "gn-cycling-eq-002",
    title:
      "ThinkRider — Pack de 10/20/30 cartuchos CO2 16 g (roscados, inflado rápido)",
    price: 15.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-eq-002/CO2-tubes.webp"
    ],
    shortDescription:
      "Pack de 10 cartuchos CO2 de 16 g con rosca para inflar neumáticos de bicicleta al instante. Compactos, prácticos y compatibles con infladores CO2 roscados.",
    description:
      "El pack ThinkRider de cartuchos CO2 de 16 g está pensado para ciclistas que necesitan inflar de forma rápida y eficiente en ruta o en sendero. Cada cartucho incorpora conexión roscada, compatible con infladores CO2 roscados habituales. Compactos y fáciles de llevar, este pack de 10 unidades es ideal para ciclismo de carretera, MTB, gravel y kits de emergencia ante pinchazos.",
    features: [
      "Pack de 10 cartuchos CO2 de 16 g con rosca",
      "Compatible con infladores CO2 con rosca estándar",
      "Inflado rápido para carretera, gravel y MTB",
      "Formato compacto y fácil de transportar",
      "Ideal para kits de reparación y pinchazos de emergencia",
    ],
    translations: {
      en: {
        title: "ThinkRider 16g CO2 Cartridge 10 Pack",
        shortDescription:
          "10-pack of 16g threaded CO2 cartridges for fast bicycle tire inflation. Compact, practical, and compatible with threaded CO2 inflators.",
        description:
          "ThinkRider 16g CO2 Cartridge 10 Pack is designed for cyclists who need fast and efficient tire inflation on the road or trail. Each cartridge features a threaded connection for compatibility with standard threaded CO2 inflators. Compact and easy to carry, this 10-pack is ideal for road cycling, MTB, gravel, and emergency flat repair kits.",
        features: [
          "10-pack of 16g threaded CO2 cartridges",
          "Compatible with threaded CO2 inflators",
          "Fast tire inflation for road, gravel, and MTB",
          "Compact and easy to carry",
          "Ideal for emergency flat repair kits",
        ],
        seo: {
          title: "ThinkRider 16g CO2 Cartridge 10 Pack | Go Natural",
          description:
            "Shop ThinkRider 16g threaded CO2 cartridges, 10-pack. Fast bicycle tire inflation for road, gravel, and MTB riders.",
        },
      },
      es: {
        title:
          "ThinkRider — Pack de 10 cartuchos CO2 16 g (roscados, inflado rápido)",
        shortDescription:
          "Pack de 10 cartuchos CO2 de 16 g con rosca para inflar neumáticos al instante. Compactos y compatibles con infladores CO2 roscados.",
        description:
          "El pack ThinkRider de cartuchos CO2 de 16 g está pensado para ciclistas que necesitan inflar de forma rápida y eficiente en ruta o en sendero. Cada cartucho incorpora conexión roscada, compatible con infladores CO2 roscados habituales. Compactos y fáciles de llevar, este pack de 10 unidades es ideal para ciclismo de carretera, MTB, gravel y kits de emergencia ante pinchazos.",
        features: [
          "Pack de 10 cartuchos CO2 de 16 g con rosca",
          "Compatible con infladores CO2 con rosca estándar",
          "Inflado rápido para carretera, gravel y MTB",
          "Formato compacto y fácil de transportar",
          "Ideal para kits de reparación y pinchazos de emergencia",
        ],
        seo: {
          title:
            "ThinkRider cartuchos CO2 16 g (pack 10) | Go Natural",
          description:
            "Cartuchos CO2 roscados 16 g en pack de 10. Inflado rápido para bici de carretera, gravel y MTB. ThinkRider en Go Natural.",
        },
      },
      fr: {
        title:
          "ThinkRider — Lot de 10 cartouches CO2 16 g (filetées)",
        shortDescription:
          "Lot de 10 cartouches CO2 16 g filetées pour gonfler rapidement. Compactes, compatibles avec les gonfleurs CO2 filetés.",
        description:
          "Le lot de cartouches CO2 ThinkRider 16 g s’adresse aux cyclistes qui veulent gonfler efficacement sur la route ou les sentiers. Chaque cartouche offre une connexion filetée compatible avec les gonfleurs CO2 standards. Compact et facile à transporter, ce lot de 10 convient au route, gravel, VTT et aux kits de dépannage.",
        features: [
          "Lot de 10 cartouches CO2 16 g filetées",
          "Compatible avec les gonfleurs CO2 filetés",
          "Gonflage rapide route, gravel et VTT",
          "Format compact et transport facile",
          "Idéal pour kits d’urgence crevaison",
        ],
        seo: {
          title:
            "ThinkRider cartouches CO2 16 g (lot 10) | Go Natural",
          description:
            "Cartouches CO2 filetées 16 g, lot de 10. Gonflage rapide vélo route, gravel et VTT — ThinkRider chez Go Natural.",
        },
      },
      it: {
        title:
          "ThinkRider — 10 cartucce CO2 16 g (filettate)",
        shortDescription:
          "Confezione da 10 cartucce CO2 da 16 g filettate per gonfiare in fretta. Compatte e compatibili con gonfiatori CO2 filettati.",
        description:
          "Il pack di cartucce CO2 ThinkRider da 16 g è pensato per chi vuole gonfiare in modo rapido ed efficiente su strada o su sentiero. Ogni cartuccia ha attacco filettato compatibile con i gonfiatori CO2 standard. Compatte e facili da portare, la confezione da 10 è ideale per strada, gravel, MTB e kit anti-foratura.",
        features: [
          "10 cartucce CO2 da 16 g filettate",
          "Compatibili con gonfiatori CO2 filettati",
          "Gonfiaggio rapido per strada, gravel e MTB",
          "Compatte e facili da trasportare",
          "Ideali per kit di emergenza forature",
        ],
        seo: {
          title:
            "ThinkRider cartucce CO2 16 g (pack 10) | Go Natural",
          description:
            "Cartucce CO2 filettate 16 g, pack da 10. Gonfiaggio rapido bici da strada, gravel e MTB — ThinkRider su Go Natural.",
        },
      },
    },
  },
  {
    id: "gn-cycling-eq-003",
    slug: "gn-cycling-eq-003",
    title:
      "ThinkRider — Cámara interior TPU 28 g 700C (Presta, anti-pinchazos)",
    price: 4.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-eq-003/camara-antipinchasos.webp",
    ],
    shortDescription:
      "Cámara ultraligera ~28 g en TPU de 2.ª generación, válvula Presta y compatibilidad 700×18–28C. Mayor resistencia al pinchazo y estanqueidad reforzada frente al caucho tradicional.",
    description:
      "La cámara ThinkRider en TPU de segunda generación está pensada para ciclismo de carretera en 700C: menos peso, mejor resistencia al pinchazo y tacto más predecible que muchas cámaras de caucho clásicas. La válvula Presta incorpora cuerpo en aleación de aluminio con núcleo de cobre y refuerzo de goma en la zona de unión con la cámara para reducir rozamiento y fugas. Ideal para neumáticos 700×18C, 23C, 25C y 28C (rangos ISO típicos ~18–622 a 32–622 según montaje). Elegí la longitud de válvula que mejor encaje con tu perfil de llanta (45, 65 u 85 mm) y el pack de 1 o 2 unidades según tu kit de ruta o taller.",
    features: [
      "TPU 2.ª gen.: más dureza y resistencia anti-pinchazo vs. caucho butilo habitual",
      "Peso ultraligero ~28 g (referencia de producto)",
      "700C — compatible con anchos 700×18C / 23C / 25C / 28C (ISO 18–622 … 32–622 según cubierta)",
      "Válvula Presta con boquilla en aleación y núcleo de cobre",
      "Refuerzo de goma en la base de válvula para mejor estanqueidad y menos rozamiento",
      "Opciones de válvula 45 mm, 65 mm u 85 mm",
      "Disponible en 1 o 2 unidades por pedido",
    ],
    translations: {
      en: {
        title:
          "ThinkRider — 28g TPU 700C Inner Tube (Presta, anti-puncture)",
        shortDescription:
          "Ultralight ~28g second-gen TPU tube with Presta valve for 700×18–28C road tires. Stronger puncture resistance and reliable airtight performance vs. traditional butyl.",
        description:
          "The ThinkRider second-generation TPU inner tube is built for 700C road riding: lighter weight, improved puncture resistance, and predictable feel compared with many classic butyl tubes. The Presta valve uses an aluminum alloy body with a copper core and reinforced rubber at the valve base to reduce friction and leaks. Fits common road tire widths 700×18C through 700×28C (typical ISO ranges ~18–622 to 32–622 depending on tire). Choose valve length (45, 65, or 85 mm) to match your rim depth, and pick a single tube or a 2-pack for your ride kit.",
        features: [
          "2nd-gen TPU: tougher, more puncture-resistant than typical butyl",
          "Ultralight ~28g (product reference weight)",
          "700C — fits 700×18C / 23C / 25C / 28C (ISO 18–622 … 32–622 depending on tire)",
          "Presta valve with aluminum body and copper core",
          "Rubber reinforcement at the valve base for airtightness and less friction",
          "Valve lengths 45 mm, 65 mm, or 85 mm",
          "Sold as 1 tube or 2-pack",
        ],
        seo: {
          title:
            "ThinkRider 28g TPU 700C Presta inner tube | Go Natural",
          description:
            "Shop ThinkRider ultralight TPU road tubes: 700C, Presta 45/65/85 mm, 1 or 2 pack. Anti-puncture 2nd-gen TPU at Go Natural.",
        },
      },
      es: {
        title:
          "ThinkRider — Cámara interior TPU 28 g 700C (Presta, anti-pinchazos)",
        shortDescription:
          "Cámara ultraligera ~28 g en TPU de 2.ª generación, válvula Presta y compatibilidad 700×18–28C. Mayor resistencia al pinchazo y estanqueidad reforzada frente al caucho tradicional.",
        description:
          "La cámara ThinkRider en TPU de segunda generación está pensada para ciclismo de carretera en 700C: menos peso, mejor resistencia al pinchazo y tacto más predecible que muchas cámaras de caucho clásicas. La válvula Presta incorpora cuerpo en aleación de aluminio con núcleo de cobre y refuerzo de goma en la zona de unión con la cámara para reducir rozamiento y fugas. Ideal para neumáticos 700×18C, 23C, 25C y 28C (rangos ISO típicos ~18–622 a 32–622 según montaje). Elegí la longitud de válvula que mejor encaje con tu perfil de llanta (45, 65 u 85 mm) y el pack de 1 o 2 unidades según tu kit de ruta o taller.",
        features: [
          "TPU 2.ª gen.: más dureza y resistencia anti-pinchazo vs. caucho butilo habitual",
          "Peso ultraligero ~28 g (referencia de producto)",
          "700C — compatible con anchos 700×18C / 23C / 25C / 28C (ISO 18–622 … 32–622 según cubierta)",
          "Válvula Presta con boquilla en aleación y núcleo de cobre",
          "Refuerzo de goma en la base de válvula para mejor estanqueidad y menos rozamiento",
          "Opciones de válvula 45 mm, 65 mm u 85 mm",
          "Disponible en 1 o 2 unidades por pedido",
        ],
        seo: {
          title:
            "ThinkRider cámara TPU 28 g 700C Presta | Go Natural",
          description:
            "Cámara interior TPU ThinkRider 28 g, 700C, válvula Presta 45/65/85 mm, pack 1 o 2. Anti-pinchazos 2.ª gen. en Go Natural.",
        },
      },
      fr: {
        title:
          "ThinkRider — Chambre à air TPU 28 g 700C (Presta, anti-crevaison)",
        shortDescription:
          "Chambre ultralégère ~28 g en TPU 2e génération, valve Presta, compatibilité 700×18–28C. Meilleure résistance à la crevaison qu’un butyle classique.",
        description:
          "La chambre à air ThinkRider en TPU de deuxième génération cible le vélo route en 700C : moins de poids, meilleure résistance à la crevaison et sensation plus stable que beaucoup de chambres butyl classiques. La valve Presta combine un corps en alliage d’aluminium, un cœur en cuivre et un renfort caoutchouc à la base pour limiter frottements et fuites. Compatible avec des pneus 700×18C à 700×28C (plages ISO typiques ~18–622 à 32–622 selon le pneu). Choisissez la longueur de valve (45, 65 ou 85 mm) et l’unité seule ou le lot de 2.",
        features: [
          "TPU 2e gén. : meilleure tenue et anti-crevaison vs butyle classique",
          "Ultralégère ~28 g (référence produit)",
          "700C — 700×18C / 23C / 25C / 28C (ISO 18–622 … 32–622 selon pneu)",
          "Valve Presta : corps alu et cœur cuivre",
          "Renfort caoutchouc à la base de valve pour l’étanchéité",
          "Longueurs de valve 45, 65 ou 85 mm",
          "Vendue à l’unité ou par lot de 2",
        ],
        seo: {
          title:
            "ThinkRider chambre TPU 28 g 700C Presta | Go Natural",
          description:
            "Chambre à air TPU ThinkRider 28 g, 700C, Presta 45/65/85 mm, 1 ou 2 pièces. Anti-crevaison 2e gén. chez Go Natural.",
        },
      },
      it: {
        title:
          "ThinkRider — Camera d’aria TPU 28 g 700C (Presta, anti-foratura)",
        shortDescription:
          "Camera ultraleggera ~28 g in TPU di 2ª generazione, valvola Presta, compatibilità 700×18–28C. Maggiore resistenza alle forature rispetto al butile tradizionale.",
        description:
          "La camera d’aria ThinkRider in TPU di seconda generazione è pensata per il ciclismo su strada in 700C: meno peso, migliore resistenza alle forature e sensazione più stabile rispetto a molte camere in butile. La valvola Presta ha corpo in lega di alluminio, anima in rame e rinforzo in gomma alla base per ridurre attriti e perdite. Adatta a pneumatici 700×18C, 23C, 25C e 28C (range ISO tipici ~18–622 … 32–622 a seconda del copertone). Scegli la lunghezza valvola (45, 65 o 85 mm) e la confezione da 1 o 2 camere.",
        features: [
          "TPU 2ª gen.: più tenuta e anti-foratura vs butile classico",
          "Ultraleggera ~28 g (riferimento prodotto)",
          "700C — compatibile 700×18C / 23C / 25C / 28C (ISO 18–622 … 32–622)",
          "Valvola Presta con corpo in lega e anima in rame",
          "Rinforzo in gomma alla base valvola per tenuta e meno attrito",
          "Lunghezze valvola 45, 65 o 85 mm",
          "Disponibile singola o confezione da 2",
        ],
        seo: {
          title:
            "ThinkRider camera TPU 28 g 700C Presta | Go Natural",
          description:
            "Camera d’aria TPU ThinkRider 28 g, 700C, Presta 45/65/85 mm, 1 o 2 pezzi. Anti-foratura 2ª gen. su Go Natural.",
        },
      },
    },
  },
  {
    id: "gn-cycling-training-001",
    title:
      "ThinkRider X2 Max — Rodillo inteligente (MTB/carretera, potenciómetro integrado)",
    price: 235,
    category: "Cycling",
    images: ["/assets/images/products/gn-cycling-training-001/smart-bike-01.webp"],
    shortDescription:
      "Rodillo de transmisión directa para entrenamiento indoor serio, con medición de potencia integrada.",
    description:
      "El ThinkRider X2 Max está pensado para quien quiere entrenar en casa con sensación de pedaleo firme y datos fiables. Su arquitectura de transmisión directa reduce holguras y mantiene la bicicleta estable en intervalos y sprints. Compatible con montaje de MTB y carretera según tu tren trasero, integra medición de potencia para planificar cargas y seguir tu evolución sin salir de casa.",
    features: [
      "Transmisión directa (direct drive) para sensación de pedaleo consistente",
      "Potenciómetro integrado para estructurar series y controlar la intensidad",
      "Compatible con bicicletas de montaña y carretera (según cassette y eje)",
      "Base amplia y geometría estable para esfuerzos altos",
      "Funcionamiento silencioso para entrenar en espacios habitados",
      "Asa integrada para mover o guardar el equipo con menos esfuerzo",
      "Preparado para conectar con apps y entornos de entrenamiento indoor habituales",
    ],
    translations: {
      en: {
        title:
          "ThinkRider X2 Max — Smart trainer (MTB/road, built-in power meter)",
        shortDescription:
          "Direct-drive indoor trainer with integrated power for structured training at home.",
        description:
          "The ThinkRider X2 Max is built for riders who want serious indoor sessions with a solid road feel and dependable metrics. Its direct-drive layout minimizes slack and keeps the bike planted during intervals and sprints. Suitable for MTB and road setups depending on your drivetrain, it features integrated power measurement so you can plan workouts and track progress without leaving home.",
        features: [
          "Direct-drive architecture for consistent pedaling feel",
          "Built-in power meter for structured intervals and intensity control",
          "MTB and road compatible (cassette and axle dependent)",
          "Wide footprint for stability under hard efforts",
          "Low-noise operation for apartment and shared spaces",
          "Integrated carry handle for easier storage and transport",
          "Ready for common indoor training apps and ecosystems",
        ],
      },
      es: {
        title:
          "ThinkRider X2 Max — Rodillo inteligente (MTB/carretera, potenciómetro integrado)",
        shortDescription:
          "Rodillo de transmisión directa para entrenamiento indoor serio, con medición de potencia integrada.",
        description:
          "El ThinkRider X2 Max está pensado para quien quiere entrenar en casa con sensación de pedaleo firme y datos fiables. Su arquitectura de transmisión directa reduce holguras y mantiene la bicicleta estable en intervalos y sprints. Compatible con montaje de MTB y carretera según tu tren trasero, integra medición de potencia para planificar cargas y seguir tu evolución sin salir de casa.",
        features: [
          "Transmisión directa (direct drive) para sensación de pedaleo consistente",
          "Potenciómetro integrado para estructurar series y controlar la intensidad",
          "Compatible con bicicletas de montaña y carretera (según cassette y eje)",
          "Base amplia y geometría estable para esfuerzos altos",
          "Funcionamiento silencioso para entrenar en espacios habitados",
          "Asa integrada para mover o guardar el equipo con menos esfuerzo",
          "Preparado para conectar con apps y entornos de entrenamiento indoor habituales",
        ],
      },
      fr: {
        title:
          "ThinkRider X2 Max — Home trainer intelligent (VTT/route, capteur de puissance intégré)",
        shortDescription:
          "Home trainer à transmission directe pour séances indoor sérieuses avec mesure de puissance intégrée.",
        description:
          "Le ThinkRider X2 Max s’adresse aux cyclistes qui veulent s’entraîner chez eux avec une sensation de pédalage nette et des données fiables. Son architecture direct drive limite le jeu et maintient le vélo stable pendant les intervalles et les sprints. Compatible VTT et route selon votre transmission, il intègre la mesure de puissance pour structurer l’entraînement et suivre vos progrès sans quitter la maison.",
        features: [
          "Transmission directe pour une sensation de pédalage homogène",
          "Capteur de puissance intégré pour structurer le travail en intensité",
          "Compatible VTT et route (selon cassette et axe)",
          "Base large pour la stabilité sous gros efforts",
          "Fonctionnement discret pour l’usage en appartement",
          "Poignée intégrée pour déplacer ou ranger l’équipement",
          "Prêt pour les applications d’entraînement indoor courantes",
        ],
      },
      it: {
        title:
          "ThinkRider X2 Max — Rullo smart (MTB/strada, potenziometro integrato)",
        shortDescription:
          "Rullo a trasmissione diretta per allenamenti indoor seri con misura di potenza integrata.",
        description:
          "Il ThinkRider X2 Max è pensato per chi vuole allenarsi in casa con sensazione di pedalata solida e dati affidabili. L’architettura a trasmissione diretta riduce i giochi e mantiene la bici stabile in interval e sprint. Compatibile con MTB e strada in base al gruppo, integra la misura di potenza per pianificare il carico e seguire i progressi senza uscire di casa.",
        features: [
          "Trasmissione diretta per sensazione di pedalata uniforme",
          "Potenziometro integrato per strutturare le serie e l’intensità",
          "Compatibile MTB e strada (a seconda di pacco pignoni e perno)",
          "Base ampia e stabilità sotto sforzo elevato",
          "Rumorosità contenuta per ambienti domestici",
          "Maniglia integrata per spostare o riporre il rullo",
          "Pronto per app ed ecosistemi di indoor training comuni",
        ],
      },
    },
  },
  {
    id: "gn-cycling-clothing-002",
    title: "ROCKBROS Pantalón de Ciclismo Invierno Acolchado 3D",
    price: 41.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-clothing-002/image.webp"
    ],
    description:
      "Pantalón térmico de ciclismo con acolchado 3D para invierno.",
    features: [
      "Acolchado 3D",
      "Térmico para invierno",
      "Diseño ergonómico",
      "Ideal para MTB y ruta",
    ],
    translations: {
      en: {
        title: "ROCKBROS Winter Cycling Pants with 3D Padding",
        description: "Thermal cycling pants with 3D padding for winter.",
        features: [
          "3D padding",
          "Thermal for winter",
          "Ergonomic design",
          "Ideal for MTB and road",
        ],
      },
      es: {
        title: "ROCKBROS Pantalón de Ciclismo Invierno Acolchado 3D",
        description:
          "Pantalón térmico de ciclismo con acolchado 3D para invierno.",
        features: [
          "Acolchado 3D",
          "Térmico para invierno",
          "Diseño ergonómico",
          "Ideal para MTB y ruta",
        ],
      },
      fr: {
        title: "Pantalon de cyclisme d’hiver ROCKBROS avec rembourrage 3D",
        description:
          "Pantalon de cyclisme thermique avec rembourrage 3D pour l’hiver.",
        features: [
          "Rembourrage 3D",
          "Thermique pour l’hiver",
          "Design ergonomique",
          "Idéal VTT et route",
        ],
      },
      it: {
        title: "Pantaloni ciclismo invernali ROCKBROS con imbottitura 3D",
        description:
          "Pantaloni termici da ciclismo con imbottitura 3D per l’inverno.",
        features: [
          "Imbottitura 3D",
          "Termici per l’inverno",
          "Design ergonomico",
          "Ideali per MTB e strada",
        ],
      },
    },
    variants: {
      type: "size",
      label: "Tamaño",
      default: "M",
      options: [
        { value: "XS", label: "XS" },
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "XXL", label: "XXL" },
        { value: "XXXL", label: "XXXL" },
      ],
    },
  },
  {
    id: "gn-cycling-jacket-003",
    title: "ROCKBROS Chaqueta Térmica de Ciclismo Invierno",
    price: 60.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-jacket-003/image.webp"
    ],
    description:
      "Chaqueta térmica cortaviento para ciclismo en invierno.",
    features: [
      "Cortaviento",
      "Térmica",
      "Transpirable",
      "Diseño deportivo",
    ],
    translations: {
      en: {
        title: "ROCKBROS Winter Thermal Cycling Jacket",
        description: "Thermal windproof jacket for winter cycling.",
        features: [
          "Windproof",
          "Thermal",
          "Breathable",
          "Sport design",
        ],
      },
      es: {
        title: "ROCKBROS Chaqueta Térmica de Ciclismo Invierno",
        description: "Chaqueta térmica cortaviento para ciclismo en invierno.",
        features: [
          "Cortaviento",
          "Térmica",
          "Transpirable",
          "Diseño deportivo",
        ],
      },
      fr: {
        title: "Veste thermique de cyclisme d’hiver ROCKBROS",
        description:
          "Veste thermique coupe-vent pour le cyclisme en hiver.",
        features: [
          "Coupe-vent",
          "Thermique",
          "Respirante",
          "Design sportif",
        ],
      },
      it: {
        title: "Giacca termica invernale ROCKBROS per ciclismo",
        description:
          "Giacca termica antivento per il ciclismo invernale.",
        features: [
          "Antivento",
          "Termica",
          "Traspirante",
          "Design sportivo",
        ],
      },
    },
    variants: {
      type: "size",
      label: "Tamaño",
      default: "M",
      options: [
        { value: "XS", label: "XS" },
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "XXL", label: "XXL" },
        { value: "XXXL", label: "XXXL" },
      ],
    },
  },
  {
    id: "gn-cycling-shoes-001",
    title: "Performance Cycling Shoes — Road & MTB",
    price: 49.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-shoes-001/cycling-MTB-featured.webp"
    ],
    description:
      "Precision-built cycling shoes designed for long rides, efficient power transfer, and all-day comfort across road and off-road disciplines.",
    shortDescription:
      "Precision-built cycling shoes for long rides, efficient power transfer, and all-day comfort on road and trail.",
    longDescription: [
      "Designed for cyclists who value efficiency and clean design, these performance cycling shoes combine a lightweight structure with a rigid sole for optimal power transfer.",
      "Breathable perforated uppers keep airflow constant, while the secure closure system ensures a precise fit on every ride.",
      "Equally suited for road cycling and mountain trails, this is a versatile, minimal shoe built for serious riders.",
    ],
    features: [
      "Lightweight, breathable perforated upper", 
      "Rigid sole for efficient power transfer",
      "Secure dual-dial closure system",
      "Compatible with road and MTB setups",
      "Designed for long-distance comfort",
    ],
    translations: {
      es: {
        title: "Zapatillas de Ciclismo de Alto Rendimiento — Ruta y MTB",
        description:
          "Zapatillas de ciclismo diseñadas para maximizar la transferencia de potencia, la comodidad y el control en carretera y montaña.",
        shortDescription:
          "Zapatillas de ciclismo para potencia eficiente, control estable y confort en ruta y MTB.",
        longDescription: [
          "Estas zapatillas de ciclismo de alto rendimiento están pensadas para ciclistas que priorizan la eficiencia, la comodidad y el diseño limpio.",
          "Su estructura ligera y suela rígida garantizan una transferencia de potencia óptima, mientras que el upper perforado permite una ventilación constante durante recorridos largos.",
          "Ideales tanto para ciclismo de carretera como MTB, ofrecen un ajuste preciso y estable en cualquier terreno.",
        ],
        features: [
          "Upper perforado, ligero y transpirable",
          "Suela rígida para máxima eficiencia",
          "Sistema de cierre de ajuste preciso",
          "Compatibles con configuraciones Road y MTB",
          "Comodidad pensada para largas distancias",
        ],
      },
      fr: {
        title: "Chaussures de Cyclisme Haute Performance — Route et VTT",
        description:
          "Chaussures de cyclisme conçues pour offrir un transfert de puissance optimal, un maintien précis et un confort durable.",
        shortDescription:
          "Chaussures de cyclisme pour un transfert de puissance efficace et un confort durable.",
        longDescription: [
          "Conçues pour les cyclistes exigeants, ces chaussures allient légèreté, respirabilité et rigidité pour maximiser l’efficacité sur route comme en VTT.",
          "La tige perforée assure une ventilation constante, tandis que la semelle rigide optimise chaque coup de pédale.",
          "Un choix polyvalent pour les longues sorties et les terrains variés.",
        ],
        features: [
          "Tige perforée légère et respirante",
          "Semelle rigide pour un transfert de puissance optimal",
          "Système de serrage précis",
          "Compatibles route et VTT",
          "Confort longue durée",
        ],
      },
      it: {
        title: "Scarpe da Ciclismo ad Alte Prestazioni — Strada e MTB",
        description:
          "Scarpe da ciclismo progettate per offrire efficienza, comfort e controllo su strada e fuoristrada.",
        shortDescription:
          "Scarpe da ciclismo per efficienza e comfort costante su strada e MTB.",
        longDescription: [
          "Queste scarpe da ciclismo ad alte prestazioni sono pensate per ciclisti che ricercano un equilibrio perfetto tra rigidità, leggerezza e comfort.",
          "La tomaia perforata garantisce una ventilazione continua, mentre la suola rigida assicura un’efficace trasmissione della potenza.",
          "Adatte sia alla strada che al MTB, sono ideali per uscite lunghe e impegnative.",
        ],
        features: [
          "Tomaia perforata e traspirante",
          "Suola rigida per massima efficienza",
          "Sistema di chiusura sicuro e preciso",
          "Compatibili con configurazioni strada e MTB",
          "Comfort progettato per lunghe distanze",
        ],
      },
    },
    variants: [
      {
        type: "model",
        label: "Modelo",
        default: "road-white",
        options: [
          { value: "road-white", label: "White Road", priceModifier: 0 },
          { value: "mtb-white", label: "White MTB", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño",
        default: "42",
        options: [
          { value: "39", label: "39", priceModifier: 0 },
          { value: "40", label: "40", priceModifier: 0 },
          { value: "41", label: "41", priceModifier: 0 },
          { value: "42", label: "42", priceModifier: 0 },
          { value: "43", label: "43", priceModifier: 0 },
          { value: "44", label: "44", priceModifier: 0 },
          { value: "45", label: "45", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-cycling-shoes-performance-001",
    title: "Performance Cycling Shoes",
    price: 39.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-shoes-performance-001/gn-cycling-shoes-performance-01.webp"
    ],
    description:
      "Precision-built cycling shoes designed for speed, efficiency, and long-distance comfort on road and training rides. Free shipping included.",
    shortDescription:
      "Precision-built cycling shoes designed for speed, efficiency, and long-distance comfort on road and training rides.",
    longDescription: [
      "These performance cycling shoes are engineered for riders who value power transfer, clean aesthetics, and reliable comfort.",
      "The perforated upper enhances breathability, while the rigid sole ensures efficient energy transfer with every pedal stroke.",
      "Designed for speed-focused cycling, they offer a secure fit, balanced stiffness, and a minimalist design language suitable for both training and competition.",
    ],
    features: [
      "Lightweight perforated upper for airflow",
      "Rigid sole for efficient power transfer",
      "Secure dial-based closure system",
      "Road-oriented performance fit",
      "Clean, minimalist design",
    ],
    translations: {
      es: {
        title: "Zapatillas de Ciclismo de Alto Rendimiento",
        description:
          "Zapatillas de ciclismo diseñadas para velocidad, eficiencia y comodidad en recorridos largos. Envío gratis incluido.",
        shortDescription:
          "Zapatillas de ciclismo diseñadas para velocidad, eficiencia y comodidad en recorridos largos.",
        longDescription: [
          "Estas zapatillas de ciclismo de alto rendimiento están pensadas para ciclistas que priorizan la transferencia de potencia, la ventilación y un diseño limpio.",
          "El upper perforado mejora la transpirabilidad, mientras que la suela rígida optimiza cada pedalada.",
          "Ideales para entrenamientos intensos y ciclismo de carretera, ofrecen ajuste seguro y comodidad constante.",
        ],
        features: [
          "Upper perforado y transpirable",
          "Suela rígida para máxima eficiencia",
          "Sistema de cierre preciso",
          "Ajuste orientado a carretera",
          "Diseño minimalista",
        ],
      },
      fr: {
        title: "Chaussures de Cyclisme Haute Performance",
        description:
          "Chaussures de cyclisme conçues pour la vitesse, l’efficacité et le confort longue distance. Livraison gratuite incluse.",
        shortDescription:
          "Chaussures de cyclisme conçues pour la vitesse, l’efficacité et le confort longue distance.",
        longDescription: [
          "Conçues pour les cyclistes axés sur la performance, ces chaussures offrent une excellente transmission de puissance grâce à leur semelle rigide et une respirabilité optimale via une tige perforée.",
          "Parfaites pour l’entraînement et la route, elles allient confort, maintien et design épuré.",
        ],
        features: [
          "Tige perforée respirante",
          "Semelle rigide haute performance",
          "Système de serrage précis",
          "Ajustement orienté route",
          "Design minimal et moderne",
        ],
      },
      it: {
        title: "Scarpe da Ciclismo ad Alte Prestazioni",
        description:
          "Scarpe da ciclismo progettate per velocità, efficienza e comfort su lunghe distanze. Spedizione gratuita inclusa.",
        shortDescription:
          "Scarpe da ciclismo progettate per velocità, efficienza e comfort su lunghe distanze.",
        longDescription: [
          "Queste scarpe da ciclismo ad alte prestazioni sono pensate per ciclisti che cercano una trasmissione di potenza efficace e una calzata stabile.",
          "La tomaia perforata migliora la ventilazione, mentre la suola rigida garantisce prestazioni costanti.",
          "Ideali per ciclismo su strada e allenamento intenso.",
        ],
        features: [
          "Tomaia perforata e traspirante",
          "Suola rigida per massima efficienza",
          "Sistema di chiusura sicuro",
          "Fit orientato alla strada",
          "Design essenziale",
        ],
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "black",
        options: [
          { value: "black", label: "Black", priceModifier: 0 },
          { value: "red", label: "Red", priceModifier: 0 },
          { value: "white", label: "White", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño",
        default: "42",
        options: [
          { value: "36", label: "36", priceModifier: 0 },
          { value: "37", label: "37", priceModifier: 0 },
          { value: "38", label: "38", priceModifier: 0 },
          { value: "39", label: "39", priceModifier: 0 },
          { value: "40", label: "40", priceModifier: 0 },
          { value: "41", label: "41", priceModifier: 0 },
          { value: "42", label: "42", priceModifier: 0 },
          { value: "43", label: "43", priceModifier: 0 },
          { value: "44", label: "44", priceModifier: 0 },
          { value: "45", label: "45", priceModifier: 0 },
          { value: "46", label: "46", priceModifier: 0 },
          { value: "47", label: "47", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-cycling-shoes-002",
    title: "Performance Cycling Shoes",
    price: 35.59,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-shoes-002/gn-cycling-shoes-1.webp"
    ],
    description:
      "Versatile cycling shoes designed for efficient power transfer, breathability, and long-distance comfort. Free shipping included.",
    shortDescription:
      "Versatile cycling shoes designed for efficient power transfer, breathability, and long-distance comfort.",
    longDescription: [
      "These cycling shoes are built for riders who seek performance, comfort, and visual restraint.",
      "The ventilated upper promotes airflow during intense rides, while the stiff sole supports efficient pedaling across road and training sessions.",
      "Their balanced construction makes them suitable for both daily training and longer endurance rides, maintaining comfort without sacrificing responsiveness.",
    ],
    features: [
      "Breathable perforated upper",
      "Efficient power-transfer sole",
      "Secure and precise closure system",
      "Comfortable performance fit",
      "Clean, modern cycling design",
    ],
    translations: {
      es: {
        title: "Zapatillas de Ciclismo de Rendimiento",
        description:
          "Zapatillas de ciclismo versátiles diseñadas para eficiencia, ventilación y comodidad prolongada. Envío gratis incluido.",
        shortDescription:
          "Zapatillas de ciclismo versátiles diseñadas para eficiencia, ventilación y comodidad prolongada.",
        longDescription: [
          "Estas zapatillas están pensadas para ciclistas que buscan rendimiento equilibrado y comodidad.",
          "Su upper ventilado favorece la transpiración, mientras que la suela rígida optimiza la transferencia de potencia en cada salida.",
          "Ideales tanto para entrenamientos como para recorridos más largos.",
        ],
        features: [
          "Upper transpirable y perforado",
          "Suela rígida para pedaleo eficiente",
          "Sistema de ajuste seguro",
          "Ajuste cómodo orientado al rendimiento",
          "Diseño limpio y moderno",
        ],
      },
      fr: {
        title: "Chaussures de Cyclisme Performance",
        description:
          "Chaussures de cyclisme polyvalentes offrant efficacité, respirabilité et confort longue durée. Livraison gratuite incluse.",
        shortDescription:
          "Chaussures de cyclisme polyvalentes offrant efficacité, respirabilité et confort longue durée.",
        longDescription: [
          "Conçues pour les cyclistes à la recherche d’un équilibre entre performance et confort, ces chaussures disposent d’une tige respirante et d’une semelle rigide favorisant une transmission de puissance optimale.",
          "Adaptées à l’entraînement comme aux sorties prolongées.",
        ],
        features: [
          "Tige respirante perforée",
          "Semelle rigide haute efficacité",
          "Système de serrage précis",
          "Ajustement confortable et performant",
          "Design moderne et épuré",
        ],
      },
      it: {
        title: "Scarpe da Ciclismo Performance",
        description:
          "Scarpe da ciclismo versatili progettate per efficienza, traspirabilità e comfort prolungato. Spedizione gratuita inclusa.",
        shortDescription:
          "Scarpe da ciclismo versatili progettate per efficienza, traspirabilità e comfort prolungato.",
        longDescription: [
          "Queste scarpe da ciclismo offrono un equilibrio ideale tra comfort e prestazioni.",
          "La tomaia perforata migliora la ventilazione, mentre la suola rigida garantisce una trasmissione di potenza efficace.",
          "Perfette per allenamenti regolari e uscite più lunghe.",
        ],
        features: [
          "Tomaia perforata e traspirante",
          "Suola rigida ad alta efficienza",
          "Sistema di chiusura sicuro",
          "Calzata confortevole e performante",
          "Design essenziale e moderno",
        ],
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "black",
        options: [
          { value: "black", label: "Black", priceModifier: 0 },
          { value: "white", label: "White", priceModifier: 0 },
          { value: "red", label: "Red", priceModifier: 0 },
          { value: "blue", label: "Blue", priceModifier: 0 },
          { value: "green", label: "Green", priceModifier: 0 },
          { value: "special", label: "Special", priceModifier: 0 },
          { value: "black-green", label: "Black/Green", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño",
        default: "42",
        options: [
          { value: "36", label: "36", priceModifier: 0 },
          { value: "37", label: "37", priceModifier: 0 },
          { value: "38", label: "38", priceModifier: 0 },
          { value: "39", label: "39", priceModifier: 0 },
          { value: "40", label: "40", priceModifier: 0 },
          { value: "41", label: "41", priceModifier: 0 },
          { value: "42", label: "42", priceModifier: 0 },
          { value: "43", label: "43", priceModifier: 0 },
          { value: "44", label: "44", priceModifier: 0 },
          { value: "45", label: "45", priceModifier: 0 },
          { value: "46", label: "46", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-mtb-shoes-001",
    title: "Mountain Bike Cycling Shoes",
    price: 79.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-mtb-shoes-001/image.webp"
    ],
    description:
      "Durable mountain bike shoes designed for control, stability, and confidence across technical terrain. Free shipping included.",
    shortDescription:
      "Durable mountain bike shoes designed for control, stability, and confidence across technical terrain.",
    longDescription: [
      "These mountain bike cycling shoes are built to perform in challenging conditions.",
      "The reinforced upper provides durability and protection, while the grippy sole ensures stability whether you’re riding flat pedals or SPD systems.",
      "Designed for trail, enduro, and all-mountain riding, they balance pedaling efficiency with off-bike traction.",
    ],
    features: [
      "Flat and SPD-compatible options",
      "High-grip outsole for technical terrain",
      "Reinforced upper for durability",
      "Secure dial-based fit system",
      "Stable and confident ride feel",
    ],
    translations: {
      es: {
        title: "Zapatillas de Ciclismo MTB",
        description:
          "Zapatillas de montaña diseñadas para control, estabilidad y confianza en terrenos técnicos. Envío gratis incluido.",
        shortDescription:
          "Zapatillas de montaña diseñadas para control, estabilidad y confianza en terrenos técnicos.",
        longDescription: [
          "Estas zapatillas de ciclismo de montaña están pensadas para condiciones exigentes.",
          "Su upper reforzado ofrece durabilidad y protección, mientras que la suela proporciona un agarre seguro tanto en pedales planos como en sistemas SPD.",
          "Ideales para trail, enduro y all-mountain.",
        ],
        features: [
          "Opciones Flat y SPD",
          "Suela de alto agarre",
          "Upper reforzado y resistente",
          "Sistema de ajuste preciso",
          "Sensación de estabilidad y control",
        ],
      },
      fr: {
        title: "Chaussures VTT",
        description:
          "Chaussures de VTT conçues pour le contrôle, la stabilité et la maîtrise sur terrain technique. Livraison gratuite incluse.",
        shortDescription:
          "Chaussures de VTT conçues pour le contrôle, la stabilité et la maîtrise sur terrain technique.",
        longDescription: [
          "Ces chaussures de vélo tout-terrain sont adaptées aux conditions les plus exigeantes.",
          "Leur tige renforcée assure durabilité et protection, tandis que la semelle offre une excellente adhérence, compatible pédales plates ou SPD.",
          "Parfaites pour le trail, l’enduro et l’all-mountain.",
        ],
        features: [
          "Versions Flat et SPD",
          "Semelle à forte adhérence",
          "Tige renforcée et résistante",
          "Système de serrage précis",
          "Sensation de stabilité et de contrôle",
        ],
      },
      it: {
        title: "Scarpe da Mountain Bike",
        description:
          "Scarpe da MTB progettate per controllo, stabilità e sicurezza sui terreni tecnici. Spedizione gratuita inclusa.",
        shortDescription:
          "Scarpe da MTB progettate per controllo, stabilità e sicurezza sui terreni tecnici.",
        longDescription: [
          "Queste scarpe da mountain bike offrono prestazioni affidabili nelle condizioni più impegnative.",
          "La tomaia rinforzata garantisce resistenza, mentre la suola ad alta aderenza assicura stabilità con pedali flat o sistemi SPD.",
          "Ideali per trail, enduro e all-mountain.",
        ],
        features: [
          "Versioni Flat e SPD",
          "Suola ad alta aderenza",
          "Tomaia rinforzata",
          "Sistema di chiusura preciso",
          "Stabilità e controllo in ogni uscita",
        ],
      },
    },
    variants: [
      {
        type: "model",
        label: "Modelo",
        default: "flat-black-gum",
        options: [
          { value: "flat-black-gum", label: "Flat Black Gum", priceModifier: 0 },
          { value: "flat-black", label: "Flat Black", priceModifier: 0 },
          { value: "flat-black-white", label: "Flat Black White", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño",
        default: "42",
        options: [
          { value: "37", label: "37", priceModifier: 0 },
          { value: "38", label: "38", priceModifier: 0 },
          { value: "39", label: "39", priceModifier: 0 },
          { value: "40", label: "40", priceModifier: 0 },
          { value: "41", label: "41", priceModifier: 0 },
          { value: "42", label: "42", priceModifier: 0 },
          { value: "43", label: "43", priceModifier: 0 },
          { value: "44", label: "44", priceModifier: 0 },
          { value: "45", label: "45", priceModifier: 0 },
          { value: "46", label: "46", priceModifier: 0 },
          { value: "47", label: "47", priceModifier: 0 },
          { value: "48", label: "48", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-cycling-clothes-001",
    title: "Thermal Cycling Jacket – All-Season Performance Layer",
    price: 37.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-clothes-001/thermal-cycling-jacket.webp"
    ],
    description:
      "A minimalist thermal cycling jacket designed for cold rides and long-distance performance. Free shipping included.",
    shortDescription:
      "Minimalist thermal cycling jacket for cold rides and long-distance performance.",
    longDescription: [
      "Light insulation, breathable fabric, and a close-to-body fit for maximum efficiency on the bike.",
      "Built for riders who value function, silence, and durability over trends.",
    ],
    features: [
      "Thermal insulation for cold-weather rides",
      "Breathable fabric for moisture control",
      "Close fit optimized for cycling posture",
      "Lightweight and packable",
      "Reflective details for low-light visibility",
    ],
    freeShipping: true,
    translations: {
      es: {
        title: "Chaqueta Térmica de Ciclismo – Capa de Rendimiento Todo el Año",
        description:
          "Chaqueta térmica de ciclismo diseñada para rutas frías y rendimiento prolongado. Envío gratis incluido.",
        shortDescription:
          "Chaqueta térmica para rutas frías y rendimiento prolongado.",
        longDescription: [
          "Aislamiento ligero, tejido transpirable y ajuste preciso para una experiencia eficiente sobre la bicicleta.",
          "Pensada para ciclistas que priorizan funcionalidad, sobriedad y durabilidad.",
        ],
        features: [
          "Aislamiento térmico para salidas en frío",
          "Tejido transpirable para control de humedad",
          "Ajuste ceñido optimizado para postura de ciclismo",
          "Ligera y fácil de guardar",
          "Detalles reflectantes para baja visibilidad",
        ],
      },
      fr: {
        title: "Veste Thermique de Cyclisme – Couche Performance Toute Saison",
        description:
          "Veste thermique de cyclisme conçue pour les sorties par temps froid et les longues distances. Livraison gratuite incluse.",
        shortDescription:
          "Veste thermique pour sorties par temps froid et longues distances.",
        longDescription: [
          "Isolation légère, tissu respirant et coupe ajustée pour une efficacité maximale sur le vélo.",
          "Un vêtement pensé pour les cyclistes qui privilégient la fonction et la durabilité.",
        ],
        features: [
          "Isolation thermique pour sorties par temps froid",
          "Tissu respirant pour la gestion de l’humidité",
          "Coupe ajustée optimisée pour la posture cycliste",
          "Légère et compacte",
          "Détails réfléchissants pour faible luminosité",
        ],
      },
      it: {
        title: "Giacca Termica da Ciclismo – Strato Performance per Tutte le Stagioni",
        description:
          "Giacca termica da ciclismo progettata per le uscite con clima freddo e le lunghe distanze. Spedizione gratuita inclusa.",
        shortDescription:
          "Giacca termica per uscite con clima freddo e lunghe distanze.",
        longDescription: [
          "Isolamento leggero, tessuto traspirante e vestibilità aderente per la massima efficienza in sella.",
          "Ideale per ciclisti che cercano funzionalità e affidabilità nel tempo.",
        ],
        features: [
          "Isolamento termico per uscite con clima freddo",
          "Tessuto traspirante per il controllo dell’umidità",
          "Vestibilità aderente ottimizzata per la postura in bici",
          "Leggera e comprimibile",
          "Dettagli riflettenti per visibilità ridotta",
        ],
      },
    },
    variants: {
      type: "size",
      label: "Tamaño",
      default: "M",
      options: [
        { value: "S", label: "S", priceModifier: 0 },
        { value: "M", label: "M", priceModifier: 0 },
        { value: "L", label: "L", priceModifier: 0 },
        { value: "XL", label: "XL", priceModifier: 0 },
        { value: "XXL", label: "XXL", priceModifier: 0 },
        { value: "3XL", label: "3XL", priceModifier: 0 },
      ],
    },
  },
  {
    id: "gn-cycling-clothes-002",
    title: "Thermal Cycling Jacket – Long-Ride Weather Layer",
    price: 47.99,
    category: "Cycling",
    images: [
      "/assets/images/products/gn-cycling-clothes-002/thermal-cycling-jacket.webp"
    ],
    description:
      "Quiet protection for long rides in cold, shifting conditions.",
    shortDescription:
      "Technical outer layer for cold rides with breathable warmth and a clean, close fit.",
    longDescription: [
      "Light insulation and a breathable shell balance warmth and airflow across long distances in variable weather.",
      "Technical details: articulated sleeves, bonded cuffs, and a cycling-focused silhouette that packs easily.",
      "Care: machine wash cold, line dry. Avoid softeners and high heat.",
      "International sizing: choose your usual size for a close fit.",
      "Free shipping included.",
    ],
    features: [
      "Thermal insulation for cold-weather rides",
      "Breathable fabric for moisture control",
      "Close fit optimized for cycling posture",
      "International sizing with a true-to-size fit",
      "Reflective details for low-light visibility",
    ],
    freeShipping: true,
    translations: {
      es: {
        title: "Chaqueta Térmica de Ciclismo – Capa para Rutas Largas",
        description:
          "Protección silenciosa para rutas largas en clima frío y cambiante.",
        shortDescription:
          "Capa técnica para rutas frías con abrigo ligero y ajuste moderno.",
        longDescription: [
          "Aislamiento ligero y tejido transpirable equilibran calor y ventilación en rutas largas y clima variable.",
          "Detalles técnicos: mangas articuladas, puños sellados y un ajuste que se guarda fácil.",
          "Cuidado: lavar en frío, secar al aire. Evitar suavizantes y calor alto.",
          "Talles internacionales: elegí tu talle habitual para un calce ceñido.",
          "Envío gratis incluido.",
        ],
        features: [
          "Aislamiento térmico para salidas frías",
          "Tejido transpirable para control de humedad",
          "Ajuste ceñido optimizado para postura de ciclismo",
          "Talles internacionales con calce real",
          "Detalles reflectantes para baja visibilidad",
        ],
      },
      fr: {
        title: "Veste Thermique de Cyclisme – Couche Longue Distance",
        description:
          "Protection discrète pour les longues sorties par temps froid et changeant.",
        shortDescription:
          "Couche technique pour sorties froides avec chaleur légère et coupe ajustée.",
        longDescription: [
          "Isolation légère et tissu respirant pour équilibrer chaleur et ventilation sur longues distances.",
          "Détails techniques : manches articulées, poignets collés et coupe pensée pour la posture cycliste, facile à ranger.",
          "Entretien : lavage à froid, séchage à l'air. Éviter les adoucissants et la chaleur.",
          "Tailles internationales : choisissez votre taille habituelle pour une coupe ajustée.",
          "Livraison gratuite incluse.",
        ],
        features: [
          "Isolation thermique pour sorties par temps froid",
          "Tissu respirant pour la gestion de l'humidité",
          "Coupe ajustée optimisée pour la posture cycliste",
          "Tailles internationales, coupe fidèle",
          "Détails réfléchissants pour faible luminosité",
        ],
      },
      it: {
        title: "Giacca Termica da Ciclismo – Strato per Lunghe Distanze",
        description:
          "Protezione discreta per uscite lunghe con clima freddo e variabile.",
        shortDescription:
          "Strato tecnico per uscite fredde con calore leggero e vestibilità aderente.",
        longDescription: [
          "Isolamento leggero e tessuto traspirante per bilanciare calore e ventilazione sulle lunghe distanze.",
          "Dettagli tecnici: maniche articolate, polsini sigillati e vestibilità pensata per la postura in bici, facile da riporre.",
          "Cura: lavare a freddo, asciugare all'aria. Evitare ammorbidenti e calore elevato.",
          "Taglie internazionali: scegli la tua taglia abituale per una vestibilità aderente.",
          "Spedizione gratuita inclusa.",
        ],
        features: [
          "Isolamento termico per uscite con clima freddo",
          "Tessuto traspirante per il controllo dell'umidità",
          "Vestibilità aderente ottimizzata per la postura in bici",
          "Taglie internazionali, vestibilità fedele",
          "Dettagli riflettenti per visibilità ridotta",
        ],
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "grey",
        options: [
          { value: "orange", label: "Orange", priceModifier: 0 },
          { value: "grey", label: "Grey", priceModifier: 0 },
          { value: "green", label: "Green", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño",
        default: "M",
        options: [
          { value: "S", label: "S", priceModifier: 0 },
          { value: "M", label: "M", priceModifier: 0 },
          { value: "L", label: "L", priceModifier: 0 },
          { value: "XL", label: "XL", priceModifier: 0 },
          { value: "XXL", label: "XXL", priceModifier: 0 },
          { value: "3XL", label: "3XL", priceModifier: 0 },
          { value: "4XL", label: "4XL", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-ski-snow-jacket-001",
    slug: "gn-ski-snow-jacket-001",
    title: "Alpine Shell Jacket — Quiet Winter Layer",
    price: 69.99,
    category: "Mountain & Snow",
    images: [
      "/assets/images/products/gn-ski-snow-jacket-001/alpine-shell-jacket-4.webp"
    ],
    description:
      "A quiet winter layer built for controlled movement on cold mountain days.",
    shortDescription:
      "Protective shell with breathable warmth and a clean silhouette for long days in snow.",
    longDescription: [
      "Built for winter travel with a calm, technical feel, this jacket balances protection and mobility without visual noise.",
      "Technical details: articulated patterning, storm-ready cuffs, and a streamlined hood for layered use.",
      "Care: machine wash cold, line dry. Avoid softeners and high heat.",
      "Free shipping included.",
    ],
    features: [
      "Weather-ready shell for cold mountain rides",
      "Breathable warmth with a quiet finish",
      "Articulated fit for movement",
      "Lightweight layering profile",
      "Reflective accents for low light",
    ],
    freeShipping: true,
    translations: {
      en: {
        title: "Alpine Shell Jacket — Quiet Winter Layer",
        description:
          "A quiet winter layer built for controlled movement on cold mountain days.",
        shortDescription:
          "Protective shell with breathable warmth and a clean silhouette for long days in snow.",
        longDescription: [
          "Built for winter travel with a calm, technical feel, this jacket balances protection and mobility without visual noise.",
          "Technical details: articulated patterning, storm-ready cuffs, and a streamlined hood for layered use.",
          "Care: machine wash cold, line dry. Avoid softeners and high heat.",
          "Free shipping included.",
        ],
        features: [
          "Weather-ready shell for cold mountain rides",
          "Breathable warmth with a quiet finish",
          "Articulated fit for movement",
          "Lightweight layering profile",
          "Reflective accents for low light",
        ],
        seo: {
          title: "Alpine Shell Jacket for Winter Riding | Go Natural",
          description:
            "A calm winter shell built for mountain movement, breathable warmth, and quiet protection in cold conditions.",
          ogTitle: "Alpine Shell Jacket — Quiet Winter Layer",
          ogDescription:
            "Refined winter protection for mountain rides with breathable warmth and a clean, quiet silhouette.",
        },
      },
      es: {
        title: "Chaqueta Alpine Shell — Capa de Invierno Silenciosa",
        description:
          "Capa de invierno sobria, pensada para moverse con control en días fríos de montaña.",
        shortDescription:
          "Shell protector con abrigo respirable y silueta limpia para largas jornadas en nieve.",
        longDescription: [
          "Pensada para el invierno con una sensación técnica y serena, equilibra protección y movilidad sin ruido visual.",
          "Detalles técnicos: patrón articulado, puños preparados para tormenta y capucha estilizada para uso en capas.",
          "Cuidado: lavar en frío, secar al aire. Evitar suavizantes y calor alto.",
          "Envío gratis incluido.",
        ],
        features: [
          "Shell preparado para frío y montaña",
          "Abrigo respirable con acabado discreto",
          "Corte articulado para moverse con libertad",
          "Perfil liviano para usar en capas",
          "Detalles reflectantes en baja luz",
        ],
        seo: {
          title: "Chaqueta Alpine Shell para Invierno | Go Natural",
          description:
            "Chaqueta invernal sobria para montaña: abrigo respirable, protección limpia y movimiento controlado.",
          ogTitle: "Chaqueta Alpine Shell — Capa de Invierno Silenciosa",
          ogDescription:
            "Protección refinada para días fríos en montaña con abrigo respirable y silueta limpia.",
        },
      },
      fr: {
        title: "Veste Alpine Shell — Couche d’Hiver Silencieuse",
        description:
          "Couche d’hiver sobre pensée pour des mouvements maîtrisés en montagne.",
        shortDescription:
          "Shell protectrice, chaleur respirante et silhouette épurée pour de longues journées de neige.",
        longDescription: [
          "Conçue pour l’hiver avec une sensation technique et calme, elle équilibre protection et mobilité sans excès visuel.",
          "Détails techniques : coupe articulée, poignets prêts pour la tempête et capuche épurée pour le port en couches.",
          "Entretien : lavage à froid, séchage à l’air. Éviter les adoucissants et la chaleur.",
          "Livraison gratuite incluse.",
        ],
        features: [
          "Shell prêt pour le froid en montagne",
          "Chaleur respirante au fini discret",
          "Coupe articulée pour bouger librement",
          "Profil léger pour superposition",
          "Détails réfléchissants en faible lumière",
        ],
        seo: {
          title: "Veste Alpine Shell pour l’Hiver | Go Natural",
          description:
            "Veste d’hiver sobre pour la montagne, chaleur respirante et protection épurée en conditions froides.",
          ogTitle: "Veste Alpine Shell — Couche d’Hiver Silencieuse",
          ogDescription:
            "Protection raffinée pour la montagne avec chaleur respirante et silhouette nette.",
        },
      },
      it: {
        title: "Giacca Alpine Shell — Strato Invernale Silenzioso",
        description:
          "Strato invernale essenziale per muoversi con controllo in montagna.",
        shortDescription:
          "Shell protettiva con calore traspirante e linea pulita per lunghe giornate sulla neve.",
        longDescription: [
          "Progettata per l’inverno con un feeling tecnico e calmo, bilancia protezione e mobilità senza eccessi visivi.",
          "Dettagli tecnici: taglio articolato, polsini protetti e cappuccio essenziale per la stratificazione.",
          "Cura: lavare a freddo, asciugare all’aria. Evitare ammorbidenti e calore elevato.",
          "Spedizione gratuita inclusa.",
        ],
        features: [
          "Shell pronta per il freddo in montagna",
          "Calore traspirante con finitura discreta",
          "Taglio articolato per libertà di movimento",
          "Profilo leggero per stratificazione",
          "Dettagli riflettenti in scarsa luce",
        ],
        seo: {
          title: "Giacca Alpine Shell Invernale | Go Natural",
          description:
            "Giacca invernale sobria per la montagna: calore traspirante, protezione pulita e movimento controllato.",
          ogTitle: "Giacca Alpine Shell — Strato Invernale Silenzioso",
          ogDescription:
            "Protezione raffinata per la montagna con calore traspirante e linea pulita.",
        },
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "black",
        options: [
          { value: "black", label: "Black", priceModifier: 0 },
          { value: "bright-blue", label: "Bright Blue", priceModifier: 0 },
          { value: "denim-blue", label: "Denim Blue", priceModifier: 0 },
          { value: "army-green", label: "Army Green", priceModifier: 0 },
          { value: "red", label: "Red", priceModifier: 0 },
          { value: "light-gray", label: "Light Gray", priceModifier: 0 },
          { value: "dark-gray", label: "Dark Gray", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño",
        default: "M",
        options: [
          { value: "S", label: "S", priceModifier: 0 },
          { value: "M", label: "M", priceModifier: 0 },
          { value: "L", label: "L", priceModifier: 0 },
          { value: "XL", label: "XL", priceModifier: 0 },
          { value: "2XL", label: "2XL", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-ski-snow-pants-001",
    slug: "gn-ski-snow-pants-001",
    title: "Alpine Snow Pants — Quiet Winter Protection",
    price: 69.99,
    category: "Mountain & Snow",
    images: [
      "/assets/images/products/gn-ski-snow-pants-001/featured.webp"
    ],
    description:
      "A calm, technical pant designed for winter movement and steady protection.",
    shortDescription:
      "Weather-ready snow pants with a quiet finish, built for cold days in the mountains.",
    longDescription: [
      "Designed for winter travel, these pants balance thermal protection, durable fabric, and a clean silhouette that moves with you.",
      "Technical details: articulated knees, reinforced panels, and a weather-sealed waist for long days in cold conditions.",
      "Care: machine wash cold, line dry. Avoid softeners and high heat.",
      "Free shipping included.",
    ],
    features: [
      "Thermal protection for winter conditions",
      "Weather-resistant shell for mountain use",
      "Articulated fit for freer movement",
      "Reinforced zones for durability",
      "Quiet, technical finish",
    ],
    freeShipping: true,
    translations: {
      en: {
        title: "Alpine Snow Pants — Quiet Winter Protection",
        description:
          "A calm, technical pant designed for winter movement and steady protection.",
        shortDescription:
          "Weather-ready snow pants with a quiet finish, built for cold days in the mountains.",
        longDescription: [
          "Designed for winter travel, these pants balance thermal protection, durable fabric, and a clean silhouette that moves with you.",
          "Technical details: articulated knees, reinforced panels, and a weather-sealed waist for long days in cold conditions.",
          "Care: machine wash cold, line dry. Avoid softeners and high heat.",
          "Free shipping included.",
        ],
        features: [
          "Thermal protection for winter conditions",
          "Weather-resistant shell for mountain use",
          "Articulated fit for freer movement",
          "Reinforced zones for durability",
          "Quiet, technical finish",
        ],
        seo: {
          title: "Alpine Snow Pants for Winter Riding | Go Natural",
          description:
            "Premium snow pants for mountain days with thermal protection, durable fabric, and a calm, technical silhouette.",
        },
      },
      es: {
        title: "Pantalón Alpine Snow — Protección Invernal Silenciosa",
        description:
          "Pantalón técnico y sobrio para moverse con calma en invierno.",
        shortDescription:
          "Pantalón de nieve con acabado silencioso, pensado para días fríos en montaña.",
        longDescription: [
          "Diseñado para el invierno, equilibra protección térmica, tejido resistente y una silueta limpia que acompaña el movimiento.",
          "Detalles técnicos: rodillas articuladas, refuerzos y cintura sellada para jornadas largas en frío.",
          "Cuidado: lavar en frío, secar al aire. Evitar suavizantes y calor alto.",
          "Envío gratis incluido.",
        ],
        features: [
          "Protección térmica para clima invernal",
          "Shell resistente al clima de montaña",
          "Corte articulado para moverse mejor",
          "Zonas reforzadas para mayor durabilidad",
          "Acabado técnico y silencioso",
        ],
        seo: {
          title: "Pantalón Alpine Snow para Invierno | Go Natural",
          description:
            "Pantalón de nieve premium para montaña con protección térmica, tejido resistente y silueta técnica y sobria.",
        },
      },
      fr: {
        title: "Pantalon Alpine Snow — Protection d’Hiver Silencieuse",
        description:
          "Pantalon technique et sobre conçu pour bouger sereinement en hiver.",
        shortDescription:
          "Pantalon de neige au fini discret, pensé pour les journées froides en montagne.",
        longDescription: [
          "Conçu pour l’hiver, il équilibre protection thermique, tissu durable et silhouette épurée qui suit le mouvement.",
          "Détails techniques : genoux articulés, renforts ciblés et taille étanche pour de longues journées par temps froid.",
          "Entretien : lavage à froid, séchage à l’air. Éviter les adoucissants et la chaleur.",
          "Livraison gratuite incluse.",
        ],
        features: [
          "Protection thermique pour conditions hivernales",
          "Shell résistant aux intempéries",
          "Coupe articulée pour la liberté de mouvement",
          "Zones renforcées pour la durabilité",
          "Fini technique et discret",
        ],
        seo: {
          title: "Pantalon Alpine Snow pour l’Hiver | Go Natural",
          description:
            "Pantalon de neige premium pour la montagne, protection thermique et tissu durable au design sobre et technique.",
        },
      },
      it: {
        title: "Pantaloni Alpine Snow — Protezione Invernale Silenziosa",
        description:
          "Pantalone tecnico e sobrio pensato per muoversi con calma in inverno.",
        shortDescription:
          "Pantaloni da neve dal finish discreto, ideali per le giornate fredde in montagna.",
        longDescription: [
          "Progettati per l’inverno, bilanciano protezione termica, tessuto resistente e una linea pulita che segue il movimento.",
          "Dettagli tecnici: ginocchia articolate, rinforzi mirati e vita sigillata per giornate lunghe al freddo.",
          "Cura: lavare a freddo, asciugare all’aria. Evitare ammorbidenti e calore elevato.",
          "Spedizione gratuita inclusa.",
        ],
        features: [
          "Protezione termica per condizioni invernali",
          "Shell resistente alle intemperie",
          "Taglio articolato per libertà di movimento",
          "Zone rinforzate per maggiore durata",
          "Finitura tecnica e discreta",
        ],
        seo: {
          title: "Pantaloni Alpine Snow per l’Inverno | Go Natural",
          description:
            "Pantaloni da neve premium per la montagna con protezione termica, tessuto resistente e linea tecnica essenziale.",
        },
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "black",
        options: [
          { value: "black", label: "Black", priceModifier: 0 },
          { value: "light-grey-black", label: "Light Grey & Black", priceModifier: 0 },
          { value: "dark-grey-black", label: "Dark Grey & Black", priceModifier: 0 },
          { value: "dark-grey-green", label: "Dark Grey & Green", priceModifier: 0 },
          { value: "dark-grey-navy", label: "Dark Grey & Navy", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño (US)",
        default: "32us",
        options: [
          { value: "30us", label: "30 US", priceModifier: 0 },
          { value: "32us", label: "32 US", priceModifier: 0 },
          { value: "34us", label: "34 US", priceModifier: 0 },
          { value: "36us", label: "36 US", priceModifier: 0 },
          { value: "38us", label: "38 US", priceModifier: 0 },
          { value: "40us", label: "40 US", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-outdoor-shoes-001",
    slug: "gn-outdoor-shoes-001",
    title: "Trekking Shoes — Quiet Terrain Stability",
    price: 88.89,
    category: "Outdoor & Adventure",
    images: [
      "/assets/images/products/gn-outdoor-shoes-001/gold.webp"
    ],
    description:
      "Steady footing for long trails, built with a calm, technical finish.",
    shortDescription:
      "Trekking shoes designed for cold, variable conditions and long days on the mountain.",
    longDescription: [
      "Balanced for trekking and winter terrain, these shoes blend protection, grip, and a clean profile that holds up to real use.",
      "Their construction supports long-distance comfort while keeping a quiet, premium look on and off trail.",
      "Care: wipe clean, air dry. Avoid direct heat and prolonged saturation.",
      "Free shipping included.",
    ],
    features: [
      "Thermal protection for cold trail conditions",
      "Weather-resistant upper for mountain use",
      "Stable midsole for long-distance comfort",
      "High-traction outsole for mixed terrain",
      "Durable build with a quiet finish",
    ],
    freeShipping: true,
    translations: {
      en: {
        title: "Trekking Shoes — Quiet Terrain Stability",
        description:
          "Steady footing for long trails, built with a calm, technical finish.",
        shortDescription:
          "Trekking shoes designed for cold, variable conditions and long days on the mountain.",
        longDescription: [
          "Balanced for trekking and winter terrain, these shoes blend protection, grip, and a clean profile that holds up to real use.",
          "Their construction supports long-distance comfort while keeping a quiet, premium look on and off trail.",
          "Care: wipe clean, air dry. Avoid direct heat and prolonged saturation.",
          "Free shipping included.",
        ],
        features: [
          "Thermal protection for cold trail conditions",
          "Weather-resistant upper for mountain use",
          "Stable midsole for long-distance comfort",
          "High-traction outsole for mixed terrain",
          "Durable build with a quiet finish",
        ],
        seo: {
          title: "Trekking Shoes for Winter Trails | Go Natural",
          description:
            "Premium trekking shoes for cold, variable terrain with steady grip, durable protection, and a quiet outdoor silhouette.",
        },
      },
      es: {
        title: "Zapatillas de Trekking — Estabilidad Silenciosa",
        description:
          "Pisada firme para rutas largas con un acabado técnico y sobrio.",
        shortDescription:
          "Zapatillas de trekking pensadas para frío, clima variable y jornadas largas en montaña.",
        longDescription: [
          "Equilibradas para trekking y terreno invernal, combinan protección, agarre y un perfil limpio que resiste el uso real.",
          "Su construcción acompaña el confort en distancia sin perder una estética premium y discreta.",
          "Cuidado: limpiar con paño húmedo y secar al aire. Evitar calor directo y saturación prolongada.",
          "Envío gratis incluido.",
        ],
        features: [
          "Protección térmica para rutas frías",
          "Upper resistente al clima de montaña",
          "Media suela estable para largas distancias",
          "Suela de alto agarre en terreno mixto",
          "Construcción durable y sobria",
        ],
        seo: {
          title: "Zapatillas de Trekking Invernales | Go Natural",
          description:
            "Zapatillas premium para trekking en frío: agarre estable, protección resistente y una silueta sobria y técnica.",
        },
      },
      fr: {
        title: "Chaussures de Trekking — Stabilité Silencieuse",
        description:
          "Appui sûr pour les longues marches, avec une finition technique et discrète.",
        shortDescription:
          "Chaussures de trekking pensées pour le froid, la météo changeante et les longues journées en montagne.",
        longDescription: [
          "Équilibrées pour le trekking et les terrains d’hiver, elles combinent protection, adhérence et profil épuré pour un usage réel.",
          "La construction privilégie le confort longue distance tout en conservant une esthétique premium et sobre.",
          "Entretien : nettoyer avec un chiffon humide, sécher à l’air. Éviter la chaleur directe et l’humidité prolongée.",
          "Livraison gratuite incluse.",
        ],
        features: [
          "Protection thermique pour sentiers froids",
          "Tige résistante aux conditions de montagne",
          "Semelle intermédiaire stable pour la distance",
          "Semelle externe à forte adhérence",
          "Construction durable et discrète",
        ],
        seo: {
          title: "Chaussures de Trekking d’Hiver | Go Natural",
          description:
            "Chaussures premium pour trekking hivernal : adhérence sûre, protection durable et silhouette sobre et technique.",
        },
      },
      it: {
        title: "Scarpe da Trekking — Stabilità Silenziosa",
        description:
          "Appoggio stabile per lunghe percorrenze, con finitura tecnica e discreta.",
        shortDescription:
          "Scarpe da trekking pensate per freddo, meteo variabile e lunghe giornate in montagna.",
        longDescription: [
          "Bilanciate per trekking e terreni invernali, uniscono protezione, grip e un profilo pulito adatto all’uso reale.",
          "La costruzione sostiene il comfort sulle lunghe distanze mantenendo un’estetica premium e sobria.",
          "Cura: pulire con panno umido, asciugare all’aria. Evitare calore diretto e saturazione prolungata.",
          "Spedizione gratuita inclusa.",
        ],
        features: [
          "Protezione termica per sentieri freddi",
          "Tomaia resistente alle condizioni di montagna",
          "Intersuola stabile per lunghe distanze",
          "Suola ad alta trazione su terreni misti",
          "Costruzione durevole e discreta",
        ],
        seo: {
          title: "Scarpe da Trekking Invernali | Go Natural",
          description:
            "Scarpe premium per trekking invernale con grip stabile, protezione resistente e profilo sobrio e tecnico.",
        },
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "black",
        options: [
          { value: "black", label: "Black", priceModifier: 0 },
          { value: "gold", label: "Gold", priceModifier: 0 },
          { value: "grey", label: "Grey", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño",
        default: "42",
        options: [
          { value: "40", label: "40", priceModifier: 0 },
          { value: "41", label: "41", priceModifier: 0 },
          { value: "42", label: "42", priceModifier: 0 },
          { value: "43", label: "43", priceModifier: 0 },
          { value: "44", label: "44", priceModifier: 0 },
          { value: "45", label: "45", priceModifier: 0 },
          { value: "46", label: "46", priceModifier: 0 },
          { value: "47", label: "47", priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: "gn-outdoor-shoes-002",
    slug: "gn-outdoor-shoes-002",
    title: "Trekking Shoes — Steady Long-Distance Comfort",
    price: 59.79,
    category: "Outdoor & Adventure",
    images: [
      "/assets/images/products/gn-outdoor-shoes-002/featured.webp"
    ],
    description:
      "Comfort and stability designed for long walks and honest trail use.",
    shortDescription:
      "Trekking shoes built for steady grip, calm support, and long days outside.",
    longDescription: [
      "Designed for real trekking, this pair balances comfort, traction, and a sober silhouette that holds up to long distances.",
      "The upper protects against cold and changing conditions while keeping a clean, functional feel on the trail.",
      "Care: wipe clean, air dry. Avoid direct heat and prolonged saturation.",
      "Free shipping included.",
    ],
    features: [
      "Stable comfort for long walks",
      "Reliable traction on mixed terrain",
      "Weather-ready upper for cold conditions",
      "Supportive fit without excess bulk",
      "Durable build with a quiet finish",
    ],
    freeShipping: true,
    translations: {
      en: {
        title: "Trekking Shoes — Steady Long-Distance Comfort",
        description:
          "Comfort and stability designed for long walks and honest trail use.",
        shortDescription:
          "Trekking shoes built for steady grip, calm support, and long days outside.",
        longDescription: [
          "Designed for real trekking, this pair balances comfort, traction, and a sober silhouette that holds up to long distances.",
          "The upper protects against cold and changing conditions while keeping a clean, functional feel on the trail.",
          "Care: wipe clean, air dry. Avoid direct heat and prolonged saturation.",
          "Free shipping included.",
        ],
        features: [
          "Stable comfort for long walks",
          "Reliable traction on mixed terrain",
          "Weather-ready upper for cold conditions",
          "Supportive fit without excess bulk",
          "Durable build with a quiet finish",
        ],
        seo: {
          title: "Trekking Shoes for Long Walks | Go Natural",
          description:
            "Premium trekking shoes for long-distance comfort, steady grip, and real trail use in changing outdoor conditions.",
        },
      },
      es: {
        title: "Zapatillas de Trekking — Confort para Largas Distancias",
        description:
          "Confort y estabilidad pensados para caminatas largas y uso real en sendero.",
        shortDescription:
          "Zapatillas de trekking con agarre seguro, soporte calmo y jornadas largas al aire libre.",
        longDescription: [
          "Pensadas para trekking real, equilibran comodidad, tracción y una silueta sobria que acompaña largas distancias.",
          "El upper protege frente al frío y al clima variable con un enfoque funcional y discreto.",
          "Cuidado: limpiar con paño húmedo y secar al aire. Evitar calor directo y saturación prolongada.",
          "Envío gratis incluido.",
        ],
        features: [
          "Confort estable para caminatas largas",
          "Tracción confiable en terreno mixto",
          "Upper preparado para clima frío",
          "Calce firme sin exceso de volumen",
          "Construcción durable y silenciosa",
        ],
        seo: {
          title: "Zapatillas de Trekking para Caminatas Largas | Go Natural",
          description:
            "Zapatillas premium para trekking con confort prolongado, agarre seguro y uso real en condiciones cambiantes.",
        },
      },
      fr: {
        title: "Chaussures de Trekking — Confort Longue Distance",
        description:
          "Confort et stabilité pensés pour les longues marches et l’usage réel sur sentier.",
        shortDescription:
          "Chaussures de trekking avec adhérence sûre, soutien discret et longues journées dehors.",
        longDescription: [
          "Conçues pour le trekking réel, elles équilibrent confort, adhérence et silhouette sobre adaptée aux longues distances.",
          "La tige protège du froid et des variations météo avec une approche fonctionnelle et discrète.",
          "Entretien : nettoyer avec un chiffon humide, sécher à l’air. Éviter la chaleur directe et l’humidité prolongée.",
          "Livraison gratuite incluse.",
        ],
        features: [
          "Confort stable pour longues marches",
          "Adhérence fiable sur terrain mixte",
          "Tige prête pour le froid",
          "Maintien sûr sans volume excessif",
          "Construction durable et discrète",
        ],
        seo: {
          title: "Chaussures de Trekking Longue Distance | Go Natural",
          description:
            "Chaussures premium pour trekking avec confort prolongé, adhérence sûre et usage réel en conditions changeantes.",
        },
      },
      it: {
        title: "Scarpe da Trekking — Comfort per Lunghe Distanze",
        description:
          "Comfort e stabilità pensati per camminate lunghe e uso reale sui sentieri.",
        shortDescription:
          "Scarpe da trekking con trazione sicura, supporto discreto e lunghe giornate all’aperto.",
        longDescription: [
          "Progettate per il trekking reale, bilanciano comfort, grip e una linea sobria adatta alle lunghe distanze.",
          "La tomaia protegge dal freddo e dai cambi meteo con un approccio funzionale e discreto.",
          "Cura: pulire con panno umido, asciugare all’aria. Evitare calore diretto e saturazione prolungata.",
          "Spedizione gratuita inclusa.",
        ],
        features: [
          "Comfort stabile per camminate lunghe",
          "Trazione affidabile su terreno misto",
          "Tomaia pronta per il freddo",
          "Calzata sicura senza volume eccessivo",
          "Costruzione durevole e discreta",
        ],
        seo: {
          title: "Scarpe da Trekking per Lunghe Distanze | Go Natural",
          description:
            "Scarpe premium da trekking con comfort prolungato, grip sicuro e uso reale in condizioni variabili.",
        },
      },
    },
    variants: [
      {
        type: "color",
        label: "Color",
        default: "black",
        options: [
          { value: "black", label: "Black", priceModifier: 0 },
          { value: "light-brown", label: "Light Brown", priceModifier: 0 },
          { value: "grey", label: "Grey", priceModifier: 0 },
          { value: "green", label: "Green", priceModifier: 0 },
        ],
      },
      {
        type: "size",
        label: "Tamaño",
        default: "42",
        options: [
          { value: "40", label: "40", priceModifier: 0 },
          { value: "41", label: "41", priceModifier: 0 },
          { value: "42", label: "42", priceModifier: 0 },
          { value: "43", label: "43", priceModifier: 0 },
          { value: "44", label: "44", priceModifier: 0 },
          { value: "45", label: "45", priceModifier: 0 },
        ],
      },
    ],
  },
  // ===== WATER SPORTS - DIVING & SWIMMING EQUIPMENT =====
  {
    id: "gn-water-001",
    title: "Máscara de Snorkel Full Face con Soporte para Cámara",
    price: 19.90,
    category: "Diving & Swimming Equipment",
    images: [
      "/assets/images/products/gn-water-001/black/featured.webp",
    ],
    description:
      "Máscara full face diseñada para snorkel y natación recreativa, con visión panorámica 180°, sistema antiempañamiento y soporte desmontable para cámara.",
    features: [
      "Visión panorámica 180°",
      "Sistema antiempañamiento",
      "Sistema antifugas",
      "Soporte para cámara desmontable",
      "Sellado en silicona médica",
      "Talla: L/XL",
      "Color: Negro",
      "Unisex - Adultos",
    ],
    translations: {
      en: {
        title: "Full Face Snorkel Mask with Camera Mount",
        description:
          "Full face mask for snorkeling and recreational swimming with 180° panoramic view, anti-fog system, and removable camera mount.",
        features: [
          "180° panoramic view",
          "Anti-fog system",
          "Anti-leak system",
          "Removable camera mount",
          "Medical-grade silicone seal",
          "Size: L/XL",
          "Color: Black",
          "Unisex - Adults",
        ],
      },
      es: {
        title: "Máscara de Snorkel Full Face con Soporte para Cámara",
        description:
          "Máscara full face diseñada para snorkel y natación recreativa, con visión panorámica 180°, sistema antiempañamiento y soporte desmontable para cámara.",
        features: [
          "Visión panorámica 180°",
          "Sistema antiempañamiento",
          "Sistema antifugas",
          "Soporte para cámara desmontable",
          "Sellado en silicona médica",
          "Talla: L/XL",
          "Color: Negro",
          "Unisex - Adultos",
        ],
      },
      fr: {
        title: "Masque de snorkeling intégral avec support caméra",
        description:
          "Masque intégral pour snorkeling et nage récréative avec vision panoramique 180°, système antibuée et support caméra amovible.",
        features: [
          "Vision panoramique 180°",
          "Système antibuée",
          "Système anti-fuite",
          "Support caméra amovible",
          "Joint en silicone médical",
          "Taille : L/XL",
          "Couleur : Noir",
          "Unisexe - Adultes",
        ],
      },
      it: {
        title: "Maschera snorkeling full face con supporto per camera",
        description:
          "Maschera full face per snorkeling e nuoto ricreativo con visione panoramica 180°, sistema antiappannamento e supporto camera removibile.",
        features: [
          "Visione panoramica 180°",
          "Sistema antiappannamento",
          "Sistema anti-perdita",
          "Supporto camera removibile",
          "Guarnizione in silicone medicale",
          "Taglia: L/XL",
          "Colore: Nero",
          "Unisex - Adulti",
        ],
      },
    },
    variants: {
      type: "color",
      label: "Color",
      default: "blue",
      options: [
        { value: "black", label: "Negro" },
        { value: "blue", label: "Azul" },
        { value: "pink", label: "Rosa" },
      ],
    },
  },
  {
    id: "gn-water-002",
    title: "Calcetines de Agua de Neopreno 3 mm",
    price: 15.99,
    category: "Diving & Swimming Equipment",
    images: [
      "/assets/images/products/gn-water-002/featured.webp"
    ],
    description:
      "Calcetines de neopreno 3 mm para protección térmica y antideslizante en deportes acuáticos.",
    features: [
      "Neopreno 3 mm",
      "Protección térmica media",
      "Suela antideslizante",
      "Diseño flexible",
      "Tallas disponibles: S, M, L, XL",
      "Color: Negro",
      "Unisex",
    ],
    translations: {
      en: {
        title: "3 mm Neoprene Water Socks",
        description:
          "3 mm neoprene socks for thermal protection and anti-slip grip in water sports.",
        features: [
          "3 mm neoprene",
          "Medium thermal protection",
          "Anti-slip sole",
          "Flexible design",
          "Sizes: S, M, L, XL",
          "Color: Black",
          "Unisex",
        ],
      },
      es: {
        title: "Calcetines de Agua de Neopreno 3 mm",
        description:
          "Calcetines de neopreno 3 mm para protección térmica y antideslizante en deportes acuáticos.",
        features: [
          "Neopreno 3 mm",
          "Protección térmica media",
          "Suela antideslizante",
          "Diseño flexible",
          "Tallas disponibles: S, M, L, XL",
          "Color: Negro",
          "Unisex",
        ],
      },
      fr: {
        title: "Chaussettes d’eau en néoprène 3 mm",
        description:
          "Chaussettes en néoprène 3 mm pour protection thermique et semelle antidérapante en sports nautiques.",
        features: [
          "Néoprène 3 mm",
          "Protection thermique moyenne",
          "Semelle antidérapante",
          "Design flexible",
          "Tailles : S, M, L, XL",
          "Couleur : Noir",
          "Unisexe",
        ],
      },
      it: {
        title: "Calze d’acqua in neoprene 3 mm",
        description:
          "Calze in neoprene 3 mm per protezione termica e grip antiscivolo negli sport acquatici.",
        features: [
          "Neoprene 3 mm",
          "Protezione termica media",
          "Suola antiscivolo",
          "Design flessibile",
          "Taglie: S, M, L, XL",
          "Colore: Nero",
          "Unisex",
        ],
      },
    },
    variants: {
      type: "size",
      label: "Tamaño",
      default: "L",
      options: [
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "XXL", label: "XXL" },
      ],
    },
  },
  {
    id: "gn-water-003",
    title: "Guantes de Buceo de Neopreno 3 mm",
    price: 12.99 ,
    category: "Diving & Swimming Equipment",
    images: [
      "/assets/images/products/gn-water-003/image.webp"
    ],
    description:
      "Guantes de neopreno 3 mm diseñados para buceo, snorkel y kayak, con protección térmica y resistencia al corte.",
    features: [
      "Neopreno 3 mm",
      "Resistencia al corte",
      "Ajuste con velcro",
      "Buen agarre",
      "Tallas disponibles: S, M, L, XL",
      "Color: Negro",
      "Unisex",
    ],
    translations: {
      en: {
        title: "3 mm Neoprene Diving Gloves",
        description:
          "3 mm neoprene gloves designed for diving, snorkeling, and kayaking with thermal protection and cut resistance.",
        features: [
          "3 mm neoprene",
          "Cut resistance",
          "Velcro adjustment",
          "Good grip",
          "Sizes: S, M, L, XL",
          "Color: Black",
          "Unisex",
        ],
      },
      es: {
        title: "Guantes de Buceo de Neopreno 3 mm",
        description:
          "Guantes de neopreno 3 mm diseñados para buceo, snorkel y kayak, con protección térmica y resistencia al corte.",
        features: [
          "Neopreno 3 mm",
          "Resistencia al corte",
          "Ajuste con velcro",
          "Buen agarre",
          "Tallas disponibles: S, M, L, XL",
          "Color: Negro",
          "Unisex",
        ],
      },
      fr: {
        title: "Gants de plongée en néoprène 3 mm",
        description:
          "Gants en néoprène 3 mm pour plongée, snorkeling et kayak, avec protection thermique et résistance aux coupures.",
        features: [
          "Néoprène 3 mm",
          "Résistance aux coupures",
          "Ajustement velcro",
          "Bonne prise",
          "Tailles : S, M, L, XL",
          "Couleur : Noir",
          "Unisexe",
        ],
      },
      it: {
        title: "Guanti da immersione in neoprene 3 mm",
        description:
          "Guanti in neoprene 3 mm per immersioni, snorkeling e kayak con protezione termica e resistenza al taglio.",
        features: [
          "Neoprene 3 mm",
          "Resistenza al taglio",
          "Chiusura in velcro",
          "Buona presa",
          "Taglie: S, M, L, XL",
          "Colore: Nero",
          "Unisex",
        ],
      },
    },
    variants: {
      type: "size",
      label: "Tamaño",
      default: "XL",
      options: [
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
      ],
    },
  },
  {
    id: "gn-water-004",
    title: "Aletas de Snorkel Ajustables de Viaje",
    price: 39.90,
    category: "Diving & Swimming Equipment",
    images: [
        "/assets/images/products/gn-water-004/turquesa/featured.webp"
    ],
    description:
      "Aletas ajustables compactas, ideales para snorkel y viajes, compatibles con botines.",
    features: [
      "Talón abierto ajustable",
      "Uso con botines",
      "Diseño compacto de viaje",
      "Incluye bolsa",
      "Tallas: S/M, L/XL",
      "Colores: Azul, Negro, Verde, Rosa, Gris",
      "Unisex",
    ],
    translations: {
      en: {
        title: "Adjustable Travel Snorkel Fins",
        description:
          "Compact adjustable fins, ideal for snorkeling and travel, compatible with booties.",
        features: [
          "Adjustable open-heel",
          "Use with booties",
          "Compact travel design",
          "Includes bag",
          "Sizes: S/M, L/XL",
          "Colors: Blue, Black, Green, Pink, Gray",
          "Unisex",
        ],
      },
      es: {
        title: "Aletas de Snorkel Ajustables de Viaje",
        description:
          "Aletas ajustables compactas, ideales para snorkel y viajes, compatibles con botines.",
        features: [
          "Talón abierto ajustable",
          "Uso con botines",
          "Diseño compacto de viaje",
          "Incluye bolsa",
          "Tallas: S/M, L/XL",
          "Colores: Azul, Negro, Verde, Rosa, Gris",
          "Unisex",
        ],
      },
      fr: {
        title: "Palmes de snorkeling réglables de voyage",
        description:
          "Palmes réglables compactes, idéales pour le snorkeling et le voyage, compatibles avec des chaussons.",
        features: [
          "Talon ouvert réglable",
          "Utilisation avec chaussons",
          "Design compact de voyage",
          "Sac inclus",
          "Tailles : S/M, L/XL",
          "Couleurs : Bleu, Noir, Vert, Rose, Gris",
          "Unisexe",
        ],
      },
      it: {
        title: "Pinne da snorkeling da viaggio regolabili",
        description:
          "Pinne regolabili compatte, ideali per snorkeling e viaggio, compatibili con calzari.",
        features: [
          "Tallone aperto regolabile",
          "Uso con calzari",
          "Design compatto da viaggio",
          "Borsa inclusa",
          "Taglie: S/M, L/XL",
          "Colori: Blu, Nero, Verde, Rosa, Grigio",
          "Unisex",
        ],
      },
    },
    variants: {
      type: "color",
      label: "Color",
      default: "gris",
      options: [
        { value: "gris", label: "Gris" },
        { value: "azul", label: "Azul" },
        { value: "turquesa", label: "Turquesa" },
        { value: "blanco", label: "Blanco" },
        { value: "rosa", label: "Rosa" },
        { value: "negro", label: "Negro" },
      ],
    },
  },
  {
    id: "gn-water-006",
    title: "Mochila / Bolsa Seca Impermeable PVC",
    price: 35.90,
    category: "Diving & Swimming Equipment",
    images: [
        "/assets/images/products/gn-water-006/30l-green/image.webp"
    ],
    description:
      "Bolsa seca impermeable de PVC para deportes acuáticos y outdoor.",
    features: [
      "Impermeable",
      "Cierre enrollable",
      "Ligera y resistente",
      "Uso multipropósito",
      "Capacidades: 10 L, 20 L, 30 L",
      "Colores: Amarillo, Negro, Verde",
      "Unisex",
    ],
    translations: {
      en: {
        title: "PVC Waterproof Dry Bag / Backpack",
        description:
          "PVC waterproof dry bag for water sports and outdoor activities.",
        features: [
          "Waterproof",
          "Roll-top closure",
          "Lightweight and durable",
          "Multipurpose use",
          "Capacities: 10 L, 20 L, 30 L",
          "Colors: Yellow, Black, Green",
          "Unisex",
        ],
      },
      es: {
        title: "Mochila / Bolsa Seca Impermeable PVC",
        description:
          "Bolsa seca impermeable de PVC para deportes acuáticos y outdoor.",
        features: [
          "Impermeable",
          "Cierre enrollable",
          "Ligera y resistente",
          "Uso multipropósito",
          "Capacidades: 10 L, 20 L, 30 L",
          "Colores: Amarillo, Negro, Verde",
          "Unisex",
        ],
      },
      fr: {
        title: "Sac étanche PVC / sac à dos",
        description:
          "Sac étanche en PVC pour sports nautiques et activités outdoor.",
        features: [
          "Étanche",
          "Fermeture enroulable",
          "Léger et résistant",
          "Usage polyvalent",
          "Capacités : 10 L, 20 L, 30 L",
          "Couleurs : Jaune, Noir, Vert",
          "Unisexe",
        ],
      },
      it: {
        title: "Sacca stagna impermeabile in PVC / zaino",
        description:
          "Sacca stagna impermeabile in PVC per sport acquatici e outdoor.",
        features: [
          "Impermeabile",
          "Chiusura arrotolabile",
          "Leggera e resistente",
          "Uso multiuso",
          "Capacità: 10 L, 20 L, 30 L",
          "Colori: Giallo, Nero, Verde",
          "Unisex",
        ],
      },
    },
    variants: {
      type: "capacity_color",
      label: "Capacidad / Color",
      default: "10l-yellow",
      options: [
        { value: "10l-yellow", label: "10L Yellow" },
        { value: "10l-black", label: "10L Black" },
        { value: "20l-yellow", label: "20L Yellow" },
        { value: "20l-black", label: "20L Black" },
        { value: "30l-yellow", label: "30L Yellow" },
        { value: "30l-black", label: "30L Black" },
        { value: "30l-green", label: "30L Green" },
        { value: "40l-yellow", label: "40L Yellow" },
        { value: "40l-black", label: "40L Black" },
        { value: "40l-green", label: "40L Green" },
        { value: "40l-coffee", label: "40L Coffee" },
      ],
    },
  },
  {
    id: "gn-water-007",
    title: "TRIMIX Mini Scuba Tank 0.5L",
    price: 159.90,
    category: "Water & Exploration Gear",
    images: [
      "/assets/images/products/gn-water-007/image.webp"
    ],
    description:
      "Mini tanque de buceo TRIMIX de 0.5L para exploración costera controlada y momentos breves bajo el agua.",
    shortDescription:
      "Autonomía corta, controlada y segura para exploración de superficie. Equipo personal para uso recreativo responsable.",
    longDescription: [
      "Un mini tanque compacto pensado para respiraciones breves en exploración costera. Ideal para complementar snorkel avanzado y momentos de inmersión superficial.",
      "Uso recomendado en aguas tranquilas y poco profundas, con enfoque recreativo y controlado. No está diseñado para buceo profesional ni inmersiones prolongadas.",
      "Su tamaño prioriza portabilidad y facilidad de transporte, manteniendo una experiencia de uso clara y directa.",
      "Una herramienta personal para quienes buscan extender unos minutos la exploración bajo el agua con responsabilidad.",
    ],
    features: [
      "Capacidad real: 0.5L",
      "Autonomía breve para inmersión superficial",
      "Uso recomendado en poca profundidad",
      "Construcción resistente para entorno marino",
      "Formato compacto y portable",
    ],
    translations: {
      en: {
        title: "TRIMIX Mini Scuba Tank 0.5L",
        description:
          "0.5L TRIMIX mini scuba tank for controlled coastal exploration and brief moments underwater.",
        features: [
          "Real capacity: 0.5L",
          "Short autonomy for surface immersion",
          "Recommended for shallow depth",
          "Durable build for marine environment",
          "Compact and portable format",
        ],
      },
      es: {
        title: "TRIMIX Mini Scuba Tank 0.5L",
        description:
          "Mini tanque de buceo TRIMIX de 0.5L para exploración costera controlada y momentos breves bajo el agua.",
        features: [
          "Capacidad real: 0.5L",
          "Autonomía breve para inmersión superficial",
          "Uso recomendado en poca profundidad",
          "Construcción resistente para entorno marino",
          "Formato compacto y portable",
        ],
      },
      fr: {
        title: "Mini bouteille de plongée TRIMIX 0,5 L",
        description:
          "Mini bouteille TRIMIX de 0,5 L pour exploration côtière contrôlée et courtes immersions.",
        features: [
          "Capacité réelle : 0,5 L",
          "Autonomie courte pour immersion de surface",
          "Usage recommandé en faible profondeur",
          "Construction durable pour environnement marin",
          "Format compact et portable",
        ],
      },
      it: {
        title: "Mini bombola sub TRIMIX 0,5 L",
        description:
          "Mini bombola TRIMIX da 0,5 L per esplorazione costiera controllata e brevi immersioni.",
        features: [
          "Capacità reale: 0,5 L",
          "Autonomia breve per immersione superficiale",
          "Uso consigliato in basse profondità",
          "Struttura resistente per ambiente marino",
          "Formato compatto e portatile",
        ],
      },
    },
  },
  {
    id: "gn-water-008",
    title: "Kayak Inflable SUP 320 cm con Accesorios",
    price: 150.00,
    freeShipping: true,
    category: "Water & Exploration Gear",
    images: [
      "/assets/images/products/gn-water-008/image.webp",
      "/assets/images/products/gn-water-008/accessories.webp",
    ],
    description:
      "Kayak/SUP inflable de 320 cm en PVC ligero y resistente. Incluye set completo de accesorios para salir al agua de inmediato, con envio incluido en el precio.",
    shortDescription:
      "Tabla/kayak inflable 320 cm para deportes acuaticos con pack completo de accesorios y envio incluido.",
    longDescription: [
      "Disenado para uso recreativo en mar en calma, lagos y rios tranquilos, con estructura inflable estable y facil de transportar.",
      "Su formato de 320 cm ofrece buen equilibrio entre deslizamiento, maniobrabilidad y comodidad para sesiones de paseo o iniciacion.",
      "El producto llega listo para usar con un kit completo de accesorios, ideal para quienes buscan una opcion todo en uno.",
    ],
    features: [
      "Longitud: 320 cm (10.6 pies)",
      "Material: PVC ligero y resistente",
      "Uso recomendado: deportes acuaticos recreativos",
      "Envio incluido (precio final: 150 EUR)",
      "Incluye mochila de transporte",
      "Incluye bomba manual",
      "Incluye leash de seguridad (3 m)",
      "Incluye 3 quillas",
      "Incluye kit de reparacion",
      "Incluye pala de aluminio",
    ],
    translations: {
      en: {
        title: "320 cm Inflatable Kayak SUP with Accessories",
        description:
          "320 cm inflatable kayak/SUP in lightweight durable PVC. Includes a complete accessory set and shipping is included in the price.",
        features: [
          "Length: 320 cm (10.6 ft)",
          "Material: Lightweight durable PVC",
          "Recommended use: recreational watersports",
          "Shipping included (final price: EUR 150)",
          "Includes transport backpack",
          "Includes hand pump",
          "Includes safety leash (3 m)",
          "Includes 3 fins",
          "Includes repair kit",
          "Includes aluminum paddle",
        ],
      },
      es: {
        title: "Kayak Inflable SUP 320 cm con Accesorios",
        description:
          "Kayak/SUP inflable de 320 cm en PVC ligero y resistente. Incluye set completo de accesorios para salir al agua de inmediato, con envio incluido en el precio.",
        features: [
          "Longitud: 320 cm (10.6 pies)",
          "Material: PVC ligero y resistente",
          "Uso recomendado: deportes acuaticos recreativos",
          "Envio incluido (precio final: 150 EUR)",
          "Incluye mochila de transporte",
          "Incluye bomba manual",
          "Incluye leash de seguridad (3 m)",
          "Incluye 3 quillas",
          "Incluye kit de reparacion",
          "Incluye pala de aluminio",
        ],
      },
      fr: {
        title: "Kayak SUP gonflable 320 cm avec accessoires",
        description:
          "Kayak/SUP gonflable de 320 cm en PVC leger et resistant. Livré avec un kit complet d'accessoires, expedition incluse dans le prix.",
        features: [
          "Longueur : 320 cm (10,6 pieds)",
          "Materiau : PVC leger et resistant",
          "Usage recommande : sports nautiques recreatifs",
          "Expedition incluse (prix final : 150 EUR)",
          "Sac a dos de transport inclus",
          "Pompe manuelle incluse",
          "Leash de securite (3 m) inclus",
          "3 ailerons inclus",
          "Kit de reparation inclus",
          "Pagaie en aluminium incluse",
        ],
      },
      it: {
        title: "Kayak SUP gonfiabile 320 cm con accessori",
        description:
          "Kayak/SUP gonfiabile da 320 cm in PVC leggero e resistente. Include kit completo di accessori, spedizione inclusa nel prezzo.",
        features: [
          "Lunghezza: 320 cm (10,6 piedi)",
          "Materiale: PVC leggero e resistente",
          "Uso consigliato: sport acquatici ricreativi",
          "Spedizione inclusa (prezzo finale: 150 EUR)",
          "Zaino da trasporto incluso",
          "Pompa manuale inclusa",
          "Leash di sicurezza (3 m) incluso",
          "3 pinne incluse",
          "Kit di riparazione incluso",
          "Pagaia in alluminio inclusa",
        ],
      },
    },
  },
  // ===== OUTDOOR & ADVENTURE =====
  {
    id: "gn-camping-survival-001",
    title: "BISINNA Portable Ice Box (6L, 13.5L, 22L)",
    price: 50.00,
    category: "Camping & Survival Gear",
    images: [
      "/assets/images/products/gn-camping-survival-001/featured/featured.webp"
    ],
    description:
      "Conservación térmica compacta para travesías reales. Silenciosa, confiable, lista para salir.",
    shortDescription:
      "Caja térmica portátil BISINNA para campamentos y rutas largas. Frío estable, formato compacto.",
    longDescription: [
      "Diseñada para autonomía en salidas reales. Mantiene el frío cuando estás lejos de todo.",
      "Compacta y resistente, pensada para camping, overland, pesca y travesías con poco margen.",
      "Sin exceso. Solo la capacidad justa y el aislamiento que necesitás para seguir en ruta.",
    ],
    features: [
      "Aislamiento térmico estable para jornadas extendidas",
      "Formato portable para campamentos y travesías",
      "Estructura robusta para uso outdoor real",
      "Apertura simple y sellado confiable",
      "Pensada para carga compacta y transporte fácil",
    ],
    translations: {
      en: {
        title: "BISINNA Portable Ice Box (6L, 13.5L, 22L)",
        description:
          "Compact thermal storage for real trips. Quiet, reliable, ready to go.",
        features: [
          "Stable thermal insulation for long days",
          "Portable format for camps and overland trips",
          "Robust structure for real outdoor use",
          "Simple opening and reliable seal",
          "Built for compact loads and easy transport",
        ],
      },
      es: {
        title: "BISINNA Nevera Portátil (6L, 13.5L, 22L)",
        description:
          "Conservación térmica compacta para travesías reales. Silenciosa, confiable, lista para salir.",
        features: [
          "Aislamiento térmico estable para jornadas extendidas",
          "Formato portable para campamentos y travesías",
          "Estructura robusta para uso outdoor real",
          "Apertura simple y sellado confiable",
          "Pensada para carga compacta y transporte fácil",
        ],
      },
      fr: {
        title: "Glacière portable BISINNA (6 L, 13,5 L, 22 L)",
        description:
          "Conservation thermique compacte pour les vraies sorties. Silencieuse, fiable, prête à partir.",
        features: [
          "Isolation thermique stable pour de longues journées",
          "Format portable pour campings et expéditions",
          "Structure robuste pour un usage outdoor réel",
          "Ouverture simple et fermeture fiable",
          "Pensée pour une charge compacte et un transport facile",
        ],
      },
      it: {
        title: "Ghiacciaia portatile BISINNA (6L, 13,5L, 22L)",
        description:
          "Conservazione termica compatta per vere uscite. Silenziosa, affidabile, pronta a partire.",
        features: [
          "Isolamento termico stabile per giornate lunghe",
          "Formato portatile per campeggio e spedizioni",
          "Struttura robusta per uso outdoor reale",
          "Apertura semplice e chiusura affidabile",
          "Pensata per carico compatto e trasporto facile",
        ],
      },
    },
    variants: {
      type: "capacity",
      label: "Capacidad",
      default: "6L",
      options: [
        { value: "6L", label: "6L White", priceModifier: 0 },
        { value: "13.5L", label: "13.5L White", priceModifier: 12 },
        { value: "22L", label: "22L White", priceModifier: 22 },
      ],
    },
  },
  {
    id: "gn-camping-survival-002",
    title: "WIDESEA Portable Gas Stove (Gas Stove, With Adaptor, With Stable Support)",
    price: 24.90,
    category: "Camping & Survival Gear",
    images: [
      "/assets/images/products/gn-camping-survival-002/featured/featured.webp"
    ],
    description:
      "Hornillo portátil WIDESEA para cocina real en campamento. Control preciso, formato compacto.",
    shortDescription:
      "Cocina estable y segura en ruta. Un equipo esencial para travesías y campamento real.",
    longDescription: [
      "Diseñado para cocinar cuando el entorno manda. Encendido directo, control de llama y estabilidad en terreno variable.",
      "Formato portátil pensado para mochila, overland y campamento técnico. Se integra sin ocupar espacio crítico.",
      "Un equipo confiable para preparar comida caliente con poco margen y mucha exposición.",
    ],
    features: [
      "Control de llama preciso para cocción segura",
      "Estructura compacta y estable para terreno real",
      "Encendido rápido y operación simple",
      "Materiales resistentes a uso outdoor continuo",
      "Pensado para travesías, campamento y montaña",
    ],
    translations: {
      en: {
        title:
          "WIDESEA Portable Gas Stove (Gas Stove, With Adaptor, With Stable Support)",
        description:
          "Portable WIDESEA stove for real camp cooking. Precise control, compact format.",
        features: [
          "Precise flame control for safe cooking",
          "Compact and stable structure for real terrain",
          "Fast ignition and simple operation",
          "Materials resistant to continuous outdoor use",
          "Built for trips, camping, and mountains",
        ],
      },
      es: {
        title:
          "WIDESEA Hornillo Portátil (Hornillo, Con Adaptador, Con Soporte Estable)",
        description:
          "Hornillo portátil WIDESEA para cocina real en campamento. Control preciso, formato compacto.",
        features: [
          "Control de llama preciso para cocción segura",
          "Estructura compacta y estable para terreno real",
          "Encendido rápido y operación simple",
          "Materiales resistentes a uso outdoor continuo",
          "Pensado para travesías, campamento y montaña",
        ],
      },
      fr: {
        title:
          "Réchaud portable WIDESEA (réchaud, avec adaptateur, avec support stable)",
        description:
          "Réchaud portable WIDESEA pour une cuisine réelle au camp. Contrôle précis, format compact.",
        features: [
          "Contrôle précis de la flamme pour une cuisson sûre",
          "Structure compacte et stable pour terrain réel",
          "Allumage rapide et usage simple",
          "Matériaux résistants à l’usage outdoor continu",
          "Pensé pour les traversées, le camp et la montagne",
        ],
      },
      it: {
        title:
          "Fornello portatile WIDESEA (fornello, con adattatore, con supporto stabile)",
        description:
          "Fornello WIDESEA portatile per cucina reale in campeggio. Controllo preciso, formato compatto.",
        features: [
          "Controllo preciso della fiamma per cottura sicura",
          "Struttura compatta e stabile per terreno reale",
          "Accensione rapida e uso semplice",
          "Materiali resistenti all’uso outdoor continuo",
          "Pensato per traversate, campeggio e montagna",
        ],
      },
    },
    variants: {
      type: "configuration",
      label: "Configuración",
      default: "gas-stove",
      options: [
        { value: "gas-stove", label: "Gas stove", priceModifier: 0 },
        { value: "with-adaptor", label: "With adaptor", priceModifier: 0 },
        { value: "with-stable-support", label: "With stable support", priceModifier: 0 },
      ],
    },
  },
  {
    id: "gn-outdoor-001",
    title: "Tienda de Campaña Ultraligera 1–2 Personas (Económica)",
    price: 33.90,
    category: "Camping & Survival Gear",
    images: [
        "/assets/images/products/gn-outdoor-001/featured.webp"
    ],
    description:
      "Tienda de campaña compacta y ultraligera para camping y trekking, ideal para una o dos personas.",
    features: [
      "Capacidad: 1-2 personas",
      "Temporada: 3 estaciones",
      "Material: Poliéster + Fibra de vidrio",
      "Impermeabilidad: Sí",
      "Peso: <1.2 kg",
      "Compacta y fácil de montar",
    ],
    translations: {
      en: {
        title: "Ultralight Camping Tent 1–2 Person (Budget)",
        description:
          "Compact ultralight tent for camping and trekking, ideal for one or two people.",
        features: [
          "Capacity: 1–2 people",
          "Season: 3 seasons",
          "Material: Polyester + fiberglass",
          "Waterproof: Yes",
          "Weight: <1.2 kg",
          "Compact and easy to set up",
        ],
      },
      es: {
        title: "Tienda de Campaña Ultraligera 1–2 Personas (Económica)",
        description:
          "Tienda de campaña compacta y ultraligera para camping y trekking, ideal para una o dos personas.",
        features: [
          "Capacidad: 1-2 personas",
          "Temporada: 3 estaciones",
          "Material: Poliéster + Fibra de vidrio",
          "Impermeabilidad: Sí",
          "Peso: <1.2 kg",
          "Compacta y fácil de montar",
        ],
      },
      fr: {
        title: "Tente de camping ultralégère 1–2 personnes (économique)",
        description:
          "Tente compacte et ultralégère pour camping et trekking, idéale pour une ou deux personnes.",
        features: [
          "Capacité : 1–2 personnes",
          "Saison : 3 saisons",
          "Matériau : Polyester + fibre de verre",
          "Imperméable : Oui",
          "Poids : < 1,2 kg",
          "Compacte et facile à monter",
        ],
      },
      it: {
        title: "Tenda da campeggio ultraleggera 1–2 persone (economica)",
        description:
          "Tenda compatta e ultraleggera per campeggio e trekking, ideale per una o due persone.",
        features: [
          "Capacità: 1–2 persone",
          "Stagione: 3 stagioni",
          "Materiale: Poliestere + fibra di vetro",
          "Impermeabilità: Sì",
          "Peso: <1,2 kg",
          "Compatta e facile da montare",
        ],
      },
    },
    variants: {
      type: "capacity",
      label: "Capacidad",
      default: "one-person",
      options: [
        { value: "one-person", label: "Para una persona", priceModifier: 0 },
        { value: "two-person", label: "Para dos personas", priceModifier: 5 },
      ],
    },
  },
  {
    id: "gn-outdoor-002",
    title: "Tienda Naturehike Cloud Up (Premium)",
    price: 179.90,
    category: "Camping & Survival Gear",
    images: [
      "/assets/images/products/gn-outdoor-002/featured/featured.webp"
    ],
    description:
      "Tienda de campaña premium ultraligera diseñada para trekking y camping técnico en condiciones exigentes.",
    features: [
      "Capacidad: 1-3 personas",
      "Temporada: 4 estaciones",
      "Material: Nailon 20D + Aluminio",
      "Impermeabilidad: >3000 mm",
      "Peso: Ultraligero",
      "Diseño técnico premium",
    ],
    translations: {
      en: {
        title: "Naturehike Cloud Up Tent (Premium)",
        description:
          "Premium ultralight tent designed for trekking and technical camping in demanding conditions.",
        features: [
          "Capacity: 1–3 people",
          "Season: 4 seasons",
          "Material: 20D nylon + aluminum",
          "Waterproof: >3000 mm",
          "Weight: Ultralight",
          "Premium technical design",
        ],
      },
      es: {
        title: "Tienda Naturehike Cloud Up (Premium)",
        description:
          "Tienda de campaña premium ultraligera diseñada para trekking y camping técnico en condiciones exigentes.",
        features: [
          "Capacidad: 1-3 personas",
          "Temporada: 4 estaciones",
          "Material: Nailon 20D + Aluminio",
          "Impermeabilidad: >3000 mm",
          "Peso: Ultraligero",
          "Diseño técnico premium",
        ],
      },
      fr: {
        title: "Tente Naturehike Cloud Up (Premium)",
        description:
          "Tente premium ultralégère conçue pour le trekking et le camping technique en conditions exigeantes.",
        features: [
          "Capacité : 1–3 personnes",
          "Saison : 4 saisons",
          "Matériau : Nylon 20D + aluminium",
          "Imperméabilité : >3000 mm",
          "Poids : Ultraléger",
          "Design technique premium",
        ],
      },
      it: {
        title: "Tenda Naturehike Cloud Up (Premium)",
        description:
          "Tenda premium ultraleggera progettata per trekking e campeggio tecnico in condizioni impegnative.",
        features: [
          "Capacità: 1–3 persone",
          "Stagione: 4 stagioni",
          "Materiale: Nylon 20D + alluminio",
          "Impermeabilità: >3000 mm",
          "Peso: Ultralight",
          "Design tecnico premium",
        ],
      },
    },
  },
  {
    id: "gn-outdoor-003",
    title: "Linterna LED Táctica Recargable 2000 LM",
    price: 8.99,
    category: "Outdoor Lighting",
    images: [
        "/assets/images/products/gn-outdoor-003/image.webp"
    ],
    description:
      "Linterna LED táctica de alta potencia para camping, supervivencia y actividades nocturnas.",
    features: [
      "Potencia: 2000 lúmenes",
      "Zoom: Ajustable",
      "Recargable: USB",
      "Impermeable: Sí",
      "Modos: Alto / Medio / Bajo",
      "Diseño táctica resistente",
    ],
    translations: {
      en: {
        title: "Rechargeable Tactical LED Flashlight 2000 LM",
        description:
          "High-power tactical LED flashlight for camping, survival, and night activities.",
        features: [
          "Power: 2000 lumens",
          "Zoom: Adjustable",
          "Rechargeable: USB",
          "Waterproof: Yes",
          "Modes: High / Medium / Low",
          "Durable tactical design",
        ],
      },
      es: {
        title: "Linterna LED Táctica Recargable 2000 LM",
        description:
          "Linterna LED táctica de alta potencia para camping, supervivencia y actividades nocturnas.",
        features: [
          "Potencia: 2000 lúmenes",
          "Zoom: Ajustable",
          "Recargable: USB",
          "Impermeable: Sí",
          "Modos: Alto / Medio / Bajo",
          "Diseño táctica resistente",
        ],
      },
      fr: {
        title: "Lampe torche LED tactique rechargeable 2000 LM",
        description:
          "Lampe LED tactique haute puissance pour camping, survie et activités nocturnes.",
        features: [
          "Puissance : 2000 lumens",
          "Zoom : réglable",
          "Rechargeable : USB",
          "Étanche : Oui",
          "Modes : Haut / Moyen / Bas",
          "Design tactique robuste",
        ],
      },
      it: {
        title: "Torcia LED tattica ricaricabile 2000 LM",
        description:
          "Torcia LED tattica ad alta potenza per campeggio, sopravvivenza e attività notturne.",
        features: [
          "Potenza: 2000 lumen",
          "Zoom: regolabile",
          "Ricaricabile: USB",
          "Impermeabile: Sì",
          "Modalità: Alto / Medio / Basso",
          "Design tattico resistente",
        ],
      },
    },
  },
  {
    id: "gn-outdoor-005",
    title: "Cama Plegable de Camping 300 lb",
    price: 59.90,
    category: "Sleeping Systems",
    images: [
        "/assets/images/products/gn-outdoor-005/image1.webp"
    ],
    description:
      "Cama plegable resistente y cómoda para camping y aventuras outdoor.",
    features: [
      "Peso soportado: 150 kg",
      "Material: Aluminio + Oxford",
      "Plegable: Sí",
      "Uso: Camping / Trekking",
      "Cómoda y estable",
      "Fácil montaje",
    ],
    translations: {
      en: {
        title: "Folding Camping Bed 300 lb",
        description:
          "Durable and comfortable folding bed for camping and outdoor adventures.",
        features: [
          "Supported weight: 150 kg",
          "Material: Aluminum + Oxford",
          "Foldable: Yes",
          "Use: Camping / Trekking",
          "Comfortable and stable",
          "Easy setup",
        ],
      },
      es: {
        title: "Cama Plegable de Camping 300 lb",
        description:
          "Cama plegable resistente y cómoda para camping y aventuras outdoor.",
        features: [
          "Peso soportado: 150 kg",
          "Material: Aluminio + Oxford",
          "Plegable: Sí",
          "Uso: Camping / Trekking",
          "Cómoda y estable",
          "Fácil montaje",
        ],
      },
      fr: {
        title: "Lit de camping pliant 300 lb",
        description:
          "Lit pliant robuste et confortable pour le camping et les aventures outdoor.",
        features: [
          "Poids supporté : 150 kg",
          "Matériau : Aluminium + Oxford",
          "Pliable : Oui",
          "Usage : Camping / Trekking",
          "Confortable et stable",
          "Montage facile",
        ],
      },
      it: {
        title: "Letto da campeggio pieghevole 300 lb",
        description:
          "Letto pieghevole resistente e comodo per campeggio e avventure outdoor.",
        features: [
          "Peso supportato: 150 kg",
          "Materiale: Alluminio + Oxford",
          "Pieghevole: Sì",
          "Uso: Campeggio / Trekking",
          "Comodo e stabile",
          "Facile da montare",
        ],
      },
    },
    variants: {
      type: "color",
      label: "Color",
      default: "blanco",
      options: [
        { value: "blanco", label: "Blanco", priceModifier: 0 },
        { value: "verde", label: "Verde", priceModifier: 5 },
        { value: "negro", label: "Negro", priceModifier: 10 },
      ],
    },
  },
  {
    id: "gn-outdoor-007",
    title: "Saco de Dormir PACOONE (4 Estaciones)",
    price: 29.90,
    category: "Camping & Survival Gear",
    images: [
        "/assets/images/products/gn-outdoor-007/verde/image.webp"
    ],
    description:
      "Saco de dormir para camping, montaña e invierno. Diseñado para 4 estaciones con nivel térmico cálido.",
    features: [
      "Temporada: 4 estaciones",
      "Material: Algodón / fibra sintética",
      "Nivel térmico: Cálido",
      "Peso: Ligero",
      "Portátil: Sí",
      "Incluye bolsa de compresión: Sí",
    ],
    translations: {
      en: {
        title: "PACOONE Sleeping Bag (4 Seasons)",
        description:
          "Sleeping bag for camping, mountains, and winter. Designed for 4 seasons with warm thermal rating.",
        features: [
          "Season: 4 seasons",
          "Material: Cotton / synthetic fiber",
          "Thermal rating: Warm",
          "Weight: Lightweight",
          "Portable: Yes",
          "Compression bag included: Yes",
        ],
      },
      es: {
        title: "Saco de Dormir PACOONE (4 Estaciones)",
        description:
          "Saco de dormir para camping, montaña e invierno. Diseñado para 4 estaciones con nivel térmico cálido.",
        features: [
          "Temporada: 4 estaciones",
          "Material: Algodón / fibra sintética",
          "Nivel térmico: Cálido",
          "Peso: Ligero",
          "Portátil: Sí",
          "Incluye bolsa de compresión: Sí",
        ],
      },
      fr: {
        title: "Sac de couchage PACOONE (4 saisons)",
        description:
          "Sac de couchage pour camping, montagne et hiver. Conçu pour 4 saisons avec niveau thermique chaud.",
        features: [
          "Saison : 4 saisons",
          "Matériau : Coton / fibre synthétique",
          "Niveau thermique : Chaud",
          "Poids : Léger",
          "Portable : Oui",
          "Sac de compression inclus : Oui",
        ],
      },
      it: {
        title: "Sacco a pelo PACOONE (4 stagioni)",
        description:
          "Sacco a pelo per campeggio, montagna e inverno. Progettato per 4 stagioni con livello termico caldo.",
        features: [
          "Stagione: 4 stagioni",
          "Materiale: Cotone / fibra sintetica",
          "Livello termico: Caldo",
          "Peso: Leggero",
          "Portatile: Sì",
          "Sacca di compressione inclusa: Sì",
        ],
      },
    },
  },
  {
    id: "gn-outdoor-008",
    title: "Colchoneta / Colchón Inflable TARKA – Autoinflable",
    price: 31.90,
    category: "Camping & Survival Gear",
    images: [
      "/assets/images/products/gn-outdoor-008/camuflado/image.webp"
    ],
    description:
      "Colchoneta inflable autoinflable para trekking y camping ligero. Ultraligera y portátil.",
    features: [
      "Tipo: Colchoneta inflable",
      "Sistema: Autoinflable",
      "Material: Nylon + TPU",
      "Peso: Ultraligero",
      "Portátil: Sí",
      "Incluye bolsa: Sí",
    ],
    translations: {
      en: {
        title: "TARKA Self-Inflating Sleeping Pad",
        description:
          "Self-inflating sleeping pad for trekking and lightweight camping. Ultralight and portable.",
        features: [
          "Type: Inflatable pad",
          "System: Self-inflating",
          "Material: Nylon + TPU",
          "Weight: Ultralight",
          "Portable: Yes",
          "Bag included: Yes",
        ],
      },
      es: {
        title: "Colchoneta / Colchón Inflable TARKA – Autoinflable",
        description:
          "Colchoneta inflable autoinflable para trekking y camping ligero. Ultraligera y portátil.",
        features: [
          "Tipo: Colchoneta inflable",
          "Sistema: Autoinflable",
          "Material: Nylon + TPU",
          "Peso: Ultraligero",
          "Portátil: Sí",
          "Incluye bolsa: Sí",
        ],
      },
      fr: {
        title: "Matelas auto-gonflant TARKA",
        description:
          "Matelas auto-gonflant pour trekking et camping léger. Ultra-léger et portable.",
        features: [
          "Type : matelas gonflable",
          "Système : auto-gonflant",
          "Matériau : Nylon + TPU",
          "Poids : Ultra-léger",
          "Portable : Oui",
          "Sac inclus : Oui",
        ],
      },
      it: {
        title: "Materassino autogonfiante TARKA",
        description:
          "Materassino autogonfiante per trekking e campeggio leggero. Ultraleggero e portatile.",
        features: [
          "Tipo: materassino gonfiabile",
          "Sistema: autogonfiante",
          "Materiale: Nylon + TPU",
          "Peso: Ultraleggero",
          "Portatile: Sì",
          "Sacca inclusa: Sì",
        ],
      },
    },
  },
  {
    id: "gn-outdoor-009",
    title: "Nevera Portátil Rígida (25 L)",
    price: 195.90,
    category: "Camping & Survival Gear",
    images: [
        "/assets/images/products/gn-outdoor-009/image.webp"
    ],
    description:
      "Nevera portátil rígida para camping, picnic, pesca y playa. Alta retención térmica hasta 24-48 horas.",
    features: [
      "Capacidad: 25 L",
      "Aislamiento térmico: Alta retención",
      "Tiempo frío: 24–48 h",
      "Material: PP / PE / PU",
      "Portátil: Sí",
      "Uso: Outdoor / coche",
    ],
    translations: {
      en: {
        title: "Hard Cooler (25 L)",
        description:
          "Hard portable cooler for camping, picnic, fishing, and beach. High thermal retention up to 24–48 hours.",
        features: [
          "Capacity: 25 L",
          "Thermal insulation: High retention",
          "Cold time: 24–48 h",
          "Material: PP / PE / PU",
          "Portable: Yes",
          "Use: Outdoor / car",
        ],
      },
      es: {
        title: "Nevera Portátil Rígida (25 L)",
        description:
          "Nevera portátil rígida para camping, picnic, pesca y playa. Alta retención térmica hasta 24-48 horas.",
        features: [
          "Capacidad: 25 L",
          "Aislamiento térmico: Alta retención",
          "Tiempo frío: 24–48 h",
          "Material: PP / PE / PU",
          "Portátil: Sí",
          "Uso: Outdoor / coche",
        ],
      },
      fr: {
        title: "Glacière rigide portable (25 L)",
        description:
          "Glacière rigide portable pour camping, pique-nique, pêche et plage. Haute rétention thermique jusqu’à 24–48 h.",
        features: [
          "Capacité : 25 L",
          "Isolation thermique : haute rétention",
          "Durée du froid : 24–48 h",
          "Matériau : PP / PE / PU",
          "Portable : Oui",
          "Usage : Outdoor / voiture",
        ],
      },
      it: {
        title: "Ghiacciaia rigida portatile (25 L)",
        description:
          "Ghiacciaia rigida portatile per campeggio, picnic, pesca e spiaggia. Alta ritenzione termica fino a 24–48 ore.",
        features: [
          "Capacità: 25 L",
          "Isolamento termico: alta ritenzione",
          "Tempo di freddo: 24–48 h",
          "Materiale: PP / PE / PU",
          "Portatile: Sì",
          "Uso: Outdoor / auto",
        ],
      },
    },
    variants: {
      type: "color",
      label: "Color",
      default: "white",
      options: [
        { value: "white", label: "White", priceModifier: 0 },
        { value: "sand", label: "Sand", priceModifier: 0 },
        { value: "black", label: "Black", priceModifier: 0 },
      ],
    },
  },
  {
    id: "gn-outdoor-010",
    title: "Mochila Outdoor 50L Impermeable",
    price: 74.90,
    category: "Camping & Survival Gear",
    images: [
      "/assets/images/products/gn-outdoor-010/blue.webp"
    ],
    description:
      "Mochila técnica de 50L para travesías largas. Impermeable, estable y pensada para carga real.",
    shortDescription:
      "Capacidad real para viajes largos y climas variables. Equipo confiable para trekking y campamento.",
    longDescription: [
      "Intro editorial: Una mochila hecha para caminar lejos. Silenciosa, sólida, preparada para días seguidos de ruta.",
      "Pensada para travesías prolongadas: 50L que equilibran espacio y movilidad en trekking, camping y viajes largos.",
      "Uso en climas variables: material impermeable para lluvia, barro y nieve ligera sin comprometer el equipo.",
      "Autonomía y orden: acceso claro, bolsillos útiles y distribución que mantiene el peso estable.",
      "Diseño & funcionalidad: estructura ergonómica con carga repartida para mantener ritmo constante.",
      "Capacidad 50L: volumen real para equipo esencial y capas de abrigo.",
      "Distribución de carga: soporte pensado para peso sostenido en jornadas largas.",
      "Accesos y bolsillos: organización simple para mover sin detener el flujo.",
      "Protección: material impermeable y cierre confiable para exposición continua.",
      "Escenarios de uso: montaña, senderos largos, camping base, viajes de exploración.",
    ],
    features: [
      "Capacidad real 50L para cargas prolongadas",
      "Material impermeable para clima variable",
      "Diseño ergonómico y estable en marcha",
      "Distribución de peso optimizada",
      "Uso multi-entorno en trekking y camping",
      "Preparada para travesías de varios días",
    ],
    translations: {
      en: {
        title: "Waterproof Outdoor Backpack 50L",
        description:
          "50L technical backpack for long trips. Waterproof, stable, and built for real loads.",
        features: [
          "True 50L capacity for extended loads",
          "Waterproof material for variable weather",
          "Ergonomic and stable design on the move",
          "Optimized weight distribution",
          "Multi-environment use for trekking and camping",
          "Ready for multi-day trips",
        ],
      },
      es: {
        title: "Mochila Outdoor 50L Impermeable",
        description:
          "Mochila técnica de 50L para travesías largas. Impermeable, estable y pensada para carga real.",
        features: [
          "Capacidad real 50L para cargas prolongadas",
          "Material impermeable para clima variable",
          "Diseño ergonómico y estable en marcha",
          "Distribución de peso optimizada",
          "Uso multi-entorno en trekking y camping",
          "Preparada para travesías de varios días",
        ],
      },
      fr: {
        title: "Sac à dos outdoor 50 L imperméable",
        description:
          "Sac à dos technique 50 L pour longues traversées. Imperméable, stable et conçu pour la vraie charge.",
        features: [
          "Capacité réelle 50 L pour charges prolongées",
          "Matériau imperméable pour météo variable",
          "Design ergonomique et stable en marche",
          "Répartition du poids optimisée",
          "Usage multi-environnement en trekking et camping",
          "Prêt pour des traversées de plusieurs jours",
        ],
      },
      it: {
        title: "Zaino outdoor impermeabile 50 L",
        description:
          "Zaino tecnico da 50 L per traversate lunghe. Impermeabile, stabile e pensato per carichi reali.",
        features: [
          "Capacità reale 50 L per carichi prolungati",
          "Materiale impermeabile per clima variabile",
          "Design ergonomico e stabile in marcia",
          "Distribuzione del peso ottimizzata",
          "Uso multi-ambiente per trekking e campeggio",
          "Pronto per traversate di più giorni",
        ],
      },
    },
    variants: {
      type: "color",
      label: "Color",
      default: "black",
      options: [
        { value: "black", label: "Black" },
        { value: "blue", label: "Blue" },
        { value: "red", label: "Red" },
        { value: "orange", label: "Orange" },
        { value: "green", label: "Green" },
      ],
    },
  },
];

export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
