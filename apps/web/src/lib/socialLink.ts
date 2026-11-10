/** Facebook и Instagram не выводим: Meta признана в РФ экстремистской (10.11.2026) */
type SocialPlatform = "vk" | "telegram";

const PLATFORM_HOST: Record<SocialPlatform, string> = {
    vk: "vk.com",
    telegram: "t.me",
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
