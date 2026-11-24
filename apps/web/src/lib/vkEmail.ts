import { storageGet } from "@/lib/safeStorage";

/**
 * Почта-заглушка вместо настоящей: VK отдаёт почту не всегда, тогда бэкенд заводит
 * id…@vkontakte.ru (старые аккаунты — …@tmp.tmp). Письма на такие адреса не уходят
 * (те же домены пропускает рассылка писем в gs-backend).
 */
export function isPlaceholderEmail(email: string | null | undefined): boolean {
    return /@(vkontakte\.ru|tmp\.tmp)$/i.test((email ?? "").trim());
}

/** Когда нажали «Позже» (мс) */
export const VK_EMAIL_HIDDEN_KEY = "gs.vkEmailPromptHidden";

/** «Позже» прячет плашку на 3 дня */
export const VK_EMAIL_HIDE_MS = 3 * 24 * 60 * 60 * 1000;

export function isHiddenAt(raw: string | null, now: number): boolean {
    const at = Number(raw);
    return Number.isFinite(at) && at > 0 && now - at < VK_EMAIL_HIDE_MS;
}

export function vkEmailPromptHidden(now: number): boolean {
    return isHiddenAt(storageGet(VK_EMAIL_HIDDEN_KEY), now);
}
