export type VideoPlatform = "tiktok" | "instagram" | "manual";

export type ResolvedVideoEmbed = {
  platform: VideoPlatform;
  embedUrl: string | null;
  externalUrl: string;
};

export function detectVideoPlatform(url: string): VideoPlatform {
  if (/tiktok\.com/i.test(url)) return "tiktok";
  if (/instagram\.com/i.test(url)) return "instagram";
  return "manual";
}

export function resolveTikTokVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/i);
  return match?.[1] ?? null;
}

export function resolveInstagramReelId(url: string): string | null {
  const match = url.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/i);
  return match?.[1] ?? null;
}

export function resolveVideoEmbed(url: string): ResolvedVideoEmbed {
  const platform = detectVideoPlatform(url);
  const externalUrl = url.trim();

  if (platform === "tiktok") {
    const id = resolveTikTokVideoId(externalUrl);
    return {
      platform,
      externalUrl,
      embedUrl: id ? `https://www.tiktok.com/embed/v2/${id}` : null,
    };
  }

  if (platform === "instagram") {
    const id = resolveInstagramReelId(externalUrl);
    return {
      platform,
      externalUrl,
      embedUrl: id
        ? `https://www.instagram.com/reel/${id}/embed`
        : null,
    };
  }

  return {
    platform: "manual",
    externalUrl,
    embedUrl: externalUrl,
  };
}
