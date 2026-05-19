import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/products";

export type GoodIdeasProductCategory = "home" | "tech" | "lifestyle" | "gifts";

const GOOD_IDEAS_PRODUCTS: Product[] = [
  {
    id: "gi-tech-001",
    slug: "ai-robot-smart-toy-voice-recognition-kids",
    title: "AI Robot Smart Toy with Voice Recognition for Kids",
    price: 34.79,
    category: "Tech",
    images: [
      "/assets/images/products/gi-tech-001/image.webp",
      "/assets/images/products/gi-tech-001/gallery-1.webp",
      "/assets/images/products/gi-tech-001/gallery-2.webp",
      "/assets/images/products/gi-tech-001/gallery-3.webp",
      "/assets/images/products/gi-tech-001/gallery-4.webp",
    ],
    description:
      "A compact AI robot toy designed for children, with voice interaction, smart learning features, music, storytelling, and playful early-education moments. Fun, intelligent, and gift-ready for everyday discovery at home.",
    shortDescription:
      "An interactive AI robot toy for kids, designed for smart play, voice interaction, learning, music, and everyday fun.",
    longDescription: [
      "Meet a friendly AI robot built for curious kids who love to talk, listen, and play. With voice recognition and responsive interaction, it turns everyday moments into engaging conversations and imaginative discovery.",
      "Designed for early learning through play, it supports music, storytelling, and interactive routines that help children explore language, rhythm, and creativity in a natural way.",
      "Its compact, child-friendly body is easy to place on a desk, shelf, or play table, making it a versatile companion for quiet time, shared play, and family gifting.",
      "Parents appreciate a toy that feels premium and purposeful: smart enough to entertain, approachable enough for daily use, and thoughtful enough to give with confidence.",
      "Whether you are shopping for a birthday, holiday, or just-because surprise, this robot delivers a modern tech gift with warmth, personality, and hours of playful interaction.",
    ],
    features: [
      "Voice recognition interaction",
      "AI-inspired learning experience",
      "Music and storytelling modes",
      "Kid-friendly compact design",
      "Educational early learning toy",
      "Fun gift idea for children",
      "Rechargeable portable format for everyday play",
      "Designed for playful daily use at home",
    ],
    freeShipping: true,
    translations: {
      es: {
        title: "Robot inteligente AI con reconocimiento de voz para niños",
        description:
          "Robot compacto con interacción por voz, aprendizaje lúdico, música, cuentos y juego educativo temprano. Divertido, inteligente y perfecto para regalar.",
        shortDescription:
          "Robot AI interactivo para niños: juego inteligente, voz, aprendizaje, música y diversión diaria.",
        longDescription: [
          "Un robot amigable pensado para niños curiosos que disfrutan hablar, escuchar y jugar. Con reconocimiento de voz e interacción fluida, convierte el día a día en descubrimiento y conversación.",
          "Apoya el aprendizaje temprano mediante música, narración e interacción guiada para explorar lenguaje, ritmo y creatividad.",
          "Su diseño compacto encaja en escritorio, estantería o mesa de juego, ideal para momentos tranquilos, juego compartido y regalos familiares.",
          "Un juguete con estilo premium: entretenido, cercano y pensado para el uso diario en casa.",
          "Excelente opción de regalo con personalidad, tecnología accesible y horas de juego interactivo.",
        ],
        features: [
          "Interacción con reconocimiento de voz",
          "Experiencia de aprendizaje inspirada en AI",
          "Modos de música y narración",
          "Diseño compacto apto para niños",
          "Juguete educativo de estimulación temprana",
          "Idea de regalo divertida para niños",
          "Formato recargable y portátil",
          "Pensado para el uso lúdico diario",
        ],
      },
      fr: {
        title: "Robot intelligent AI avec reconnaissance vocale pour enfants",
        description:
          "Robot compact pour enfants avec interaction vocale, apprentissage ludique, musique, histoires et jeu éducatif. Intelligent, amusant et idéal en cadeau.",
        shortDescription:
          "Robot AI interactif pour enfants : jeu intelligent, voix, apprentissage, musique et plaisir au quotidien.",
        features: [
          "Interaction par reconnaissance vocale",
          "Expérience d'apprentissage inspirée de l'IA",
          "Modes musique et narration",
          "Design compact adapté aux enfants",
          "Jouet éducatif pour la petite enfance",
          "Idée cadeau ludique pour enfants",
          "Format rechargeable et portable",
          "Conçu pour un usage quotidien",
        ],
      },
      it: {
        title: "Robot intelligente AI con riconoscimento vocale per bambini",
        description:
          "Robot compatto per bambini con interazione vocale, apprendimento ludico, musica, storie e gioco educativo. Divertente, intelligente e perfetto come regalo.",
        shortDescription:
          "Robot AI interattivo per bambini: gioco smart, voce, apprendimento, musica e divertimento quotidiano.",
        features: [
          "Interazione con riconoscimento vocale",
          "Esperienza di apprendimento ispirata all'AI",
          "Modalità musica e storytelling",
          "Design compatto adatto ai bambini",
          "Giocattolo educativo per la prima infanzia",
          "Idea regalo divertente per bambini",
          "Formato ricaricabile e portatile",
          "Pensato per il gioco quotidiano",
        ],
      },
    },
  },
];

export function getGoodIdeasProducts(): Product[] {
  return GOOD_IDEAS_PRODUCTS;
}

export function getGoodIdeasProductById(id: string): Product | undefined {
  return GOOD_IDEAS_PRODUCTS.find((p) => p.id === id);
}

export function localizeGoodIdeasProduct(product: Product, locale: Locale): Product {
  const localized = product.translations?.[locale];
  return {
    ...product,
    title: localized?.title ?? product.title,
    description: localized?.description ?? product.description,
    shortDescription: localized?.shortDescription ?? product.shortDescription,
    longDescription: localized?.longDescription ?? product.longDescription,
    features: localized?.features ?? product.features,
  };
}

export function getGoodIdeasProductCopy(product: Product) {
  const benefits = product.features ?? [];
  return {
    useCase: product.shortDescription ?? product.description,
    whyBetter:
      "Designed for real home use with a premium feel, clear interaction, and everyday reliability parents can trust.",
    idealFor: ["Kids", "Parents", "Gifts", "Early learning"],
    benefits,
  };
}
