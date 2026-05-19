import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/products";

export type GoodIdeasProductCategory =
  | "Hogar"
  | "Tech"
  | "Lifestyle"
  | "Regalos"
  | "home"
  | "tech"
  | "lifestyle"
  | "gifts";

/** Base de assets Good Ideas (separado de `public/assets/images/products/`). */
export const GOOD_IDEAS_IMAGE_BASE = "/assets/images/good-ideas-products";

export function getGoodIdeasProductImagePaths(productId: string): string[] {
  const base = `${GOOD_IDEAS_IMAGE_BASE}/${productId}`;
  return [
    `${base}/image.webp`,
    `${base}/gallery-1.webp`,
    `${base}/gallery-2.webp`,
    `${base}/gallery-3.webp`,
    `${base}/gallery-4.webp`,
  ];
}

function normalizeCategory(category: string): string {
  return category.trim().toLowerCase();
}

const GOOD_IDEAS_PRODUCTS: Product[] = [
  {
    id: "gi-tech-001",
    slug: "ai-robot-smart-toy-voice-recognition-kids",
    title: "AI Robot Smart Toy with Voice Recognition for Kids",
    price: 34.79,
    category: "Tech",
    images: getGoodIdeasProductImagePaths("gi-tech-001"),
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
  {
    id: "gi-lifestyle-001",
    slug: "lenovo-thinkplus-xt80-wireless-sports-earbuds",
    title: "Lenovo Thinkplus XT80 Wireless Sports Earbuds",
    price: 12.89,
    category: "Lifestyle",
    images: getGoodIdeasProductImagePaths("gi-lifestyle-001"),
    description:
      "Wireless sports earbuds designed for active daily use, workouts, commuting, music, calls, and portable listening. Bluetooth 5.3, LED digital battery display, ergonomic fit, compact charging case, and stereo sound.",
    shortDescription:
      "Wireless sports earbuds with Bluetooth 5.3, LED battery display, ergonomic fit, and compact charging case for everyday movement.",
    longDescription: [
      "Enjoy wireless listening built for workouts, commuting, and everyday movement. These sports earbuds keep your soundtrack close whether you are training, walking, or switching between tasks on the go.",
      "Bluetooth 5.3 delivers a stable wireless connection for music and calls, with pairing that feels simple enough for daily routines and travel days alike.",
      "The compact charging case includes an LED digital battery display, so you can see remaining power at a glance instead of guessing mid-commute or mid-session.",
      "An ergonomic sports fit is designed to stay comfortable during longer wear, with a lightweight profile that is easy to carry in a pocket or bag.",
      "From gym sessions to calls on the move, stereo sound and a lifestyle-ready design make them a practical pick for music, travel, and everyday listening.",
    ],
    features: [
      "Bluetooth 5.3 wireless connection",
      "LED digital battery display",
      "Ergonomic sports fit",
      "Compact charging case",
      "Stereo sound for music and calls",
      "Lightweight daily carry design",
      "Suitable for workouts, commuting, and travel",
      "Long battery life for extended listening sessions",
      "Easy everyday pairing",
    ],
    freeShipping: true,
    translations: {
      es: {
        title: "Auriculares deportivos inalámbricos Lenovo Thinkplus XT80",
        description:
          "Auriculares deportivos inalámbricos para uso activo diario, entrenamientos, desplazamientos, música y llamadas. Bluetooth 5.3, pantalla LED de batería, ajuste ergonómico, estuche compacto y sonido estéreo.",
        shortDescription:
          "Auriculares deportivos inalámbricos con Bluetooth 5.3, pantalla LED de batería, ajuste ergonómico y estuche de carga compacto para el día a día.",
        longDescription: [
          "Escucha sin cables pensada para entrenamientos, desplazamientos y movimiento diario. Mantén tu música cerca al entrenar, caminar o cambiar de actividad sobre la marcha.",
          "Bluetooth 5.3 ofrece una conexión estable para música y llamadas, con emparejamiento sencillo para rutinas cotidianas y viajes.",
          "El estuche de carga compacto incluye pantalla LED digital de batería para ver la autonomía restante de un vistazo.",
          "El ajuste ergonómico deportivo está pensado para mayor comodidad en sesiones largas, con un perfil ligero fácil de llevar.",
          "Desde el gimnasio hasta las llamadas en movimiento, el sonido estéreo y el diseño lifestyle los convierten en una opción práctica para música, viajes y uso diario.",
        ],
        features: [
          "Conexión inalámbrica Bluetooth 5.3",
          "Pantalla LED digital de batería",
          "Ajuste ergonómico deportivo",
          "Estuche de carga compacto",
          "Sonido estéreo para música y llamadas",
          "Diseño ligero para llevar a diario",
          "Apto para entrenamientos, desplazamientos y viajes",
          "Batería de larga duración para sesiones extendidas",
          "Emparejamiento fácil para el uso diario",
        ],
      },
      fr: {
        title: "Écouteurs sport sans fil Lenovo Thinkplus XT80",
        description:
          "Écouteurs sport sans fil pour usage actif quotidien, entraînement, trajets, musique et appels. Bluetooth 5.3, affichage LED de batterie, fit ergonomique, boîtier compact et son stéréo.",
        shortDescription:
          "Écouteurs sport sans fil Bluetooth 5.3, affichage LED de batterie, fit ergonomique et boîtier de charge compact pour le quotidien.",
        features: [
          "Connexion sans fil Bluetooth 5.3",
          "Affichage LED numérique de batterie",
          "Fit ergonomique sport",
          "Boîtier de charge compact",
          "Son stéréo pour musique et appels",
          "Design léger pour le quotidien",
          "Adapté entraînement, trajets et voyage",
          "Autonomie longue durée",
          "Appairage facile au quotidien",
        ],
      },
      it: {
        title: "Auricolari sport wireless Lenovo Thinkplus XT80",
        description:
          "Auricolari sport wireless per uso attivo quotidiano, allenamento, spostamenti, musica e chiamate. Bluetooth 5.3, display LED batteria, fit ergonomico, custodia compatta e audio stereo.",
        shortDescription:
          "Auricolari sport wireless con Bluetooth 5.3, display LED batteria, fit ergonomico e custodia di ricarica compatta per tutti i giorni.",
        features: [
          "Connessione wireless Bluetooth 5.3",
          "Display LED digitale della batteria",
          "Fit ergonomico sportivo",
          "Custodia di ricarica compatta",
          "Audio stereo per musica e chiamate",
          "Design leggero per l'uso quotidiano",
          "Adatti ad allenamento, pendolarismo e viaggio",
          "Lunga autonomia per sessioni prolungate",
          "Associazione facile per l'uso quotidiano",
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

export function getGoodIdeasProductsByCategory(category: string): Product[] {
  const target = normalizeCategory(category);
  return GOOD_IDEAS_PRODUCTS.filter(
    (p) => normalizeCategory(p.category) === target
  );
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
  const category = normalizeCategory(product.category);

  const idealForByCategory: Record<string, string[]> = {
    tech: ["Kids", "Parents", "Gifts", "Early learning"],
    lifestyle: ["Workouts", "Commuting", "Travel", "Music lovers"],
    hogar: ["Home", "Daily use", "Family", "Gifts"],
    regalos: ["Gifts", "Birthdays", "Holidays", "Surprises"],
  };

  const whyBetterByCategory: Record<string, string> = {
    tech:
      "Designed for real home use with a premium feel, clear interaction, and everyday reliability parents can trust.",
    lifestyle:
      "Built for active daily listening with stable wireless connection, visible battery status, and a comfortable sports fit you can carry anywhere.",
    hogar:
      "Thoughtful home essentials with practical design and everyday usability.",
    regalos: "Gift-ready products with clear value and everyday appeal.",
  };

  return {
    useCase: product.shortDescription ?? product.description,
    whyBetter:
      whyBetterByCategory[category] ??
      "Curated for everyday use with practical design and reliable performance.",
    idealFor: idealForByCategory[category] ?? ["Daily use", "Home", "Lifestyle"],
    benefits,
  };
}
