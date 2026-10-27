import { Profile, ProfileById } from "@/entities/Profile";
import { Locale } from "@/entities/Locale";
import {
    getHostPersonalPageUrl,
    getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";

/**
 * Ссылка на публичный профиль собеседника из шапки чата: организатор без
 * профиля волонтёра ведёт на страницу организации, все остальные — на
 * страницу волонтёра.
 */
export function getCompanionProfileUrl(
    companion: ProfileById | Profile | undefined,
    locale: Locale,
): string | undefined {
    if (!companion?.id) return undefined;
    if (companion.hostId && !companion.volunteer) {
        return getHostPersonalPageUrl(locale, companion.hostId);
    }
    return getVolunteerPersonalPageUrl(locale, companion.id);
}
