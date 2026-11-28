/**
 * Общее для входа через внешние аккаунты (VK ID, Яндекс ID): ответ входа
 * бэкенда одинаковый (как у GET /api/v1/vk/jwt-token), дальше — сохранить
 * вход, засчитать регистрацию в Метрике и вернуть туда, откуда пришли
 * (возврат — returnAfterAuth из authSession, PR #979).
 */
import { reachGoalThen } from "@/components/analytics/YandexMetrika";
import { type Locale, localePrefix } from "@/i18n/config";
import { forgetReturnAfterAuth, returnAfterAuth, saveSession, storedAuthHeaders, type TokenResponse } from "@/lib/authSession";
import { API_URL } from "@/lib/browserApi";

/** Ответ входа через внешний аккаунт: токены, пользователь, isNew — аккаунт создан этим входом */
export type SocialLoginResponse = TokenResponse & { user?: { email?: string; roles?: string[] }; isNew?: boolean };

/**
 * Сохранить вход из ответа бэкенда и затем вызвать next. Аккаунт создан этим
 * входом — цель «регистрация» с method, она успевает уйти до перехода
 * (reachGoalThen ждёт ответа счётчика). Нет токена в ответе — false, next не вызывается.
 */
export function completeSocialLogin(data: SocialLoginResponse | null | undefined, method: "vk" | "yandex", next: () => void): boolean {
    if (!data?.accessToken) return false;
    saveSession({ ...data, roles: data.user?.roles ?? data.roles }, data.user?.email ?? "");
    if (data.isNew) reachGoalThen("signup", { method }, next);
    else next();
    return true;
}

/** Согласие на рассылку с регистрации (после входа через внешний аккаунт); ошибки не мешают входу */
export async function saveRegistrationConsent(wording: string): Promise<void> {
    await fetch(`${API_URL}/api/v1/profile/marketing-consent`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...storedAuthHeaders() },
        body: JSON.stringify({ consent: true, source: "registration", wording }),
    }).catch(() => undefined);
}

/** Куда вести после входа: туда, откуда пришли (?next=… или запомненное), иначе fallback */
export function afterAuthTarget(locale: Locale, fallback: string): string {
    return returnAfterAuth(localePrefix(locale)) ?? fallback;
}

/** Перейти после входа и забыть запомненный возврат */
export function goAfterAuth(target: string) {
    forgetReturnAfterAuth();
    window.location.href = target;
}
