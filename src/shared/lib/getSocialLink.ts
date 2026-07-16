type SocialPlatform = "vk" | "telegram" | "facebook" | "instagram";

const PLATFORM_HOST: Record<SocialPlatform, string> = {
    vk: "vk.com",
    telegram: "t.me",
    facebook: "facebook.com",
    instagram: "instagram.com",
};

/**
 * Профильные соцсети хранятся как произвольный текст (пользователи вводят как
 * полный URL, так и просто хэндл вида "@username"), а рендерятся как <a href>.
 * Хэндл без протокола становится относительной ссылкой на текущий сайт вместо
 * перехода в соцсеть — нормализуем к полному https-URL.
 */
export const getSocialLink = (
    value: string | null | undefined,
    platform: SocialPlatform,
): string | undefined => {
    if (!value) return undefined;

    const trimmed = value.trim();
    if (trimmed === "") return undefined;

    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    const handle = trimmed.replace(/^@/, "");
    return `https://${PLATFORM_HOST[platform]}/${handle}`;
};
