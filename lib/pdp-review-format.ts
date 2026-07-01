export function formatReviewDate(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function reviewAuthorInitial(author?: string | null): string {
  const trimmed = author?.trim();
  if (!trimmed) return "?";
  const letter = trimmed.charAt(0).toUpperCase();
  return /[A-ZÁÉÍÓÚÑÜ]/i.test(letter) ? letter : "?";
}
