import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryBySlug,
  getCategorySlugs,
  getProductsByCategorySlug,
} from "@/lib/categories";
import ProductCardSimple from "@/components/ProductCardSimple";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import { locales, type Locale } from "@/lib/i18n/config";
import { buildMetadata, formatTemplate } from "@/lib/seo";
import EditorialPostCards from "@/components/editorial/EditorialPostCards";
import {
  pickPostsForCategory,
  pickPrimaryPostForCategory,
} from "@/lib/internal-links";

type Props = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

const CATEGORY_HERO_IMAGES: Record<string, string> = {
  "mountain-snow": "/assets/images/categories/mountain-snow.webp",
  "water-sports": "/assets/images/categories/water-sports.webp",
  "outdoor-adventure": "/assets/images/hero/storysection.webp",
  "cycling-running": "/assets/images/categories/cycling.webp",
  fishing: "/assets/images/hero/fishin-hero.webp",
  "fishing-equipment": "/assets/images/hero/equipo-pesca.webp",
  "fishing-gadgets": "/assets/images/hero/accesorios-pesca.webp",
  "active-sports": "/assets/images/categories/active-sports.webp",
  trekking: "/assets/images/hero/trekking.webp",
  "camping-survival-gear": "/assets/images/hero/camping-outdoor.webp",
  "outdoor-lighting": "/assets/images/hero/iluminacion-outdoor.webp",
  "ski-snowboard":
    "/assets/images/categories/mountain-snow.webp",
  "diving-swimming-equipment": "/assets/images/hero/scuba-diving.webp",
};


// Helper para generar contenido SEO según categoría
function getCategorySEOContent(slug: string, categoryName: string) {
  const slugLower = slug.toLowerCase();
  const nameLower = categoryName.toLowerCase();

  let introText = "";
  let seoContent = "";
  let relatedCategories: string[] = [];

  if (
    slugLower.includes("fishing") ||
    nameLower.includes("fishing") ||
    nameLower.includes("pesca")
  ) {
    introText =
      "Equipamiento de pesca probado en uso real. Cañas, reeles, señuelos y accesorios seleccionados para pescadores que buscan calidad sin exageraciones. Productos que funcionan cuando importa.";
    seoContent =
      "La pesca deportiva requiere equipamiento que aguante condiciones reales: agua salada, cambios de temperatura, uso constante. En esta categoría encontrarás productos probados por pescadores, no solo por marketing. Desde cañas de acción media hasta reeles de calidad, cada producto está seleccionado por su funcionalidad real. Si estás empezando, busca equipamiento versátil que funcione en diferentes condiciones. Si ya tenés experiencia, encontrarás opciones especializadas que mejoran tu técnica. La clave está en elegir según tu tipo de pesca: de costa, embarcado, o fly fishing. Cada modalidad tiene necesidades específicas, y nuestros productos están pensados para eso.";
    relatedCategories = ["water-sports", "outdoor-adventure"];
  } else if (
    slugLower.includes("water") ||
    nameLower.includes("water") ||
    nameLower.includes("acuático")
  ) {
    introText =
      "Deportes acuáticos y actividades en el agua requieren equipamiento específico. Desde natación hasta kayak, productos que protegen y mejoran tu experiencia en el agua.";
    seoContent =
      "Los deportes acuáticos tienen necesidades únicas: resistencia al agua, flotabilidad, protección UV, y durabilidad en condiciones húmedas. Esta categoría agrupa equipamiento para diferentes actividades acuáticas, desde natación recreativa hasta deportes de aventura. Si practicás natación, buscá productos que reduzcan resistencia y mejoren comodidad. Para kayak o paddle, priorizá flotabilidad y resistencia. En todos los casos, la calidad del material marca la diferencia entre un producto que dura una temporada y uno que te acompaña años. Elegí según tu nivel de actividad: uso ocasional permite opciones más económicas, mientras que uso intensivo requiere inversión en calidad.";
    relatedCategories = ["surfing", "diving-swimming-equipment", "outdoor-adventure"];
  } else if (
    slugLower.includes("mountain") ||
    slugLower.includes("snow") ||
    nameLower.includes("montaña") ||
    nameLower.includes("nieve")
  ) {
    introText =
      "Equipamiento para montaña y actividades en la nieve. Productos que aguantan frío, altitud y condiciones extremas. Probados en terreno real, no en laboratorio.";
    seoContent =
      "La montaña y la nieve exigen equipamiento que funcione cuando las condiciones se complican. Esta categoría incluye productos para esquí, snowboard, alpinismo y actividades de alta montaña. La diferencia entre un producto genérico y uno específico para montaña está en detalles: resistencia al frío extremo, protección contra viento, y durabilidad en condiciones adversas. Si practicás esquí o snowboard, buscá productos que mantengan temperatura y permitan movimiento. Para alpinismo, priorizá ligereza sin sacrificar protección. En todos los casos, la calidad del material y la construcción determinan si un producto te protege cuando realmente lo necesitás. Elegí según tu nivel: principiante puede empezar con opciones versátiles, mientras que avanzado requiere especialización.";
    relatedCategories = ["ski-snowboard", "trekking", "outdoor-adventure"];
  } else if (
    slugLower.includes("outdoor") ||
    slugLower.includes("adventure") ||
    nameLower.includes("outdoor") ||
    nameLower.includes("aventura")
  ) {
    introText =
      "Equipamiento para aventuras al aire libre. Productos versátiles que funcionan en diferentes situaciones, desde escapadas de un día hasta expediciones de varios días.";
    seoContent =
      "Las aventuras outdoor requieren equipamiento versátil y confiable. Esta categoría agrupa productos que funcionan en diferentes situaciones: trekking, camping, exploración urbana, y viajes de aventura. La clave está en elegir productos que se adapten a múltiples contextos sin sacrificar calidad. Si planeás escapadas cortas, buscá equipamiento ligero y compacto. Para expediciones largas, priorizá durabilidad y capacidad. En todos los casos, la versatilidad es importante: un producto que funciona en diferentes condiciones te ahorra espacio y dinero. La diferencia entre equipamiento genérico y específico para outdoor está en detalles: resistencia a elementos, facilidad de uso, y durabilidad real. Elegí según tu tipo de aventura: urbana requiere ligereza, mientras que remota exige robustez.";
    relatedCategories = ["trekking", "camping-survival-gear", "active-sports"];
  } else if (
    slugLower.includes("active") ||
    slugLower.includes("sports") ||
    nameLower.includes("deporte") ||
    nameLower.includes("activo")
  ) {
    introText =
      "Deportes activos y fitness requieren equipamiento que mejore rendimiento sin complicaciones. Productos probados en uso real, sin marketing exagerado.";
    seoContent =
      "Los deportes activos y el fitness tienen necesidades específicas: comodidad durante movimiento, resistencia al sudor, y durabilidad en uso constante. Esta categoría incluye equipamiento para diferentes actividades: running, ciclismo, entrenamiento funcional, y deportes de equipo. La diferencia entre equipamiento genérico y específico para deportes activos está en cómo se comporta durante el uso real. Si practicás running, buscá productos que reduzcan impacto y mejoren comodidad. Para ciclismo, priorizá aerodinámica y protección. En entrenamiento funcional, la versatilidad es clave. En todos los casos, la calidad del material determina si un producto mejora tu rendimiento o te limita. Elegí según tu nivel de actividad: principiante puede empezar con opciones básicas, mientras que avanzado requiere especialización y calidad superior.";
    relatedCategories = ["cycling-running", "outdoor-adventure"];
  } else if (
    slugLower.includes("trekking") ||
    nameLower.includes("trekking") ||
    nameLower.includes("senderismo")
  ) {
    introText =
      "Equipamiento esencial para trekking y senderismo. Productos que aguantan caminatas largas, cambios de terreno y condiciones variables. Probados en uso real.";
    seoContent =
      "El trekking y senderismo requieren equipamiento que funcione durante horas de caminata, en diferentes terrenos y condiciones climáticas. Esta categoría incluye productos específicos para caminantes: calzado, mochilas, bastones, y accesorios de navegación. La diferencia entre equipamiento genérico y específico para trekking está en cómo se comporta durante caminatas largas. Si hacés senderismo ocasional, buscá productos versátiles y cómodos. Para trekking intensivo, priorizá durabilidad y soporte. En todos los casos, la comodidad es crucial: un producto incómodo puede arruinar una caminata. La calidad del material y la construcción determinan si un producto te acompaña kilómetros o se rompe a mitad de camino. Elegí según tu tipo de actividad: senderos marcados permiten opciones más ligeras, mientras que terreno difícil exige robustez.";
    relatedCategories = ["camping-survival-gear", "outdoor-adventure", "mountain-snow"];
  } else if (
    slugLower.includes("camping") ||
    slugLower.includes("survival") ||
    nameLower.includes("camping") ||
    nameLower.includes("supervivencia")
  ) {
    introText =
      "Equipamiento de camping y supervivencia. Productos que funcionan cuando importa: refugio, fuego, agua y seguridad. Sin exageraciones, solo funcionalidad real.";
    seoContent =
      "El camping y la supervivencia requieren equipamiento que funcione cuando las condiciones se complican. Esta categoría incluye productos esenciales: carpas, sacos de dormir, sistemas de agua, herramientas, y equipamiento de emergencia. La diferencia entre equipamiento genérico y específico para camping está en cómo se comporta en condiciones reales: lluvia, viento, frío, y uso constante. Si acampás en campings establecidos, buscá productos cómodos y fáciles de armar. Para camping salvaje, priorizá ligereza y resistencia. En supervivencia, la confiabilidad es crítica: un producto que falla puede ser peligroso. La calidad del material y la construcción determinan si un producto te protege o te deja expuesto. Elegí según tu tipo de actividad: camping recreativo permite opciones más cómodas, mientras que supervivencia exige confiabilidad absoluta.";
    relatedCategories = ["trekking", "outdoor-adventure", "mountain-snow"];
  } else if (
    slugLower.includes("cycling") ||
    slugLower.includes("bike") ||
    nameLower.includes("ciclismo") ||
    nameLower.includes("bicicleta")
  ) {
    introText =
      "Equipamiento para ciclistas. Productos que mejoran rendimiento, comodidad y seguridad. Probados en uso real, desde paseos urbanos hasta rutas de montaña.";
    seoContent =
      "El ciclismo requiere equipamiento específico que mejore rendimiento sin sacrificar comodidad. Esta categoría incluye productos para diferentes tipos de ciclismo: urbano, de montaña, de ruta, y recreativo. La diferencia entre equipamiento genérico y específico para ciclismo está en cómo se comporta durante pedaleo prolongado. Si practicás ciclismo urbano, buscá productos que mejoren visibilidad y comodidad. Para montaña, priorizá protección y resistencia. En ruta, la aerodinámica es clave. En todos los casos, la calidad del material determina si un producto mejora tu experiencia o te limita. La comodidad durante horas de pedaleo es crucial: un producto incómodo puede arruinar un paseo. Elegí según tu tipo de ciclismo: recreativo permite opciones más económicas, mientras que competitivo exige especialización.";
    relatedCategories = ["active-sports", "cycling-running", "outdoor-adventure"];
  } else if (
    slugLower.includes("running") ||
    nameLower.includes("running") ||
    nameLower.includes("correr")
  ) {
    introText =
      "Equipamiento para runners. Productos que mejoran rendimiento, reducen impacto y aumentan comodidad. Probados en kilómetros reales, no en laboratorio.";
    seoContent =
      "El running requiere equipamiento que funcione durante kilómetros de carrera, reduciendo impacto y mejorando comodidad. Esta categoría incluye productos específicos para corredores: calzado, ropa técnica, accesorios de hidratación, y equipamiento de entrenamiento. La diferencia entre equipamiento genérico y específico para running está en cómo se comporta durante carrera prolongada. Si corrés ocasionalmente, buscá productos versátiles y cómodos. Para entrenamiento intensivo, priorizá soporte y amortiguación. En todos los casos, la comodidad es crucial: un producto incómodo puede causar lesiones. La calidad del material y la construcción determinan si un producto mejora tu rendimiento o te limita. La amortiguación y el soporte son especialmente importantes para reducir impacto en articulaciones. Elegí según tu tipo de running: recreativo permite opciones más económicas, mientras que competitivo exige especialización y calidad superior.";
    relatedCategories = ["active-sports", "cycling-running", "outdoor-adventure"];
  } else {
    // Fallback genérico
    introText =
      "Equipamiento outdoor funcional, probado en uso real. Productos que aguantan cuando importa, sin marketing exagerado.";
    seoContent =
      "Esta categoría agrupa equipamiento outdoor seleccionado por su funcionalidad real. Cada producto está pensado para uso en condiciones reales, no solo para marketing. La diferencia entre equipamiento genérico y específico para outdoor está en cómo se comporta cuando realmente lo necesitás. Elegí según tu nivel de actividad y tipo de uso: principiante puede empezar con opciones versátiles, mientras que avanzado requiere especialización. La calidad del material y la construcción determinan si un producto te acompaña años o se rompe rápido. Priorizá funcionalidad sobre características innecesarias.";
    relatedCategories = ["outdoor-adventure", "active-sports"];
  }

  return { introText, seoContent, relatedCategories };
}

export async function generateStaticParams() {
  const slugs = getCategorySlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoría no encontrada | Go Natural",
    };
  }

  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const seo = messages.seo?.category;
  const categoryLabel = t(`categories.names.${category.slug}`, category.name);
  const title = formatTemplate(
    seo?.titleTemplate || "{category} | Go Natural",
    { category: categoryLabel }
  );
  const description = formatTemplate(
    seo?.descriptionTemplate ||
      "Equipamiento de {category} curado para exploración tranquila y capaz.",
    { category: categoryLabel }
  );
  const heroImage =
    CATEGORY_HERO_IMAGES[slug] || "/assets/images/products/gn-outdoor-002/featured01.webp";
  const pathByLocale = locales.reduce(
    (acc, localeKey) => ({
      ...acc,
      [localeKey]: `/${localeKey}/category/${slug}`,
    }),
    {} as Record<Locale, string>
  );

  return buildMetadata({
    locale,
    title,
    description,
    pathByLocale,
    ogImage: heroImage,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategorySlug(slug);
  const messages = await getMessages(locale);
  const t = createTranslator(messages);
  const heroImage =
    CATEGORY_HERO_IMAGES[slug] || "/assets/images/products/gn-outdoor-002/featured01.webp";
  const editorialIntro = category.description;

  const categoryLabel = t(`categories.names.${category.slug}`, category.name);
  // H1 optimizado para SEO
  const seoH1 =
    categoryLabel.includes("para") || categoryLabel.includes("de")
      ? categoryLabel
      : `${categoryLabel}`;

  const primaryStory = pickPrimaryPostForCategory(slug, messages.blog.posts);
  const primaryStoryHref = primaryStory
    ? `/${locale}/blog/${primaryStory.slug}`
    : "";
  const primaryStoryTitle = primaryStory?.post?.title || "";

  const fieldStories = pickPostsForCategory(slug, messages.blog.posts, 3)
    .map(([postSlug, post]) => ({
      href: `/${locale}/blog/${postSlug}`,
      title: post.title,
      image:
        post.heroImage ||
        post.sections?.[0]?.image ||
        "/assets/images/blog/blog-hero.webp",
    }))
    .filter(
      (post): post is { href: string; title: string; image: string } =>
        Boolean(post.title)
    );

  return (
    <main className="bg-warm-sand text-dark-base">
      {/* Category Hero */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={`${category.name} hero`}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-base/60 via-dark-base/40 to-dark-base/90" />
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16 md:pb-20">
            <h1 className="font-sans text-4xl md:text-5xl font-semibold text-text-primary">
              {seoH1}
            </h1>
          </div>
        </div>
      </section>

      {/* Editorial intro */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl">
            {editorialIntro}
          </p>
          {primaryStoryTitle && (
            <p className="mt-6 text-sm text-text-muted max-w-2xl">
              {t("categoriesPage.editorialIntro")}{" "}
              <Link
                href={primaryStoryHref}
                className="text-text-primary hover:text-accent-gold transition-colors duration-200"
              >
                {primaryStoryTitle}
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Product grid */}
      {products.length > 0 ? (
        <section className="pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCardSimple
                  key={product.id}
                  product={product}
                  locale={locale}
                  analyticsListId={slug}
                  analyticsListName={`category:${slug}`}
                  labels={{
                    viewProduct: t("common.viewProduct"),
                    addToCart: t("common.addToCart"),
                    noImage: t("common.noImage"),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <p className="text-lg text-text-primary mb-3">
              {t("categoriesPage.emptyTitle")}
            </p>
            <p className="text-sm text-text-muted mb-8">
              {t("categoriesPage.emptyText")}
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-md bg-accent-gold px-6 py-3 text-sm font-medium text-dark-base"
            >
              {t("categoriesPage.ctaButton")}
            </Link>
          </div>
        </section>
      )}

      <EditorialPostCards
        title={t("categoriesPage.fieldStoriesTitle")}
        posts={fieldStories}
      />

      {/* Final soft CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="font-sans text-2xl md:text-3xl font-semibold text-text-primary">
            {t("categoriesPage.ctaTitle")}
          </h2>
          <div className="mt-6">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-md bg-accent-gold px-6 py-3 text-sm font-medium text-dark-base"
            >
              {t("categoriesPage.ctaButton")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

