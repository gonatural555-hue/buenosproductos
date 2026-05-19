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



export function getGoodIdeasProductImagePaths(
  productId: string,
  galleryCount = 4
): string[] {
  const base = `${GOOD_IDEAS_IMAGE_BASE}/${productId}`;
  const paths = [`${base}/image.webp`];
  for (let i = 1; i <= galleryCount; i++) {
    paths.push(`${base}/gallery-${i}.webp`);
  }
  return paths;
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
    id: "gi-tech-002",
    slug: "gravity-car-phone-holder-air-vent",
    title: "Gravity Car Phone Holder for Air Vent",
    price: 2.69,
    category: "Tech",
    images: getGoodIdeasProductImagePaths("gi-tech-002", 5),
    description:
      "Gravity-style car phone holder mounted on the vehicle air vent, designed to hold a smartphone securely while driving with a simple automatic clamping mechanism. Hands-free navigation, easy one-hand placement, compact design, stable grip, and everyday driving convenience.",
    shortDescription:
      "Compact gravity car phone holder for air vents, designed for stable hands-free navigation, calls, and everyday driving.",
    longDescription: [
      "Drive with your phone securely in view and your hands freer for the wheel. This gravity car holder keeps navigation, calls, and alerts accessible without bulky mounts or complicated setup.",
      "A simple gravity clamp mechanism grips your smartphone automatically when you place it in the holder—easy one-hand placement when you get in the car.",
      "Air vent installation keeps the mount compact and out of the way, fitting cleanly into your car interior without taking up dashboard space.",
      "Stable smartphone support helps reduce wobble on everyday roads, so GPS and calls stay readable at a glance.",
      "A practical everyday driving accessory for commuters, delivery routes, and anyone who relies on navigation throughout the day.",
    ],
    features: [
      "Gravity clamp phone holder",
      "Air vent mounting design",
      "One-hand phone placement",
      "Stable grip while driving",
      "Compact car-friendly structure",
      "Suitable for GPS navigation and calls",
      "Universal smartphone compatibility positioning",
      "Practical everyday driving accessory",
    ],
    freeShipping: false,
    translations: {
      es: {
        title: "Soporte de gravedad para móvil en rejilla de aire",
        description:
          "Soporte de gravedad para coche con montaje en rejilla de ventilación. Sujeta el smartphone de forma segura al conducir con un mecanismo de sujeción automático. Manos libres, colocación con una mano y diseño compacto.",
        shortDescription:
          "Soporte compacto de gravedad para rejilla de aire, ideal para navegación manos libres, llamadas y conducción diaria.",
        longDescription: [
          "Conduce con el móvil a la vista y las manos más libres para el volante. Mantiene navegación, llamadas y alertas accesibles sin soportes voluminosos.",
          "El mecanismo de gravedad sujeta el smartphone al colocarlo—colocación sencilla con una mano al entrar al coche.",
          "Montaje en rejilla de aire: compacto y discreto en el interior del vehículo.",
          "Sujeción estable para que GPS y llamadas se lean de un vistazo en el día a día.",
          "Accesorio práctico para commuting, repartos y quien depende de la navegación a diario.",
        ],
        features: [
          "Soporte de gravedad para móvil",
          "Montaje en rejilla de aire",
          "Colocación del móvil con una mano",
          "Agarre estable al conducir",
          "Estructura compacta para el coche",
          "Apto para GPS y llamadas",
          "Posicionamiento de compatibilidad universal con smartphones",
          "Accesorio práctico para conducción diaria",
        ],
      },
      fr: {
        title: "Support téléphone gravité pour bouche d'aération",
        description:
          "Support voiture à gravité pour bouche d'aération, maintient le smartphone en conduite avec serrage automatique. Navigation mains libres, pose à une main, design compact.",
        shortDescription:
          "Support compact à gravité pour bouche d'aération, pour navigation stable, appels et conduite quotidienne.",
        features: [
          "Support téléphone à gravité",
          "Montage sur bouche d'aération",
          "Pose du téléphone à une main",
          "Prise stable en conduite",
          "Structure compacte pour la voiture",
          "Adapté GPS et appels",
          "Positionnement compatibilité smartphone universelle",
          "Accessoire pratique pour la conduite quotidienne",
        ],
      },
      it: {
        title: "Supporto auto a gravità per bocchetta aria",
        description:
          "Supporto auto a gravità per bocchetta dell'aria, tiene lo smartphone in sicurezza in guida con serraggio automatico. Navigazione hands-free, posa con una mano, design compatto.",
        shortDescription:
          "Supporto compatto a gravità per bocchetta aria, per navigazione stabile, chiamate e guida quotidiana.",
        features: [
          "Supporto telefono a gravità",
          "Montaggio su bocchetta aria",
          "Posizionamento con una mano",
          "Presa stabile in guida",
          "Struttura compatta per auto",
          "Adatto a GPS e chiamate",
          "Posizionamento compatibilità smartphone universale",
          "Accessorio pratico per la guida quotidiana",
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

  {
    id: "gi-lifestyle-002",
    slug: "lenovo-gm2-pro-bluetooth-gaming-earbuds",
    title: "Lenovo GM2 Pro Bluetooth 5.3 Gaming Wireless Earbuds",
    price: 10.71,
    category: "Lifestyle",
    images: getGoodIdeasProductImagePaths("gi-lifestyle-002", 5),
    description:
      "Lenovo GM2 Pro wireless gaming earbuds designed for music, gaming, calls, commuting, and daily lifestyle use. Bluetooth 5.3, low-latency game mode, dual HD calls, noise reduction microphone, compact charging case, and lightweight portable design.",
    shortDescription:
      "Bluetooth 5.3 gaming wireless earbuds with low-latency sound, dual HD call support, noise reduction, and a compact charging case.",
    longDescription: [
      "Level up your listening for gaming sessions and everyday music. The GM2 Pro wireless earbuds are built for responsive play, immersive stereo, and flexible use from desk to commute.",
      "Bluetooth 5.3 keeps your connection stable for music, mobile games, and streaming, with pairing that fits naturally into daily routines.",
      "Low-latency game mode helps sync sound with on-screen action, so gameplay feels tighter and more engaging on the go.",
      "Dual HD call support and a noise reduction microphone make conversations clearer, whether you are taking calls between matches or on the move.",
      "A compact charging case and lightweight ergonomic design make them easy to carry for travel, commuting, and everyday lifestyle listening.",
    ],
    features: [
      "Bluetooth 5.3 wireless connection",
      "Low-latency gaming mode",
      "Dual HD call support",
      "Noise reduction microphone",
      "Compact charging case",
      "Stereo sound for gaming and music",
      "Lightweight ergonomic earbud design",
      "Suitable for gaming, commuting, travel, and daily use",
    ],
    freeShipping: true,
    translations: {
      es: {
        title: "Auriculares gaming inalámbricos Lenovo GM2 Pro Bluetooth 5.3",
        description:
          "Auriculares inalámbricos Lenovo GM2 Pro para gaming, música, llamadas y uso diario. Bluetooth 5.3, modo juego de baja latencia, llamadas HD duales, micrófono con reducción de ruido y estuche compacto.",
        shortDescription:
          "Auriculares gaming inalámbricos Bluetooth 5.3 con sonido de baja latencia, llamadas HD duales, reducción de ruido y estuche de carga compacto.",
        longDescription: [
          "Mejora tu experiencia en partidas y música diaria. Los GM2 Pro están pensados para juego reactivo, sonido estéreo y uso flexible en casa o en movimiento.",
          "Bluetooth 5.3 mantiene una conexión estable para música, juegos móviles y streaming con emparejamiento sencillo.",
          "El modo juego de baja latencia ayuda a sincronizar el audio con la acción en pantalla para una experiencia más fluida.",
          "Llamadas HD duales y micrófono con reducción de ruido para conversaciones más claras entre partidas o en desplazamiento.",
          "Estuche compacto y diseño ergonómico ligero, ideales para viajes, commuting y escucha lifestyle diaria.",
        ],
        features: [
          "Conexión inalámbrica Bluetooth 5.3",
          "Modo gaming de baja latencia",
          "Soporte de llamadas HD duales",
          "Micrófono con reducción de ruido",
          "Estuche de carga compacto",
          "Sonido estéreo para gaming y música",
          "Diseño ergonómico ligero",
          "Apto para gaming, commuting, viajes y uso diario",
        ],
      },
      fr: {
        title: "Écouteurs gaming sans fil Lenovo GM2 Pro Bluetooth 5.3",
        description:
          "Écouteurs sans fil Lenovo GM2 Pro pour gaming, musique, appels et usage quotidien. Bluetooth 5.3, mode jeu faible latence, appels HD doubles, micro réduction de bruit et boîtier compact.",
        shortDescription:
          "Écouteurs gaming sans fil Bluetooth 5.3, son faible latence, appels HD doubles, réduction de bruit et boîtier de charge compact.",
        features: [
          "Connexion sans fil Bluetooth 5.3",
          "Mode gaming faible latence",
          "Support appels HD doubles",
          "Microphone à réduction de bruit",
          "Boîtier de charge compact",
          "Son stéréo pour gaming et musique",
          "Design ergonomique léger",
          "Adapté gaming, trajets, voyage et quotidien",
        ],
      },
      it: {
        title: "Auricolari gaming wireless Lenovo GM2 Pro Bluetooth 5.3",
        description:
          "Auricolari wireless Lenovo GM2 Pro per gaming, musica, chiamate e uso quotidiano. Bluetooth 5.3, modalità gioco a bassa latenza, chiamate HD duali, microfono con riduzione rumore e custodia compatta.",
        shortDescription:
          "Auricolari gaming wireless Bluetooth 5.3 con audio a bassa latenza, chiamate HD duali, riduzione rumore e custodia di ricarica compatta.",
        features: [
          "Connessione wireless Bluetooth 5.3",
          "Modalità gaming a bassa latenza",
          "Supporto chiamate HD duali",
          "Microfono con riduzione del rumore",
          "Custodia di ricarica compatta",
          "Audio stereo per gaming e musica",
          "Design ergonomico leggero",
          "Adatti a gaming, pendolarismo, viaggio e uso quotidiano",
        ],
      },
    },
  },
  {
    id: "gi-lifestyle-003",
    slug: "rechargeable-electric-nose-hair-trimmer-men",
    title: "Rechargeable Electric Nose Hair Trimmer for Men",
    price: 3.49,
    category: "Lifestyle",
    images: getGoodIdeasProductImagePaths("gi-lifestyle-003", 5),
    description:
      "Portable rechargeable electric nose hair trimmer designed for men's grooming. A compact tool for nose hair, eyebrow touch-ups, and precise facial trimming—with portability, rechargeable use, pocket-size body, protective cap, and simple daily grooming.",
    shortDescription:
      "Compact rechargeable electric trimmer for nose, eyebrow, and facial grooming, designed for quick daily touch-ups at home or on the go.",
    longDescription: [
      "Keep your grooming routine quick and effortless. This rechargeable electric trimmer is built for everyday personal care, from nose hair to eyebrow touch-ups and precise facial trimming.",
      "The portable rechargeable design means you can maintain a clean look at home or on the go without bulky tools or complicated setup.",
      "Designed for nose and eyebrow trimming, it helps you handle detail areas with control and a minimalist grooming routine that fits busy mornings.",
      "A compact pocket-size body and protective transparent cap make it easy to store in a bag, drawer, or travel kit.",
      "Simple daily maintenance and travel-friendly use make it a practical lightweight accessory for men who want a cleaner, more polished look in minutes.",
    ],
    features: [
      "Rechargeable electric grooming tool",
      "Designed for nose hair trimming",
      "Suitable for eyebrow touch-ups",
      "Compact pocket-size design",
      "Protective transparent cap",
      "Portable for travel and daily use",
      "Simple one-button operation",
      "Lightweight personal care accessory",
    ],
    freeShipping: false,
    translations: {
      es: {
        title: "Cortapelos eléctrico recargable para nariz y cejas",
        description:
          "Recortador eléctrico recargable y portátil para el cuidado masculino: vello nasal, retoques de cejas y recorte facial preciso. Compacto, con tapa protectora y uso diario sencillo.",
        shortDescription:
          "Recortador eléctrico recargable compacto para nariz, cejas y grooming facial, ideal para retoques rápidos en casa o de viaje.",
        longDescription: [
          "Mantén tu rutina de grooming rápida y sin complicaciones. Pensado para el cuidado diario: vello nasal, cejas y detalles faciales.",
          "Diseño recargable y portátil para usar en casa o fuera, sin herramientas voluminosas.",
          "Ayuda a trabajar zonas de detalle con control y una rutina minimalista que encaja en mañanas ocupadas.",
          "Cuerpo compacto de bolsillo y tapa protectora transparente para guardar en bolso, cajón o neceser.",
          "Mantenimiento sencillo y uso viajero: accesorio ligero para un aspecto más cuidado en minutos.",
        ],
        features: [
          "Herramienta eléctrica recargable de grooming",
          "Diseñada para vello nasal",
          "Apta para retoques de cejas",
          "Diseño compacto de bolsillo",
          "Tapa protectora transparente",
          "Portátil para viaje y uso diario",
          "Operación simple de un botón",
          "Accesorio ligero de cuidado personal",
        ],
      },
      fr: {
        title: "Tondeuse électrique rechargeable nez et sourcils homme",
        description:
          "Tondeuse électrique rechargeable portable pour le grooming masculin : poils du nez, retouches des sourcils et taille faciale précise. Compacte, capuchon protecteur, usage quotidien simple.",
        shortDescription:
          "Tondeuse électrique rechargeable compacte pour nez, sourcils et grooming facial, idéale pour les retouches rapides à domicile ou en déplacement.",
        features: [
          "Outil de grooming électrique rechargeable",
          "Conçu pour les poils du nez",
          "Adapté aux retouches des sourcils",
          "Design compact de poche",
          "Capuchon protecteur transparent",
          "Portable pour voyage et quotidien",
          "Fonctionnement simple à un bouton",
          "Accessoire léger de soins personnels",
        ],
      },
      it: {
        title: "Tagliacapelli elettrico ricaricabile per naso e sopracciglia",
        description:
          "Tagliacapelli elettrico ricaricabile portatile per la cura maschile: peli del naso, ritocchi sopracciglia e rifinitura facciale. Compatto, cappuccio protettivo, uso quotidiano semplice.",
        shortDescription:
          "Tagliacapelli elettrico ricaricabile compatto per naso, sopracciglia e grooming facciale, ideale per ritocchi rapidi a casa o in viaggio.",
        features: [
          "Strumento di grooming elettrico ricaricabile",
          "Progettato per peli del naso",
          "Adatto a ritocchi delle sopracciglia",
          "Design compatto tascabile",
          "Cappuccio protettivo trasparente",
          "Portatile per viaggio e uso quotidiano",
          "Funzionamento semplice a un pulsante",
          "Accessorio leggero per la cura personale",
        ],
      },
    },
  },
  {
    id: "gi-lifestyle-004",
    slug: "bluetooth-sleep-headband-wireless-earphones",
    title: "Bluetooth Sleep Headband Wireless Earphones",
    price: 4.19,
    category: "Lifestyle",
    images: getGoodIdeasProductImagePaths("gi-lifestyle-004", 5),
    description:
      "Wireless Bluetooth headband with integrated earphones, designed for sleeping, relaxing, sports, running, travel, and hands-free music listening. Soft stretch fabric, wireless audio, built-in control panel, comfortable fit, sleep-friendly design, and versatile everyday use.",
    shortDescription:
      "Soft Bluetooth sleep headband with built-in wireless earphones, designed for music, rest, workouts, travel, and comfortable daily use.",
    longDescription: [
      "Listen comfortably while you sleep, relax, or unwind. This Bluetooth sleep headband combines soft fabric with built-in wireless earphones for a cozy way to enjoy music, podcasts, or meditation without bulky headphones.",
      "Bluetooth wireless audio keeps your setup cable-free, with a stable connection for bedtime listening, light workouts, and everyday lifestyle use.",
      "Soft stretch fabric wraps gently around your head for a comfortable fit that works for rest, travel, and hands-free listening on the go.",
      "From running and light sports to flights and daily commutes, the headband design stays practical for movement while keeping audio close.",
      "An integrated control panel and lightweight everyday design make it easy to manage playback—ideal for wellness routines, relaxation, and sleep-friendly listening.",
    ],
    features: [
      "Bluetooth wireless audio",
      "Built-in stereo earphones",
      "Soft stretch fabric headband",
      "Comfortable for sleep and relaxation",
      "Suitable for running, workouts, and travel",
      "Integrated control panel",
      "Lightweight everyday design",
      "Ideal for music, podcasts, meditation, and rest",
    ],
    freeShipping: false,
    translations: {
      es: {
        title: "Diadema Bluetooth para dormir con auriculares inalámbricos",
        description:
          "Diadema Bluetooth inalámbrica con auriculares integrados para dormir, relajarse, deporte, running, viajes y música manos libres. Tejido suave elástico, audio inalámbrico, panel de control y diseño cómodo para el descanso.",
        shortDescription:
          "Diadema suave Bluetooth para dormir con auriculares inalámbricos integrados, ideal para música, descanso, entrenamientos, viajes y uso diario cómodo.",
        longDescription: [
          "Escucha con comodidad mientras duermes, descansas o te relajas. Combina tejido suave y auriculares inalámbricos integrados para música, podcasts o meditación sin auriculares voluminosos.",
          "Audio Bluetooth sin cables para escucha nocturna, entrenamientos ligeros y uso lifestyle diario.",
          "Tejido suave y elástico para un ajuste cómodo en reposo, viajes y escucha manos libres.",
          "Práctica para running, deporte ligero, vuelos y desplazamientos con el audio siempre cerca.",
          "Panel de control integrado y diseño ligero para gestionar la reproducción: ideal para bienestar, relajación y sueño.",
        ],
        features: [
          "Audio inalámbrico Bluetooth",
          "Auriculares estéreo integrados",
          "Diadema de tejido suave elástico",
          "Cómoda para dormir y relajarse",
          "Apta para running, entrenamientos y viajes",
          "Panel de control integrado",
          "Diseño ligero para el día a día",
          "Ideal para música, podcasts, meditación y descanso",
        ],
      },
      fr: {
        title: "Bandeau Bluetooth sommeil avec écouteurs sans fil",
        description:
          "Bandeau Bluetooth sans fil avec écouteurs intégrés pour dormir, se détendre, sport, course, voyage et musique mains libres. Tissu doux extensible, audio sans fil, commandes intégrées et confort au repos.",
        shortDescription:
          "Bandeau doux Bluetooth pour le sommeil avec écouteurs sans fil intégrés, pour musique, repos, entraînement, voyage et usage quotidien confortable.",
        features: [
          "Audio sans fil Bluetooth",
          "Écouteurs stéréo intégrés",
          "Bandeau en tissu doux extensible",
          "Confortable pour dormir et se détendre",
          "Adapté course, entraînement et voyage",
          "Panneau de commande intégré",
          "Design léger pour le quotidien",
          "Idéal musique, podcasts, méditation et repos",
        ],
      },
      it: {
        title: "Fascia Bluetooth per dormire con auricolari wireless",
        description:
          "Fascia Bluetooth wireless con auricolari integrati per dormire, rilassarsi, sport, corsa, viaggio e musica hands-free. Tessuto morbido elastico, audio wireless, pannello comandi e comfort per il riposo.",
        shortDescription:
          "Fascia morbida Bluetooth per il sonno con auricolari wireless integrati, per musica, riposo, allenamento, viaggio e uso quotidiano confortevole.",
        features: [
          "Audio wireless Bluetooth",
          "Auricolari stereo integrati",
          "Fascia in tessuto morbido elastico",
          "Comoda per sonno e relax",
          "Adatta a corsa, allenamento e viaggio",
          "Pannello comandi integrato",
          "Design leggero per tutti i giorni",
          "Ideale per musica, podcast, meditazione e riposo",
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


