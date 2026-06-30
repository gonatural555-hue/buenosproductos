import type { Locale } from "@/lib/i18n/config";

import type { Product } from "@/lib/product-types";
import type { ProductVariants } from "@/lib/product-variants";
import { applyGoodIdeasDeliveryCopy } from "@/lib/good-ideas-delivery";



export type GoodIdeasProductCategory =

  | "Hogar"

  | "Tech"

  | "Lifestyle"

  | "home"

  | "tech"

  | "lifestyle";



/** Base de assets Good Products (separado de `public/assets/images/products/`). */

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

    slug: "zoco-ai-desktop-robot-voice-recognition-kids",

    title: "ZOCO AI Desktop Robot with Voice Recognition for Kids",

    price: 1445 / 1,

    category: "Tech",

    brand: "ZOCO",

    images: getGoodIdeasProductImagePaths("gi-tech-001"),

    description:

      "Interactive desktop AI robot with voice recognition for kids ages 6–14. A playful talking companion with educational games, built-in lithium battery, compact white design, CE-certified by ZOCO, and English interaction to support language learning.",

    shortDescription:

      "ZOCO AI desktop robot: voice recognition, educational games, built-in battery, and English interaction for kids 6–14.",

    longDescription: [

      "This desktop AI robot with voice recognition offers an educational and fun experience for children. Designed to encourage learning through play, it is ideal for curious minds of all ages.",

      "With conversational ability and interactive responses, the robot acts as a talking companion that keeps kids entertained while helping develop communication skills and logical thinking.",

      "Ideal for children ages 6–12 and 14+, this toy promotes learning through interactive games that stimulate creativity, memory, and logical reasoning in a fun way.",

      "Equipped with a non-removable lithium battery, the robot offers stable, long-lasting operation without external batteries — safer and more convenient for daily use.",

      "At 30 × 30 × 30 cm and just 0.350 kg, this lightweight white plastic robot fits easily on any desk. CE-certified by ZOCO for safe home and classroom use.",

      "The robot responds and communicates in English, helping children improve comprehension and pronunciation — ideal for bilingual settings or natural English practice.",

    ],

    features: [

      "Interactive AI robot with voice recognition",

      "Talking companion with interactive responses",

      "Educational games for ages 6–14",

      "Built-in non-removable lithium battery",

      "Compact design — 30 × 30 × 30 cm, 0.350 kg",

      "White plastic body — safe for children",

      "ZOCO brand with CE certification",

      "English interaction language",

    ],

    freeShipping: true,

    variants: {

      type: "color",

      label: "Color",

      default: "blanco",

      options: [

        { value: "blanco", label: "White", swatchHex: "#F5F5F5" },

      ],

    },

    translations: {

      es: {

        title: "Robot de escritorio con IA y reconocimiento de voz ZOCO",

        description:

          "Robot de escritorio interactivo con IA y reconocimiento de voz para niños de 6 a 14 años. Compañero parlante, juegos educativos, batería integrada, diseño blanco compacto, certificación CE de ZOCO e interacción en inglés.",

        shortDescription:

          "Robot ZOCO con IA: reconocimiento de voz, juegos educativos, batería integrada e interacción en inglés para niños de 6 a 14 años.",

        longDescription: [

          "Este robot de escritorio con IA y reconocimiento de voz ofrece una experiencia educativa y divertida para niños. Diseñado para fomentar el aprendizaje a través del juego, es ideal para mentes curiosas de todas las edades.",

          "Con capacidad de conversación y respuestas interactivas, el robot actúa como un compañero parlante que mantiene entretenidos a los niños. Perfecto para desarrollar habilidades de comunicación y pensamiento lógico.",

          "Ideal para niños de edades entre 6-12 años y 14+, este juguete promueve el aprendizaje a través de juegos interactivos. Estimula la creatividad, la memoria y el razonamiento lógico de forma divertida.",

          "Equipado con una batería de litio no desmontable, el robot ofrece un funcionamiento estable y duradero. No requiere baterías externas, lo que lo hace más seguro y conveniente para uso diario.",

          "Con dimensiones de 30 x 30 x 30 cm y un peso de solo 0.350 kg, este robot es ligero y fácil de colocar en cualquier escritorio. Su diseño en plástico blanco es resistente y seguro para niños.",

          "Fabricado por la marca ZOCO, este robot cumple con estándares europeos de seguridad y calidad, certificados con CE. Apto para uso en hogares y escuelas, con materiales libres de sustancias químicas peligrosas.",

          "El robot responde y se comunica en inglés, ayudando a los niños a mejorar su comprensión y pronunciación del idioma. Ideal para entornos educativos bilingües o para aprender inglés de forma natural.",

        ],

        features: [

          "Robot interactivo con inteligencia artificial y reconocimiento de voz",

          "Compañero parlante con respuestas interactivas",

          "Juegos educativos para niños de 6 a 14 años",

          "Batería integrada de litio no desmontable",

          "Diseño compacto — 30 x 30 x 30 cm, 0.350 kg",

          "Cuerpo de plástico blanco — seguro para niños",

          "Marca ZOCO con certificación CE",

          "Idioma de interacción en inglés",

        ],

      },

    },

  },

  {

    id: "gi-tech-002",

    slug: "universal-car-phone-mount-air-vent",

    title: "Universal Car Phone Mount for Air Vent",

    price: 5890 / 1445,

    category: "Lifestyle",

    brand: "MOTO STORE",

    images: getGoodIdeasProductImagePaths("gi-tech-002", 5),

    description:

      "Universal car phone mount with adjustable air-vent clip. Compatible with iPhone, Samsung, and most smartphones. Compact black design for GPS and hands-free driving.",

    shortDescription:

      "Universal air-vent phone holder — quick clip install, black finish, ideal for GPS and daily driving.",

    longDescription: [

      "This universal car phone mount is designed to fit most mobile phones, with broad compatibility for devices like iPhone and Samsung.",

      "It attaches easily to the car air vent with an adjustable clip — no tools required and no damage to the vehicle.",

      "Compact and lightweight at 15 × 10 × 5 cm and just 0.032 kg, it stays out of the way on your dashboard.",

      "The elegant black finish suits any car interior and holds up to everyday use.",

      "Ideal for GPS and navigation apps — keep the map in clear view while driving for safer, more comfortable trips.",

      "Made in Mainland China to quality standards for daily driving conditions.",

      "Each package includes 1 universal mount, ready to install on your vent.",

    ],

    features: [

      "Universal compatibility for most smartphones",

      "Quick air-vent clip installation",

      "Compact size — 15 × 10 × 5 cm, 0.032 kg",

      "Durable black finish",

      "Ideal for GPS and navigation",

      "Quality manufacturing from Mainland China",

      "Package includes 1 unit",

    ],

    freeShipping: true,

    variants: {

      type: "color",

      label: "Color",

      default: "negro",

      options: [

        { value: "negro", label: "Black", swatchHex: "#1A1A1A" },

      ],

    },

    translations: {

      es: {

        title:

          "Soporte universal para teléfono móvil con clip para rejilla de ventilación",

        description:

          "Soporte universal para móvil en coche con clip para rejilla de ventilación. Compatible con iPhone, Samsung y la mayoría de smartphones. Diseño compacto en negro para GPS y conducción manos libres.",

        shortDescription:

          "Soporte universal para rejilla de aire — instalación rápida, acabado negro, ideal para GPS y conducción diaria.",

        longDescription: [

          "Este soporte está diseñado para ajustarse a la mayoría de los teléfonos móviles gracias a su compatibilidad universal, ideal para usar con dispositivos como iPhone y Samsung.",

          "Se fija fácilmente en la rejilla de ventilación del coche mediante un clip ajustable, sin necesidad de herramientas ni daños al vehículo.",

          "Con dimensiones de 15 x 10 x 5 cm y un peso de solo 0.032 kg, es compacto y ligero, ideal para no ocupar espacio en el tablero del coche.",

          "Presenta un acabado en color negro que combina con cualquier interior de coche y resiste el desgaste diario.",

          "Ideal para usar con aplicaciones de GPS, permite una visualización clara del mapa mientras conduces, mejorando la seguridad y comodidad.",

          "Fabricado en Mainland China, este soporte cumple con estándares de calidad y está diseñado para uso diario en condiciones de conducción.",

          "Cada paquete incluye 1 soporte universal, listo para usar inmediatamente tras la instalación en la rejilla del coche.",

        ],

        features: [

          "Compatibilidad universal con la mayoría de smartphones",

          "Instalación rápida con clip para rejilla de ventilación",

          "Diseño compacto — 15 x 10 x 5 cm, 0.032 kg",

          "Acabado negro elegante y duradero",

          "Ideal para GPS y navegación en ruta",

          "Producto de origen Mainland China, calidad garantizada",

          "Contenido del paquete: 1 unidad",

        ],

      },

    },

  },
  {
    id: "gi-tech-003",
    slug: "xmsj-portable-car-refrigerator-32l-42l",
    title: "XMSJ Portable Car Refrigerator Freezer — 32L / 42L Dual Zone",
    price: 699000 / 1445,
    category: "Lifestyle",
    brand: "XMSJ",
    salesBadge: "Sale",
    images: [
      `${GOOD_IDEAS_IMAGE_BASE}/gi-tech-003/image.webp`,
      `${GOOD_IDEAS_IMAGE_BASE}/gi-tech-003/model-42l-44qt.webp`,
    ],
    description:
      "XMSJ portable car refrigerator and freezer with compressor cooling from -20°C to 20°C. Dual capacity (32L / 42L), 12/24V DC and 110–240V AC power, LED display, battery protection, and free shipping for road trips, camping, and home use.",
    shortDescription:
      "Compressor portable car fridge/freezer — 32L or 42L, -20°C to 20°C, DC/AC power, LED panel, and battery protection for travel and camping.",
    longDescription: [
      "Keep food and drinks cold—or freeze down to -20°C—wherever you go. This XMSJ portable car refrigerator uses a high-performance compressor for efficient cooling from -4°F (-20°C) up to 68°F (20°C), with two capacity options to match your trip.",
      "Choose 32L (34 Quarts) for compact setups or 42L (44 Quarts) for longer journeys and larger groups. Both models share a modern black-and-grey design, digital control panel, and dual AC/DC power for car, home, camper, boat, and outdoor use.",
      "Built-in LED interior light, removable wire basket, wine bottle support, integrated ice maker compartment, cup holders on the lid, corner protectors, and a detachable handle make daily use practical on the road.",
      "Three-level car battery protection and temperature memory help prevent draining your vehicle battery while keeping your set point stable after power cycles.",
      "Runs quietly under 45 dB, works safely at angles below 45° for short periods, and offers max and eco power modes. CE certified, 60W rated, with durable shock-resistant construction for rough terrain.",
      "Fast cooling can bring the interior from 20°C toward 0°C in about 15 minutes, and the unit can maintain temperature for extended periods after disconnecting power—ideal for fresh food and cold drinks on long drives.",
    ],
    features: [
      "Brand: XMSJ · CE certified · Origin: China",
      "Capacity options: 32L (34 Qt) or 42L (44 Qt)",
      "Cooling range: -20°C to 20°C (-4°F to 68°F)",
      "Voltage: 12/24V DC and 110–240V AC",
      "Power: 60W · Net weight: approx. 15–17 kg by model",
      "High-efficiency compressor — no-frost cooling down to -20°C",
      "Three-level car battery protection with temperature memory",
      "Interior: LED light, wire basket, wine bottle support, ice maker area",
      "Exterior: digital panel, cup holders on lid, corner protectors, durable handle",
      "Quiet operation under 45 dB · Max and eco power modes",
      "Suitable for car, jeep, truck, home, gym, taxi, garage, camper, boat, and outdoors",
      "Shock-resistant build · safe operation below 45° tilt for short periods",
      "Package: 1 unit",
    ],
    freeShipping: true,
    variants: {
      type: "model",
      label: "Capacity",
      default: "32l-34qt",
      options: [
        { value: "32l-34qt", label: "32L 34 Quarts", priceModifier: 0 },
        {
          value: "42l-44qt",
          label: "42L 44 Quarts",
          priceModifier: (855000 - 699000) / 1445,
        },
      ],
    },
    translations: {
      es: {
        title:
          "Refrigerador portátil de coche XMSJ 32L/42L — nevera, congelador dual",
        salesBadge: "Oferta",
        description:
          "Refrigerador portátil de coche XMSJ con compresor, de -20°C a 20°C. Dos capacidades (32L / 42L), alimentación 12/24V CC y 110–240V CA, pantalla LED, protección de batería y envío gratis para viajes, camping y hogar.",
        shortDescription:
          "Nevera/congelador portátil con compresor — 32L o 42L, -20°C a 20°C, alimentación CC/CA, panel LED y protección de batería para viajes y camping.",
        longDescription: [
          "Mantén comida y bebidas frías — o congela hasta -20°C — donde vayas. Este refrigerador portátil XMSJ usa un compresor de alto rendimiento para enfriar de -4°F (-20°C) hasta 68°F (20°C), con dos capacidades según tu viaje.",
          "Elige 32L (34 Quarts) para espacios compactos o 42L (44 Quarts) para trayectos largos y grupos más grandes. Ambos modelos comparten diseño moderno en negro y gris, panel digital y alimentación dual CA/CC para coche, hogar, camper, barco y exterior.",
          "Luz LED interior, canasta extraíble, soporte para botellas de vino, compartimento para hielo, portavasos en la tapa, protectores de esquina y asa desmontable facilitan el uso diario en ruta.",
          "Protección de batería del automóvil en tres niveles y memoria de temperatura evitan agotar la batería del vehículo y mantienen el punto de ajuste tras cortes de energía.",
          "Funciona en silencio por debajo de 45 dB, de forma segura con inclinación inferior a 45° durante periodos cortos, y ofrece modos máximo y eco. Certificación CE, 60W, construcción resistente a golpes para terrenos difíciles.",
          "Enfriamiento rápido: puede bajar de 20°C hacia 0°C en unos 15 minutos y mantener la temperatura tras desconectar la alimentación — ideal para comida fresca y bebidas frías en viajes largos.",
        ],
        features: [
          "Marca: XMSJ · Certificación CE · Origen: China",
          "Capacidades: 32L (34 Qt) o 42L (44 Qt)",
          "Rango de enfriamiento: -20°C a 20°C (-4°F a 68°F)",
          "Voltaje: 12/24V CC y 110–240V CA",
          "Potencia: 60W · Peso neto: aprox. 15–17 kg según modelo",
          "Compresor de alta eficiencia — sin congelación hasta -20°C",
          "Protección de batería del auto en tres niveles con memoria de temperatura",
          "Interior: luz LED, canasta, soporte para vino, zona de hielo",
          "Exterior: panel digital, portavasos en tapa, protectores de esquina, asa duradera",
          "Funcionamiento silencioso < 45 dB · Modos máximo y ahorro de energía",
          "Apto para coche, jeep, camión, hogar, gimnasio, taxi, garaje, camper, barco y exterior",
          "Construcción resistente a golpes · uso seguro con inclinación < 45° en periodos cortos",
          "Contenido: 1 unidad",
        ],
      },
    },
  },
  {
    id: "gi-tech-004",
    slug: "13-piece-type-c-phone-port-cleaning-kit",
    title: "13-Piece Type-C Port & Speaker Cleaning Kit for Phones",
    price: 4.15,
    category: "Tech",
    images: [`${GOOD_IDEAS_IMAGE_BASE}/gi-tech-004/image.webp`],
    description:
      "Complete 13-piece cleaning kit for phone charging ports, speakers, and earbuds — includes Type-C dust plug, precision brushes, and mini gap cleaners for deep, safe maintenance.",
    shortDescription:
      "13-piece phone cleaning kit with Type-C dust plug, PP brushes, and nylon mini brushes for ports, speakers, and earbuds.",
    longDescription: [
      "Keep charging ports, speakers, and earbuds clear of lint and dust without damaging delicate surfaces. This 13-piece kit bundles the tools most people need for routine phone and accessory maintenance.",
      "The Type-C aluminum dust plug helps block debris when the port is not in use, while soft PP cleaning brushes reach into crevices around earbuds, keyboards, and small devices.",
      "Ten mini nylon gap brushes (6 × 0.5 cm) penetrate tight holes for efficient deep cleaning — ideal for speaker grilles, nozzle openings, and hard-to-reach seams.",
      "Lightweight, compact, and easy to carry — a practical everyday toolkit for iPhone, Samsung, Xiaomi, and other smartphones with Type-C charging.",
    ],
    features: [
      "13-piece kit — Type-C port configuration",
      "Type-C anti-dust plug — aluminum alloy, black",
      "Compatible with Apple-series and Type-C smartphones",
      "PP cleaning brushes — lightweight, eco-friendly material",
      "Brush size 65 × 15 mm; bristle length 15 mm; thickness 3–6 mm",
      "White and black brush colors included",
      "Suitable for earbuds, phones, keyboards, humidifiers, and more",
      "10 × mini nylon gap brushes — 6 × 0.5 cm, white",
      "Deep cleaning for cracks, ports, and speaker holes without surface damage",
      "Smart portable design — easy to store and carry",
    ],
    freeShipping: true,
    variants: {
      type: "kit",
      label: "Kit",
      default: "13-pcs-type-c",
      options: [
        {
          value: "13-pcs-type-c",
          label: "13 Pcs (Type-C Port)",
        },
      ],
    },
    translations: {
      es: {
        title:
          "Kit de limpieza 13 piezas — Puerto Type-C, altavoz y auriculares",
        description:
          "Kit completo de 13 piezas para limpiar puertos de carga, altavoces y auriculares — incluye tapón antipolvo Type-C, cepillos de precisión y mini limpiadores de grietas para un mantenimiento profundo y seguro.",
        shortDescription:
          "Kit de limpieza de 13 piezas con tapón antipolvo Type-C, cepillos PP y mini cepillos de nailon para puertos, altavoces y auriculares.",
        longDescription: [
          "Mantén puertos de carga, altavoces y auriculares libres de pelusa y polvo sin dañar superficies delicadas. Este kit de 13 piezas reúne las herramientas más útiles para el cuidado rutinario del móvil y accesorios.",
          "El tapón antipolvo de aluminio Type-C ayuda a bloquear residuos cuando el puerto no está en uso, mientras los cepillos PP limpian grietas en auriculares, teclados y dispositivos pequeños.",
          "Diez mini cepillos de nailon (6 × 0,5 cm) penetran en orificios estrechos para una limpieza profunda eficiente — ideal para rejillas de altavoz, boquillas y uniones difíciles.",
          "Ligero, compacto y fácil de transportar — herramienta práctica para iPhone, Samsung, Xiaomi y otros smartphones con carga Type-C.",
        ],
        features: [
          "Kit de 13 piezas — configuración puerto Type-C",
          "Tapón antipolvo Type-C — aleación de aluminio, negro",
          "Compatible con teléfonos serie Apple y smartphones Type-C",
          "Cepillos de limpieza PP — material ligero y respetuoso con el medio ambiente",
          "Tamaño cepillo 65 × 15 mm; longitud del cabello 15 mm; espesor 3–6 mm",
          "Colores de cepillo blanco y negro incluidos",
          "Apto para auriculares, móviles, teclados, humidificadores y más",
          "10 × mini cepillos de grietas nailon — 6 × 0,5 cm, blanco",
          "Limpieza profunda de grietas, puertos y altavoces sin dañar la superficie",
          "Diseño portátil inteligente — fácil de guardar y llevar",
        ],
      },
    },
  },
  {
    id: "gi-hogar-001",
    slug: "portable-8l-mini-refrigerator-car-home",
    title: "Portable 8L Mini Refrigerator for Car and Home",
    price: 62.39,
    category: "Hogar",
    images: [
      ...getGoodIdeasProductImagePaths("gi-hogar-001", 5),
      `${GOOD_IDEAS_IMAGE_BASE}/gi-hogar-001/blue.webp`,
      `${GOOD_IDEAS_IMAGE_BASE}/gi-hogar-001/gold.webp`,
      `${GOOD_IDEAS_IMAGE_BASE}/gi-hogar-001/white.webp`,
      `${GOOD_IDEAS_IMAGE_BASE}/gi-hogar-001/pink.webp`,
    ],
    description:
      "Portable 8L mini refrigerator designed for home, car, office, dorm room, beauty products, drinks, snacks, and small daily essentials. Compact size, heating and cooling positioning, clean modern design, and four color options.",
    shortDescription:
      "Compact 8L portable mini refrigerator for home, car, beauty products, drinks, snacks, skincare, and everyday convenience.",
    longDescription: [
      "Keep drinks, snacks, skincare, and small essentials cool or warm where you need them. This compact 8L mini refrigerator fits bedrooms, offices, dorms, beauty spaces, and vehicles without taking over the room.",
      "The 8L capacity is sized for everyday items—beverages, light meals, cosmetics, and travel-friendly storage that stays organized and within reach.",
      "Use it at home, in the car, or on the go for road trips and daily routines where a full-size fridge is not practical.",
      "A modern minimal exterior and four color options—blue, gold, white, and pink—let it blend into your space while staying easy to spot on a shelf or desk.",
      "Built for daily convenience in small spaces: practical organization for beauty, lifestyle, and grab-and-go essentials.",
    ],
    features: [
      "Compact 8L mini refrigerator",
      "Suitable for home, car, office, and dorm use",
      "Designed for drinks, snacks, skincare, and small essentials",
      "Portable everyday design",
      "Modern minimal exterior",
      "Available in blue, gold, white, and pink",
      "Practical for beauty and lifestyle storage",
      "Ideal for small spaces and daily convenience",
    ],
    freeShipping: true,
    variants: {
      type: "color",
      label: "Color",
      default: "blue",
      options: [
        { value: "blue", label: "Blue" },
        { value: "gold", label: "Gold" },
        { value: "white", label: "White" },
        { value: "pink", label: "Pink" },
      ],
    },
    translations: {
      es: {
        title: "Mini nevera portátil 8L para coche y hogar",
        description:
          "Mini nevera portátil de 8L para hogar, coche, oficina, dormitorio, productos de belleza, bebidas y snacks. Diseño compacto, estilo moderno y colores blue, gold, white y pink.",
        shortDescription:
          "Mini nevera portátil 8L para hogar, coche, belleza, bebidas, snacks, skincare y conveniencia diaria.",
        longDescription: [
          "Mantén bebidas, snacks, skincare y esenciales pequeños a la temperatura que necesitas en hogar, coche u oficina.",
          "Capacidad de 8L pensada para el día a día: bebidas, comida ligera, cosméticos y organización en espacios reducidos.",
          "Útil en dormitorio, oficina, beauty room o viajes donde una nevera grande no encaja.",
          "Exterior minimal moderno; disponible en azul, dorado, blanco y rosa.",
          "Conveniencia diaria y orden para belleza, lifestyle y esenciales al alcance.",
        ],
        features: [
          "Mini nevera compacta de 8L",
          "Apta para hogar, coche, oficina y residencia",
          "Para bebidas, snacks, skincare y esenciales",
          "Diseño portátil para el día a día",
          "Exterior minimal moderno",
          "Disponible en azul, dorado, blanco y rosa",
          "Práctica para belleza y lifestyle",
          "Ideal para espacios pequeños",
        ],
      },
      fr: {
        title: "Mini réfrigérateur portable 8L voiture et maison",
        description:
          "Mini réfrigérateur portable 8L pour maison, voiture, bureau, dortoir, beauté, boissons et snacks. Design compact, style moderne, couleurs blue, gold, white et pink.",
        shortDescription:
          "Mini réfrigérateur portable 8L pour maison, voiture, beauté, boissons, snacks et usage quotidien.",
        features: [
          "Mini réfrigérateur compact 8L",
          "Adapté maison, voiture, bureau et dortoir",
          "Pour boissons, snacks, soins et petits essentiels",
          "Design portable quotidien",
          "Extérieur minimal moderne",
          "Disponible en bleu, or, blanc et rose",
          "Pratique pour beauté et lifestyle",
          "Idéal pour petits espaces",
        ],
      },
      it: {
        title: "Mini frigorifero portatile 8L auto e casa",
        description:
          "Mini frigorifero portatile 8L per casa, auto, ufficio, dormitorio, beauty, bevande e snack. Design compatto, stile moderno, colori blue, gold, white e pink.",
        shortDescription:
          "Mini frigorifero portatile 8L per casa, auto, beauty, bevande, snack e convenienza quotidiana.",
        features: [
          "Mini frigorifero compatto 8L",
          "Adatto a casa, auto, ufficio e dormitorio",
          "Per bevande, snack, skincare e piccoli essenziali",
          "Design portatile quotidiano",
          "Esterno minimal moderno",
          "Disponibile in blu, oro, bianco e rosa",
          "Pratico per beauty e lifestyle",
          "Ideale per spazi piccoli",
        ],
      },
    },
  },

  {
    id: "gi-hogar-002",
    slug: "portable-travel-kettle-450ml",
    title: "Portable Travel Kettle 450ML",
    price: 98700 / 1445,
    category: "Hogar",
    images: [
      ...getGoodIdeasProductImagePaths("gi-hogar-002", 5),
      `${GOOD_IDEAS_IMAGE_BASE}/gi-hogar-002/us.webp`,
      `${GOOD_IDEAS_IMAGE_BASE}/gi-hogar-002/eu.webp`,
    ],
    description:
      "Compact 450ML portable travel kettle for home, office, hotel stays, and daily tea or coffee routines. Fast boil, small footprint, and plug options for different regions.",
    shortDescription:
      "450ML portable travel kettle for home, desk, and travel—compact size with US and EU plug options.",
    longDescription: [
      "A compact kettle sized for one or two cups keeps desks, nightstands, and travel bags uncluttered while still delivering a quick boil when you need it.",
      "The 450ML capacity is practical for tea, coffee, instant meals, and warm water for small daily routines without filling a full kitchen counter.",
      "Use it at home, in a dorm, at the office, or in a hotel room when you want hot water on your schedule.",
      "Choose the plug format that matches your region so the same compact design works across everyday and travel setups.",
      "Built for Good Products home essentials: simple controls, honest sizing, and a form factor that earns a permanent spot in a bag or shelf.",
    ],
    features: [
      "Compact 450ML travel kettle",
      "Suitable for home, office, and travel",
      "Fast boil for tea, coffee, and instant meals",
      "Small footprint for desks and nightstands",
      "US and EU plug options",
      "Portable everyday design",
      "Practical home and travel essential",
    ],
    freeShipping: true,
    variants: {
      type: "plug",
      label: "Plug type",
      default: "eu",
      options: [
        { value: "eu", label: "EU plug" },
        { value: "us", label: "US plug" },
      ],
    },
    translations: {
      es: {
        title: "Hervidor de viaje portátil 450ML",
        description:
          "Hervidor de viaje compacto de 450ML para hogar, oficina, hotel y rutinas diarias de té o café. Hervido rápido, tamaño reducido y opciones de enchufe US y EU.",
        shortDescription:
          "Hervidor portátil 450ML para hogar, escritorio y viaje, con opciones de enchufe US y EU.",
        longDescription: [
          "Un hervidor compacto para una o dos tazas mantiene ordenados escritorios, mesitas y maletas sin renunciar a un hervido rápido.",
          "La capacidad de 450ML encaja en té, café, comidas instantáneas y agua caliente para rutinas diarias sin ocupar toda la encimera.",
          "Úsalo en casa, residencia, oficina o habitación de hotel cuando quieras agua caliente a tu ritmo.",
          "Elige el formato de enchufe según tu región para el mismo diseño compacto en viaje y día a día.",
          "Esencial de hogar Buenos Productos: controles simples, tamaño honesto y formato que merece quedarse en el bolso o la estantería.",
        ],
        features: [
          "Hervidor de viaje compacto 450ML",
          "Apto para hogar, oficina y viaje",
          "Hervido rápido para té, café e instantáneos",
          "Pequeño para escritorios y mesitas",
          "Opciones de enchufe US y EU",
          "Diseño portátil para el día a día",
          "Esencial práctico de hogar y viaje",
        ],
      },
      fr: {
        title: "Bouilloire de voyage portable 450ML",
        description:
          "Bouilloire de voyage compacte 450ML pour maison, bureau, hôtel et thé ou café quotidien. Ébullition rapide, faible encombrement, prises US et EU.",
        shortDescription:
          "Bouilloire portable 450ML pour maison, bureau et voyage, avec options de prise US et EU.",
        features: [
          "Bouilloire de voyage compacte 450ML",
          "Adaptée maison, bureau et voyage",
          "Ébullition rapide pour thé, café et plats instantanés",
          "Faible encombrement pour bureaux et tables de nuit",
          "Options de prise US et EU",
          "Design portable quotidien",
          "Essentiel pratique maison et voyage",
        ],
      },
      it: {
        title: "Bollitore da viaggio portatile 450ML",
        description:
          "Bollitore da viaggio compatto 450ML per casa, ufficio, hotel e tè o caffè quotidiano. Bollitura rapida, ingombro ridotto, spine US e EU.",
        shortDescription:
          "Bollitore portatile 450ML per casa, scrivania e viaggio, con opzioni spina US e EU.",
        features: [
          "Bollitore da viaggio compatto 450ML",
          "Adatto a casa, ufficio e viaggio",
          "Bollitura rapida per tè, caffè e pasti instant",
          "Ingombro ridotto per scrivanie e comodini",
          "Opzioni spina US e EU",
          "Design portatile quotidiano",
          "Essenziale pratico per casa e viaggio",
        ],
      },
    },
  },

  {
    id: "gi-hogar-003",
    slug: "2l-stainless-steel-electric-kettle-eu",
    title: "2L Stainless Steel Electric Kettle — EU Plug",
    price: 10000 / 1445,
    category: "Hogar",
    salesBadge: "Super Sale",
    images: [`${GOOD_IDEAS_IMAGE_BASE}/gi-hogar-003/image.webp`],
    description:
      "Food-grade 2L stainless steel electric kettle with fast boil, classic safe design, comfortable handle, and power switch. EU plug, 1000W–1500W, ideal for families, offices, and daily tea or coffee.",
    shortDescription:
      "2L stainless steel electric kettle with EU plug — fast heating, food-safe build, perfect for home, office, and daily hot drinks.",
    longDescription: [
      "This 2.0L electric kettle heats water in larger batches—ideal for families or office use without constant refills.",
      "Built from high-quality stainless steel for durability, corrosion resistance, and food-safe heating without contaminants.",
      "Classic, safe home appliance design with a comfortable handle and power switch for easy pouring and simple start/stop control.",
      "Fast, efficient boiling saves time and energy for daily tea, coffee, and hot beverages at home, in the office, or on the go.",
      "EU plug compatibility (220V, 50Hz) suits European outlets. No hazardous substances—food-grade materials for everyday use.",
      "Package includes 1 electric kettle. Allow 1–2 cm variance on dimensions due to manual measurement; monitor color may vary slightly from photos.",
    ],
    features: [
      "2.0L capacity for daily family or office use",
      "High-quality stainless steel — durable and food-safe",
      "Fast, efficient boiling — saves time and energy",
      "Classic design with handle and power switch",
      "Item: Electric kettle",
      "Material: Stainless steel",
      "Rated voltage: EU 220V / UK 230V",
      "Rated frequency: 50Hz",
      "Rated power: 1000W–1500W",
      "Plug type: EU plug",
      "No hazardous chemical substances — food-grade materials",
      "Package includes: 1 × kettle",
    ],
    freeShipping: true,
    translations: {
      es: {
        title:
          "Hervidor eléctrico de acero inoxidable 2L — enchufe europeo",
        salesBadge: "Super Oferta",
        description:
          "Hervidor eléctrico de acero inoxidable 2L de calidad alimentaria, ebullición rápida, diseño clásico y seguro, mango cómodo e interruptor. Enchufe EU, 1000W–1500W, ideal para familias, oficinas y té o café diario.",
        shortDescription:
          "Hervidor eléctrico 2L en acero inoxidable con enchufe EU — calentamiento rápido, materiales aptos alimentos, para hogar, oficina y bebidas calientes.",
        longDescription: [
          "Capacidad de 2.0L para preparar agua caliente en grandes cantidades, ideal para familias o uso en oficinas sin necesidad de llenarlo constantemente.",
          "Construcción en acero inoxidable de alta calidad: durabilidad, resistencia a la corrosión y seguridad alimentaria, sin contaminantes al calentar el agua.",
          "Diseño clásico y seguro con mango cómodo e interruptor para recoger, verter e iniciar o detener el calentamiento con facilidad.",
          "Calentamiento rápido y eficiente que ahorra tiempo y energía en el uso diario en casa o en la oficina.",
          "Compatible con enchufe europeo (220V, 50Hz). Materiales seguros para uso alimentario, sin sustancias químicas de preocupación.",
          "Incluye 1 tetera eléctrica. Las medidas pueden variar 1–2 cm por medición manual; el color puede verse ligeramente distinto según el monitor.",
        ],
        features: [
          "Capacidad 2.0L para familia u oficina",
          "Acero inoxidable de alta calidad — duradero y apto alimentos",
          "Ebullición rápida y eficiente — ahorra tiempo y energía",
          "Diseño clásico con mango e interruptor",
          "Artículo: Tetera eléctrica",
          "Material: Acero inoxidable",
          "Voltaje nominal: UE 220V / Reino Unido 230V",
          "Frecuencia nominal: 50Hz",
          "Potencia nominal: 1000W–1500W",
          "Tipo de enchufe: Enchufe europeo",
          "Sin sustancias químicas de preocupación — materiales aptos alimentos",
          "Contenido: 1 × tetera",
        ],
      },
    },
  },

  {
    id: "gi-hogar-004",
    slug: "searide-180ml-mini-usb-humidifier-aroma-diffuser",
    brand: "Searide",
    title:
      "Searide 180ML Mini USB Air Humidifier & Aroma Diffuser — H09 Pro",
    price: 9999 / 1445,
    category: "Hogar",
    images: [
      "https://s.alicdn.com/@sc04/kf/H4a6ed9dfa2f749f9be975ce01fa1f4297.jpg?avif=close&webp=close",
    ],
    description:
      "180ML mini ultrasonic humidifier and electric aroma diffuser by Searide. USB-powered, touch controls, RGB atmosphere light, aromatherapy mist, and auto shut-off when water runs low — for home, bedroom, desk, or car cup holder.",
    shortDescription:
      "Compact 180ML USB humidifier and aroma diffuser with touch control, RGB light, and quiet ultrasonic mist for home, bedroom, or car.",
    longDescription: [
      "A small column-style humidifier that adds comfortable moisture and optional essential-oil aromatherapy without taking over your nightstand, desk, or car console.",
      "The 180ML tank supports steady ultrasonic mist output with touch-button operation, a single mist stream, and an RGB light ring that doubles as a soft atmosphere lamp.",
      "Rated for spaces around 11–20 m², it runs at under 36 dB on USB 5V / 2W power — practical for bedrooms, home offices, and travel setups.",
      "Built-in water-shortage protection helps prevent dry running; CE certified per supplier listing. Model H09 Pro, classic column form factor.",
    ],
    features: [
      "Brand Searide — model H09 Pro",
      "180ML capacity, ultrasonic cool mist",
      "Humidification rate ~30 ml/h",
      "Aromatherapy function with essential oils",
      "Touch-button operation",
      "RGB atmosphere light ring",
      "USB 5V powered (2W)",
      "Covers approx. 11–20 m²",
      "Noise level under 36 dB",
      "Auto shut-off when water is low",
      "CE certified (supplier listing)",
      "Classic column mini design",
      "For home, bedroom, desk, and car",
      "Available in White and Black",
      "Origin China (supplier data)",
    ],
    freeShipping: true,
    variants: {
      type: "color",
      label: "Color",
      default: "white",
      options: [
        { value: "white", label: "White", swatchHex: "#F0F0F0" },
        { value: "black", label: "Black", swatchHex: "#1C1C1C" },
      ],
    },
    translations: {
      es: {
        title:
          "Searide Mini humidificador de aire 180ML USB — Difusor de aroma H09 Pro",
        description:
          "Mini humidificador ultrasónico de 180ML y difusor de aroma eléctrico Searide. Alimentación USB, control táctil, luz RGB ambiental, niebla de aromaterapia y apagado automático sin agua — para hogar, dormitorio, escritorio o portavasos del auto.",
        shortDescription:
          "Humidificador USB compacto de 180ML con control táctil, luz RGB y niebla ultrasónica silenciosa para hogar, dormitorio o auto.",
        longDescription: [
          "Humidificador mini de perfil columnar que aporta humedad confortable y aromaterapia opcional sin ocupar la mesita de noche, el escritorio o la consola del auto.",
          "Tanque de 180ML con niebla ultrasónica continua, operación táctil, una salida de niebla y anillo de luz RGB que funciona como lámpara ambiental suave.",
          "Pensado para espacios de aprox. 11–20 m²; funciona a menos de 36 dB con alimentación USB 5V / 2W — práctico para dormitorios, home office y viajes.",
          "Protección contra apagado por falta de agua; certificación CE según ficha del proveedor. Modelo H09 Pro, forma columnar clásica.",
        ],
        features: [
          "Marca Searide — modelo H09 Pro",
          "Capacidad 180ML, niebla fría ultrasónica",
          "Tasa de humidificación ~30 ml/h",
          "Función de aromaterapia con aceites esenciales",
          "Operación con botones táctiles",
          "Luz ambiental RGB",
          "Alimentación USB 5V (2W)",
          "Cobertura aprox. 11–20 m²",
          "Nivel de ruido inferior a 36 dB",
          "Apagado automático sin agua",
          "Certificación CE (según proveedor)",
          "Diseño mini columnar clásico",
          "Para hogar, dormitorio, escritorio y auto",
          "Disponible en Blanco y Negro",
          "Origen China (dato de proveedor)",
        ],
      },
    },
  },

  {
    id: "gi-hogar-005",
    slug: "haoyunma-cordless-rechargeable-electric-egg-beater-whisk",
    brand: "HAOYUNMA",
    title:
      "HAOYUNMA Cordless Rechargeable Electric Egg Beater & Hand Whisk",
    price: 17.3,
    category: "Hogar",
    images: [
      "/assets/images/good-ideas-products/gi-hogar-005/image.webp",
    ],
    description:
      "Wireless portable electric egg beater and hand whisk by HAOYUNMA. Rechargeable battery, 3-speed push-button control, high-resistance ABS whisk head, multifunctional for eggs, cream, baking, and cakes — CE certified.",
    shortDescription:
      "Cordless rechargeable hand whisk with 3 speeds, LED ring, and portable design for eggs, cream, and baking.",
    longDescription: [
      "Whip eggs, cream, and cake batter without tangled cords on the counter. This compact cordless whisk keeps prep simple for everyday baking and quick kitchen tasks.",
      "Three speed settings with push-button control let you match rhythm to the ingredient — slow for gentle mixing, faster for stiff peaks and smooth batters.",
      "The high-resistance ABS whisk head is built for regular home use; the pistol-grip body stays lightweight and easy to handle in bowls and glasses.",
      "Model Electric Eggbeater & Whisk by HAOYUNMA. CE certified per supplier listing; no substances of very high concern listed.",
    ],
    features: [
      "Brand HAOYUNMA — model Electric Eggbeater & Whisk",
      "Cordless rechargeable electric hand whisk",
      "3 speed settings with push-button control",
      "High-resistance ABS whisk head material",
      "Multifunctional — includes whisk attachment",
      "Portable pistol-grip design",
      "LED light ring on power button",
      "For eggs, cream, baking, and cakes",
      "CE certified (supplier listing)",
      "No substances of very high concern",
      "Available in White and Violet",
      "Origin China (supplier data)",
    ],
    freeShipping: true,
    variants: {
      type: "color",
      label: "Color",
      default: "violet",
      options: [
        { value: "violet", label: "Violet", swatchHex: "#9B8CF8" },
        { value: "white", label: "White", swatchHex: "#F0F0F0" },
      ],
    },
    translations: {
      es: {
        title:
          "HAOYUNMA Batidor de huevos eléctrico recargable inalámbrico — Electric Eggbeater & Whisk",
        description:
          "Batidor de huevos eléctrico portátil e inalámbrico HAOYUNMA. Batería recargable, control con botón pulsador de 3 velocidades, cabezal batidor en ABS de alta resistencia, multifuncional para huevos, crema, repostería y pasteles — certificación CE.",
        shortDescription:
          "Batidor de mano recargable sin cable con 3 velocidades, anillo LED y diseño portátil para huevos, crema y repostería.",
        longDescription: [
          "Batí huevos, crema y masas sin cables en el mostrador. Este batidor compacto e inalámbrico simplifica la preparación diaria y las tareas rápidas de cocina.",
          "Tres velocidades con botón pulsador para adaptar el ritmo al ingrediente — lento para mezclas suaves, más rápido para picos firmes y batidos uniformes.",
          "Cabezal batidor en ABS de alta resistencia pensado para uso doméstico; cuerpo ergonómico liviano y fácil de manejar en bowls y vasos.",
          "Modelo Electric Eggbeater & Whisk de HAOYUNMA. Certificación CE según ficha del proveedor; sin productos químicos de alta preocupación.",
        ],
        features: [
          "Marca HAOYUNMA — modelo Electric Eggbeater & Whisk",
          "Batidor eléctrico de mano recargable e inalámbrico",
          "3 configuraciones de velocidad con botón pulsador",
          "Material de cuchilla: ABS de alta resistencia",
          "Multifuncional — con batidor incluido",
          "Estilo portátil con agarre ergonómico",
          "Anillo de luz LED en botón de encendido",
          "Para huevos, crema, repostería y pasteles",
          "Certificación CE (según proveedor)",
          "Producto químico de alta preocupación: ninguno",
          "Disponible en Blanco y Violeta",
          "Origen China (dato de proveedor)",
        ],
      },
    },
  },

  {
    id: "gi-hogar-006",
    slug: "zuumaa-mf101-usb-rechargeable-mini-milk-frother-3-speed",
    brand: "ZuuMaa",
    title:
      "ZuuMaa MF101 USB Rechargeable Mini Milk Frother — 3-Speed Handheld Coffee & Egg Whisk",
    price: 8.3,
    category: "Hogar",
    images: [
      "/assets/images/good-ideas-products/gi-hogar-006/image.webp",
    ],
    description:
      "Compact USB-rechargeable mini milk frother and handheld mixer by ZuuMaa. Three speed settings, 11,000 RPM, under 750W — for coffee foam, lattes, eggs, and light kitchen mixing. Portable electric design, 220–240V.",
    shortDescription:
      "USB rechargeable 3-speed mini frother with whisk attachment for coffee foam, milk, and eggs — portable handheld design.",
    longDescription: [
      "Froth milk for lattes and cappuccinos, blend coffee drinks, or whisk eggs without bulky countertop gear. This mini handheld frother keeps everyday kitchen prep quick and tidy.",
      "Three speed settings with push-button control let you adjust intensity — gentle for milk foam, faster for eggs and light batters.",
      "Rechargeable via USB with cordless operation when charged; rated under 750W with rotation up to 11,000 RPM for efficient mixing in cups and small bowls.",
      "Model MF101 by ZuuMaa. Capacity under 0.5 L per supplier listing; no substances of very high concern listed. Voltage 220–240V.",
    ],
    features: [
      "Brand ZuuMaa — model MF101",
      "USB rechargeable mini milk frother & hand whisk",
      "3 speed settings with push-button control",
      "Rotation rate up to 11,000 RPM",
      "Power under 750W",
      "Rechargeable / electric — works in both modes",
      "Portable handheld design",
      "For milk foam, coffee, eggs, and light mixing",
      "Capacity under 0.5 L (supplier listing)",
      "Voltage 220–240V",
      "No substances of very high concern",
      "Available in Black and White",
      "Origin China (supplier data)",
    ],
    freeShipping: true,
    variants: {
      type: "color",
      label: "Color",
      default: "black",
      options: [
        { value: "black", label: "Black", swatchHex: "#1C1C1C" },
        { value: "white", label: "White", swatchHex: "#F0F0F0" },
      ],
    },
    translations: {
      es: {
        title:
          "ZuuMaa MF101 Mini espumador de leche USB recargable — Batidor de café 3 velocidades",
        description:
          "Mini espumador de leche y mezclador de mano compacto ZuuMaa con carga USB. Tres velocidades, 11.000 RPM, menos de 750W — para espuma de café, lattes, huevos y mezclas ligeras. Diseño eléctrico portátil, 220–240V.",
        shortDescription:
          "Mini espumador recargable USB de 3 velocidades con batidor para espuma de leche, café y huevos — diseño portátil de mano.",
        longDescription: [
          "Espumá leche para lattes y cappuccinos, mezclá bebidas de café o batí huevos sin electrodomésticos voluminosos. Este mini espumador de mano agiliza la preparación diaria en la cocina.",
          "Tres velocidades con botón pulsador para ajustar la intensidad — suave para espuma de leche, más rápido para huevos y batidos ligeros.",
          "Recargable por USB con funcionamiento inalámbrico cuando está cargado; menos de 750W con rotación de hasta 11.000 RPM para mezclar eficientemente en tazas y bowls pequeños.",
          "Modelo MF101 de ZuuMaa. Capacidad inferior a 0,5 L según ficha del proveedor; sin productos químicos de alta preocupación. Voltaje 220–240V.",
        ],
        features: [
          "Marca ZuuMaa — modelo MF101",
          "Mini espumador de leche USB recargable y batidor de mano",
          "3 configuraciones de velocidad con botón pulsador",
          "Tasa de rotación hasta 11.000 RPM",
          "Potencia inferior a 750W",
          "Recargable/eléctrico — funciona en ambos modos",
          "Estilo portátil de mano",
          "Para espuma de leche, café, huevos y mezclas ligeras",
          "Capacidad inferior a 0,5 L (según proveedor)",
          "Voltaje 220–240V",
          "Producto químico de alta preocupación: ninguno",
          "Disponible en Negro y Blanco",
          "Origen China (dato de proveedor)",
        ],
      },
    },
  },

  {
    id: "gi-hogar-007",
    slug: "sokany-sk-999-2-5l-high-power-multifunction-blender",
    brand: "Sokany",
    title:
      "Sokany SK-999 2.5L High-Power Multifunction Blender — Ice Crusher & Kitchen Machine",
    price: 186.85,
    category: "Hogar",
    images: [
      "/assets/images/good-ideas-products/gi-hogar-007/image.webp",
    ],
    description:
      "Sokany SK-999 multifunction kitchen blender with 2.5L capacity and high-power motor for smoothies, ice crushing, soups, and daily food prep. CE and UK CA certified; 120V operation per supplier listing.",
    shortDescription:
      "2.5L high-power multifunction blender for smoothies, ice, soups, and everyday kitchen prep — model SK-999.",
    longDescription: [
      "Blend smoothies, crush ice, and prep soups or sauces in one countertop machine built for busy kitchens. The 2.5L pitcher handles family-sized batches without constant refills.",
      "High-power motor rated above 1501W (supplier lists up to 6000W peak marketing spec) drives stainless blades through frozen fruit, ice, and tougher ingredients.",
      "Multifunction design covers blending, ice crushing, and general food processing — a practical all-in-one alternative to separate small appliances.",
      "Model SK-999 by Sokany. CE and UK CA (Queen's Order) certified per listing; no substances of very high concern. Origin China. 120V.",
    ],
    features: [
      "Brand Sokany — model SK-999",
      "2.5L capacity (>2.1 L per supplier tier)",
      "High-power motor — over 1501W",
      "Multifunction blender, ice crusher & kitchen machine",
      "For smoothies, soups, sauces, and ice crushing",
      "CE certified (supplier listing)",
      "UK CA / Queen's Order certified (supplier listing)",
      "Voltage 120V",
      "No substances of very high concern",
      "Single model — silver/black finish",
      "Origin China (supplier data)",
    ],
    freeShipping: true,
    translations: {
      es: {
        title:
          "Sokany SK-999 Licuadora multifuncional 2,5L alta potencia — Trituradora de hielo",
        description:
          "Licuadora multifuncional de cocina Sokany SK-999 con capacidad de 2,5L y motor de alta potencia para batidos, hielo, sopas y preparación diaria. Certificación CE y UK CA; operación 120V según ficha del proveedor.",
        shortDescription:
          "Licuadora multifuncional 2,5L de alta potencia para batidos, hielo, sopas y uso diario en cocina — modelo SK-999.",
        longDescription: [
          "Prepará batidos, triturá hielo y hacé sopas o salsas en una sola máquina de mostrador pensada para cocinas activas. El jarro de 2,5L permite porciones familiares sin rellenar constantemente.",
          "Motor de alta potencia superior a 1501W (la ficha del proveedor indica hasta 6000W en especificación comercial) con cuchillas de acero para fruta congelada, hielo e ingredientes más densos.",
          "Diseño multifuncional para licuar, triturar hielo y procesar alimentos — una alternativa práctica a varios electrodomésticos pequeños.",
          "Modelo SK-999 de Sokany. Certificación CE y UK CA (orden de la reina) según listado; sin productos químicos de alta preocupación. Origen China. 120V.",
        ],
        features: [
          "Marca Sokany — modelo SK-999",
          "Capacidad 2,5 L (>2,1 L según ficha)",
          "Motor de alta potencia — superior a 1501W",
          "Licuadora multifuncional, trituradora de hielo y máquina de cocina",
          "Para batidos, sopas, salsas y trituración de hielo",
          "Certificación CE (según proveedor)",
          "Certificación UK CA / orden de la reina (según proveedor)",
          "Voltaje 120V",
          "Producto químico de alta preocupación: ninguno",
          "Un solo modelo — acabado plateado/negro",
          "Origen China (dato de proveedor)",
        ],
      },
    },
  },

  {
    id: "gi-hogar-008",
    slug: "biolomix-bhb1200-4-in-1-1200w-immersion-hand-blender",
    brand: "BioloMix",
    title:
      "BioloMix BHB1200 4-in-1 Immersion Hand Blender — 1200W, 6 Speeds & Turbo",
    price: 176.47,
    category: "Hogar",
    images: [
      "/assets/images/good-ideas-products/gi-hogar-008/image.webp",
    ],
    description:
      "BioloMix 4-in-1 immersion hand blender with 1200W motor, 6 speeds and turbo. Includes 500 ml food chopper, 600 ml mixing beaker, whisk attachment, and 304 stainless blades — for baby food, purées, smoothies, sauces, and soups.",
    shortDescription:
      "1200W 4-in-1 stick blender with 6 speeds, 500 ml chopper, 600 ml beaker, and whisk — model BHB1200 in black.",
    longDescription: [
      "Blend, chop, whisk, and puree from one handheld base built for everyday family cooking. The 4-in-1 set covers smoothies, sauces, soups, baby food, and quick prep without crowding the counter.",
      "A 1200W motor with 6 adjustable speeds and instant turbo handles soft purées through thicker mixes. Two sharp 304 stainless steel blades cut ingredients quickly and quietly.",
      "Accessories included: 600 ml mixing beaker, 500 ml chopper bowl, whisk attachment, and power cord. Detachable shaft rinses easily — dishwasher-safe top rack; do not immerse the motor in water.",
      "Continuous run limits: whisk attachment up to 1 minute, blender shaft up to 30 seconds, chopper up to 20 seconds. Allow at least 10 minutes rest between every 3 operating cycles.",
      "Model BHB1200 by BioloMix. Stainless steel and BPA-free plastic construction. Black finish. 220–240V, 50/60 Hz, 1200W max (EU/UK plug per listing). Package includes hand blender, chopper bowl, beaker, whisk, and user manual.",
    ],
    features: [
      "Brand BioloMix — model BHB1200 stainless immersion hand blender",
      "4-in-1 set: immersion blender, 500 ml chopper, 600 ml beaker, whisk",
      "1200W high-performance motor",
      "6 adjustable speeds with turbo button",
      "304 stainless steel dual blades",
      "For baby food, purées, smoothies, sauces, and soups",
      "Stainless steel and BPA-free plastic",
      "Detachable shaft — easy rinse; motor not dishwasher-safe",
      "Whisk: max 1 min continuous / blender shaft: max 30 sec / chopper: max 20 sec",
      "10-minute rest required between every 3 cycles",
      "220–240V, 50/60 Hz — EU/UK plug (supplier listing)",
      "Black color — single 4-in-1 configuration",
      "Includes user manual in box",
      "Origin China (supplier data)",
    ],
    freeShipping: true,
    translations: {
      es: {
        title:
          "BioloMix BHB1200 Batidora de mano de inmersión 4 en 1 — 1200W, 6 velocidades y turbo",
        description:
          "Batidora de mano de inmersión BioloMix 4 en 1 con motor de 1200W, 6 velocidades y turbo. Incluye picadora de 500 ml, vaso mezclador de 600 ml, batidor de huevos y cuchillas de acero inoxidable 304 — para comida infantil, purés, batidos, salsas y sopas.",
        shortDescription:
          "Batidora de palos 1200W 4 en 1 con 6 velocidades, picadora 500 ml, vaso 600 ml y batidor — modelo BHB1200 en negro.",
        longDescription: [
          "Licúa, pica, bate y tritura desde una sola base de mano pensada para la cocina familiar diaria. El set 4 en 1 cubre batidos, salsas, sopas, comida para bebés y preparación rápida sin ocupar el mostrador.",
          "Motor de 1200W con 6 velocidades ajustables y turbo instantáneo para purés suaves y mezclas más densas. Dos cuchillas afiladas de acero inoxidable 304 cortan los alimentos de forma rápida y silenciosa.",
          "Accesorios incluidos: vaso mezclador de 600 ml, cuenco picador de 500 ml, accesorio batidor y cable de alimentación. Eje desmontable fácil de enjuagar — apto para rejilla superior del lavavajillas; no sumerja el motor en agua.",
          "Límites de uso continuo: batidor hasta 1 minuto, licuadora hasta 30 segundos, picador hasta 20 segundos. Descanso mínimo de 10 minutos entre cada 3 ciclos de operación.",
          "Modelo BHB1200 de BioloMix. Acero inoxidable y plástico sin BPA. Acabado negro. 220–240V, 50/60 Hz, 1200W máx. (enchufe UE/Reino Unido según listado). Incluye licuadora de mano, cuenco picador, vaso, batidor y manual de uso.",
        ],
        features: [
          "Marca BioloMix — modelo BHB1200 batidora de inmersión de acero inoxidable",
          "Set 4 en 1: licuadora de mano, picadora 500 ml, vaso 600 ml, batidor",
          "Motor de alto rendimiento 1200W",
          "6 velocidades ajustables con botón turbo",
          "Doble cuchilla de acero inoxidable 304",
          "Para comida infantil, purés, batidos, salsas y sopas",
          "Acero inoxidable y plástico sin BPA",
          "Eje desmontable — fácil de limpiar; motor no apto para lavavajillas",
          "Batidor: máx. 1 min continuo / licuadora: máx. 30 seg / picador: máx. 20 seg",
          "Descanso de 10 min entre cada 3 ciclos",
          "220–240V, 50/60 Hz — enchufe UE/Reino Unido (según proveedor)",
          "Color negro — configuración única 4 en 1",
          "Incluye manual de uso en la caja",
          "Origen China (dato de proveedor)",
        ],
      },
    },
  },

  {

    id: "gi-lifestyle-001",

    slug: "lenovo-thinkplus-xt80-wireless-sports-earbuds",

    title: "Lenovo Thinkplus XT80 Wireless Sports Earbuds",

    price: 45000 / 1445,

    category: "Tech",

    brand: "Lenovo",

    images: getGoodIdeasProductImagePaths("gi-lifestyle-001"),

    description:

      "Wireless sports earbuds designed for active daily use, workouts, commuting, music, calls, and portable listening. Bluetooth 5.3, LED digital battery display, ergonomic fit, compact charging case, and stereo sound.",

    shortDescription:

      "Wireless sports earbuds with Bluetooth 5.3, LED battery display, ergonomic fit, and compact charging case for everyday movement.",

    longDescription: [

      "High-speed Bluetooth 5.3 delivers a stable, fast connection for music, calls, and daily use—with wireless range up to 10 meters for uninterrupted freedom.",

      "Lenovo TWS earbuds deliver hi-fi stereo sound with a 20 Hz–20,000 Hz frequency response for deep bass and crisp highs on every track.",

      "Integrated physical buttons let you control playback, calls, and volume easily—adjust sound to your preference without reaching for your phone.",

      "Each earbud packs a 300 mAh battery for up to 4–5 hours of continuous playback. The charging case provides multiple top-ups for extended listening.",

      "Built for sport with IPX5 water resistance—protected against sweat and splashes during intense workouts or rainy days.",

    ],

    features: [

      "Bluetooth 5.3 — stable connection up to 10 m",

      "Hi-fi stereo sound — 20 Hz–20 kHz response",

      "IPX5 water resistance — sweat and splash protection",

      "Long battery — 300 mAh per bud, 4–5 h playback",

      "Bluetooth version: 5.3",

      "Wireless range: Up to 10 meters",

      "Frequency response: 20 Hz–20,000 Hz",

      "Controls: Physical buttons — playback, calls, volume",

      "Battery per earbud: 300 mAh",

      "Playback time: Up to 4–5 hours continuous",

      "Charging case: Multiple extra charges",

      "Water resistance: IPX5",

      "LED digital battery display on charging case",

      "Ergonomic sports fit",

      "Color: Black",

    ],

    freeShipping: true,

    variants: {
      type: "color",
      label: "Color",
      default: "negro",
      options: [{ value: "negro", label: "Black", swatchHex: "#1A1A1A" }],
    },

    translations: {

      es: {

        title: "Auriculares deportivos inalámbricos Lenovo Thinkplus XT80",

        description:

          "Auriculares deportivos inalámbricos para uso activo diario, entrenamientos, desplazamientos, música y llamadas. Bluetooth 5.3, pantalla LED de batería, ajuste ergonómico, estuche compacto y sonido estéreo.",

        shortDescription:

          "Auriculares deportivos inalámbricos con Bluetooth 5.3, pantalla LED de batería, ajuste ergonómico y estuche de carga compacto para el día a día.",

        longDescription: [

          "Conexión Bluetooth 5.3 de alta velocidad: disfruta de una conexión estable y rápida con Bluetooth 5.3, ideal para música, llamadas y uso diario. El rango inalámbrico alcanza hasta 10 metros, ofreciendo libertad sin interrupciones.",

          "Audio de alta fidelidad con sonido estéreo: los auriculares TWS de Lenovo ofrecen un sonido estéreo de alta fidelidad con respuesta de frecuencia de 20–20.000 Hz, garantizando graves profundos y agudos nítidos en cada canción.",

          "Control por botones y volumen ajustable: con botones físicos integrados, puedes controlar reproducción, llamadas y volumen fácilmente. El control de volumen permite ajustar el sonido según tus preferencias sin necesidad de usar el móvil.",

          "Batería de larga duración con carga rápida: cada auricular tiene una capacidad de 300 mAh, con una duración de hasta 4–5 horas de reproducción continua. El estuche de carga ofrece múltiples recargas para un uso prolongado.",

          "Protección IPX5 y resistencia al agua: diseñados para el deporte, estos auriculares son resistentes al agua con certificación IPX5, protegiéndolos de sudor y salpicaduras durante entrenamientos intensos o días lluviosos.",

        ],

        features: [

          "Bluetooth 5.3 — conexión estable hasta 10 m",

          "Sonido estéreo hi-fi — respuesta 20 Hz–20 kHz",

          "Resistencia IPX5 — protección contra sudor y salpicaduras",

          "Batería prolongada — 300 mAh por auricular, 4–5 h de reproducción",

          "Versión Bluetooth: 5.3",

          "Alcance inalámbrico: Hasta 10 metros",

          "Respuesta de frecuencia: 20 Hz–20.000 Hz",

          "Controles: Botones físicos — reproducción, llamadas, volumen",

          "Batería por auricular: 300 mAh",

          "Autonomía: Hasta 4–5 horas continuas",

          "Estuche de carga: Múltiples recargas adicionales",

          "Resistencia al agua: IPX5",

          "Pantalla LED digital de batería en el estuche",

          "Ajuste ergonómico deportivo",

          "Color: Negro",

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
    price: 32255 / 1445,
    category: "Tech",
    brand: "Lenovo",
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
    variants: {
      type: "color",
      label: "Color",
      default: "negro",
      options: [
        { value: "blanco", label: "White", swatchHex: "#F5F5F5" },
        { value: "negro", label: "Black", swatchHex: "#1A1A1A" },
      ],
    },
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
    slug: "professional-2-in-1-nose-ear-hair-trimmer",
    title: "Professional 2-in-1 Nose & Ear Hair Trimmer",
    price: 8399 / 1445,
    category: "Hogar",
    images: getGoodIdeasProductImagePaths("gi-lifestyle-003", 5),
    description:
      "Portable professional 2-in-1 electric hair trimmer for nose and ears. ROTARY motor, smart power selection, auto-clean system, rechargeable battery, and interchangeable tips—ideal for daily personal care at home or on travel.",
    shortDescription:
      "2-in-1 rechargeable nose and ear trimmer with ROTARY motor, smart power control, and 15–30 min battery life for daily grooming.",
    longDescription: [
      "This portable professional 2-in-1 electric trimmer is designed for nose and ear hair, delivering precision and comfort for daily personal care at home or on the go.",
      "A high-performance ROTARY motor ensures smooth, efficient operation with clean, fast trimming—especially in sensitive areas like nose and ears.",
      "Battery life runs 15–30 minutes per charge—enough for multiple sessions. A full charge takes up to 2 hours for reliable everyday use.",
      "Smart features include automatic power selection based on hair density and a charge indicator. An auto-clean system simplifies maintenance and extends product life.",
      "Interchangeable tips (1–2 nozzles included) help adjust trim length. Available in orange, blue, and black to match your preference.",
    ],
    features: [
      "Professional 2-in-1 nose and ear trimmer",
      "ROTARY motor — smooth, efficient cutting",
      "Smart auto power by hair density",
      "15–30 min battery, ~2 h full charge",
      "Motor type: ROTARY",
      "Use: Nose and ear hair trimming",
      "Battery life: 15–30 minutes per charge",
      "Full charge time: Up to 2 hours",
      "Smart features: Auto power selection, charge indicator",
      "Maintenance: Auto-clean system",
      "Tips included: 1–2 interchangeable nozzles",
      "Colors available: Orange, blue, black",
      "Portable design for home and travel",
    ],
    freeShipping: true,
    variants: {
      type: "color",
      label: "Color",
      default: "negro",
      options: [
        { value: "naranja", label: "Orange", swatchHex: "#F97316" },
        { value: "azul", label: "Blue", swatchHex: "#3B82F6" },
        { value: "negro", label: "Black", swatchHex: "#1A1A1A" },
      ],
    },
    translations: {
      es: {
        title: "Cortadora de pelo 2 en 1 profesional — nariz y orejas",
        description:
          "Cortadora eléctrica portátil 2 en 1 profesional para nariz y orejas. Motor ROTARY, selección inteligente de potencia, limpieza automática, batería recargable y boquillas intercambiables — ideal para cuidado personal diario en casa o viajes.",
        shortDescription:
          "Recortador 2 en 1 recargable para nariz y orejas con motor ROTARY, control inteligente de potencia y 15–30 min de autonomía.",
        longDescription: [
          "Esta cortadora de pelo eléctrica portátil 2 en 1 profesional está diseñada para uso en orejas y nariz, ofreciendo precisión y comodidad en cada uso. Ideal para cuidados personales diarios en casa o en viajes.",
          "Equipada con un motor ROTARY de alto rendimiento, garantiza un funcionamiento suave y eficiente. Su diseño permite un corte limpio y rápido, especialmente en zonas sensibles como nariz y orejas.",
          "Con una vida útil de batería de 15 a 30 minutos, ofrece suficiente autonomía para múltiples usos. La carga completa toma hasta 2 horas, ideal para uso continuo.",
          "Incluye selección automática de potencia según densidad del vello e indicador de carga. Además, el sistema de limpieza automática facilita el mantenimiento y prolonga la vida útil del producto.",
          "Disponible en naranja, azul y negro, con 1 a 2 boquillas intercambiables para ajustar el largo de corte según necesidad.",
        ],
        features: [
          "Cortadora profesional 2 en 1 nariz y orejas",
          "Motor ROTARY — corte suave y eficiente",
          "Potencia automática según densidad del vello",
          "Batería 15–30 min, carga completa ~2 h",
          "Tipo de motor: ROTARY",
          "Uso: Vello nasal y de orejas",
          "Autonomía: 15–30 minutos por carga",
          "Tiempo de carga completa: Hasta 2 horas",
          "Funciones inteligentes: Potencia automática, indicador de carga",
          "Mantenimiento: Sistema de limpieza automática",
          "Incluye: 1–2 boquillas intercambiables",
          "Colores disponibles: Naranja, azul, negro",
          "Diseño portátil para hogar y viaje",
        ],
      },
    },
  },
  {
    id: "gi-lifestyle-004",
    slug: "bluetooth-sleep-elastic-headband",
    title: "Bluetooth Sleep Elastic Headband with Wireless Audio",
    price: 25000 / 1445,
    category: "Hogar",
    salesBadge: "Super Sale",
    images: getGoodIdeasProductImagePaths("gi-lifestyle-004", 5),
    description:
      "Bluetooth 5.0 sleep elastic headband with integrated wireless earphones, active noise cancellation, button controls, and lightweight plastic build—ideal for sleep, sport, and daily rest.",
    shortDescription:
      "Elastic Bluetooth 5.0 sleep headband with ANC, integrated eye mask zone, button controls, and lightweight design for sleep and daily use.",
    longDescription: [
      "These sports-style wireless earphones deliver stable Bluetooth 5.0 audio for high-quality, uninterrupted listening during workouts or rest.",
      "Active noise cancellation reduces ambient noise for a more immersive, clearer listening experience.",
      "The elastic headband design fits comfortably for sleep, while the integrated eye mask area helps block light and improve rest quality.",
      "Button controls and adjustable volume let you manage music, calls, and settings without reaching for your phone.",
      "Made from durable, lightweight plastic—resistant and comfortable for daily wear, sport, or sleeping without bulk.",
    ],
    features: [
      "Bluetooth 5.0 — stable wireless audio",
      "Active noise cancellation (ANC)",
      "Elastic sleep headband with light-blocking mask",
      "Button controls and volume adjustment",
      "Bluetooth version: 5.0",
      "Noise cancellation: Active ANC",
      "Design: Elastic headband for sleep",
      "Controls: Button + volume control",
      "Material: Lightweight durable plastic",
      "Use: Sleep, sport, daily listening",
      "Color: Black",
    ],
    freeShipping: true,
    variants: {
      type: "color",
      label: "Color",
      default: "negro",
      options: [{ value: "negro", label: "Black", swatchHex: "#1A1A1A" }],
    },
    translations: {
      es: {
        title: "Diadema elástica Bluetooth para dormir",
        salesBadge: "Super Oferta",
        description:
          "Diadema elástica para dormir con Bluetooth 5.0, auriculares integrados, cancelación activa de ruido, controles por botón y construcción ligera en plástico — ideal para descanso, deporte y uso diario.",
        shortDescription:
          "Diadema elástica Bluetooth 5.0 para dormir con ANC, zona tipo antifaz integrada, controles y diseño ligero para descanso y día a día.",
        longDescription: [
          "Audio inalámbrico con Bluetooth 5.0: conexión estable y transmisión de audio de alta calidad sin interrupciones durante el ejercicio o el descanso.",
          "Cancelación activa de ruido: reduce eficazmente el ruido ambiental para una experiencia auditiva más inmersiva y clara.",
          "Diseño de diadema elástica para dormir: ajuste cómodo durante el sueño; la máscara de ojos integrada ayuda a bloquear la luz y mejorar la calidad del descanso.",
          "Control por botón y volumen ajustable: gestiona música, llamadas y ajustes sin usar tu dispositivo.",
          "Material duradero y ligero: fabricados en plástico, resistentes y livianos, ideales para uso diario, deporte o dormir sin incomodidad.",
        ],
        features: [
          "Bluetooth 5.0 — audio inalámbrico estable",
          "Cancelación activa de ruido (ANC)",
          "Diadema elástica para dormir con antifaz integrado",
          "Control por botón y volumen ajustable",
          "Versión Bluetooth: 5.0",
          "Cancelación de ruido: ANC activa",
          "Diseño: Diadema elástica para dormir",
          "Controles: Botón + control de volumen",
          "Material: Plástico ligero y duradero",
          "Uso: Dormir, deporte, escucha diaria",
          "Color: Negro",
        ],
      },
    },
  },
  {
    id: "gi-regalos-001",
    slug: "intelligent-ai-rc-robot-dog",
    title: "Intelligent AI RC Robot Dog — Voice, App & Remote Control",
    price: 249000 / 1445,
    category: "Tech",
    salesBadge: "Super Sale",
    images: [`${GOOD_IDEAS_IMAGE_BASE}/gi-regalos-001/image.webp`],
    description:
      "Intelligent AI remote-control robot dog with voice dialogue, singing, mobile app control, custom programming, dancing, and lithium battery included—ready to use out of the box.",
    shortDescription:
      "AI robot dog with remote control, voice dialogue, app programming, singing, and dancing—includes lithium battery, white finish.",
    longDescription: [
      "This intelligent remote-control robot dog uses AI technology for advanced interaction with children—ideal for entertainment and early robotics learning.",
      "Voice dialogue and singing respond to commands and entertain with music. Remote mobile app compatibility adds extra control.",
      "Program custom movements and routines, including dance modes. Recommended for ages 14+ who enjoy interactive, creative play.",
      "Includes a lithium battery and ships ready to use—no assembly required.",
      "Electric-powered with a compact, functional design. Made in Mainland China—a high-tech toy for modern play.",
    ],
    features: [
      "Intelligent AI robot dog with remote control",
      "Voice dialogue and singing functions",
      "Mobile app remote control and programming",
      "Dynamic movement — dance and custom routines",
      "Power: Electric",
      "Battery: Lithium included",
      "Assembly: Ready to use out of the box",
      "Recommended age: 14+",
      "Origin: Mainland China",
      "Compact functional design",
      "Color: White",
    ],
    freeShipping: true,
    variants: {
      type: "color",
      label: "Color",
      default: "blanco",
      options: [{ value: "blanco", label: "White", swatchHex: "#F5F5F5" }],
    },
    translations: {
      es: {
        title: "Robot perro inteligente AI con control remoto",
        salesBadge: "Super Oferta",
        description:
          "Robot perro inteligente con control remoto, diálogo por voz, canto, app móvil, programación personalizada, baile y batería de litio incluida — listo para usar.",
        shortDescription:
          "Robot perro AI con control remoto, diálogo por voz, app, programación, canto y baile — batería incluida, acabado blanco.",
        longDescription: [
          "Robot perro inteligente con control remoto y tecnología AI, permitiendo una interacción avanzada con los niños. Ideal para entretenimiento y aprendizaje temprano en robótica.",
          "Diálogo y canto con aplicación móvil: responde a comandos y entretiene con música. Compatible con aplicación remota para mayor control.",
          "Programación personalizada y movimiento dinámico: programá movimientos y rutinas, incluyendo bailar. Perfecto para mayores de 14 años que disfrutan de juegos interactivos y creativos.",
          "Batería de litio incluida y listo para usar al recibirlo. No requiere ensamblaje.",
          "Alimentado por energía eléctrica y diseño compacto. Fabricado en China continental — juguete de alta tecnología.",
        ],
        features: [
          "Robot perro inteligente AI con control remoto",
          "Diálogo por voz y función de canto",
          "Control y programación vía app móvil",
          "Movimiento dinámico — baile y rutinas personalizadas",
          "Alimentación: Eléctrica",
          "Batería: Litio incluida",
          "Ensamblaje: Listo para usar",
          "Edad recomendada: 14+",
          "Origen: China continental",
          "Diseño compacto y funcional",
          "Color: Blanco",
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



/** Normaliza variantes del catálogo GI para `ProductDetailClient`. */
export function resolveGoodIdeasProductVariants(
  product: Product
): ProductVariants | null {
  if (!product.variants) return null;
  const variants = Array.isArray(product.variants)
    ? product.variants
    : [product.variants];
  return { variants, variantMatrix: undefined };
}



export function localizeGoodIdeasProduct(product: Product, locale: Locale): Product {

  const localized = product.translations?.[locale];

  const merged: Product = {

    ...product,

    title: localized?.title ?? product.title,

    description: localized?.description ?? product.description,

    shortDescription: localized?.shortDescription ?? product.shortDescription,

    longDescription: localized?.longDescription ?? product.longDescription,

    features: localized?.features ?? product.features,

    salesBadge: localized?.salesBadge ?? product.salesBadge,

  };

  return applyGoodIdeasDeliveryCopy(merged, locale);

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


