type SocialPlatform = "vk" | "telegram" | "facebook" | "instagram";

const PLATFORM_HOST: Record<SocialPlatform, string> = {
    vk: "vk.com",
    telegram: "t.me",
    facebook: "facebook.com",
    instagram: "instagram.com",
};

/**
 * Соцсеть из профиля — полный адрес: пользователи вводят и ссылку, и
 * «@имя» (getSocialLink старого фронта). Пусто — undefined.
 */
export function socialLink(value: string | null | undefined, platform: SocialPlatform): string | undefined {
    const trimmed = value?.trim();
    if (!trimmed) return undefined;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${PLATFORM_HOST[platform]}/${trimmed.replace(/^@/, "")}`;
}
