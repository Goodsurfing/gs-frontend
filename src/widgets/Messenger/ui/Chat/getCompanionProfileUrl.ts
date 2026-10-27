import { Profile, ProfileById } from "@/entities/Profile";
import { Locale } from "@/entities/Locale";
import {
    getHostPersonalPageUrl,
    getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";

/**
 * Ссылка на публичный профиль собеседника из шапки чата.
 *
 * Переписка почти всегда идёт между волонтёром и организатором, поэтому
 * ссылка ведёт на ту сторону собеседника, с которой общается текущий
 * пользователь:
 * - только волонтёр → профиль волонтёра;
 * - только организатор → страница организации;
 * - и то и другое → организация, если смотрит волонтёр (без своей
 *   организации), и профиль волонтёра, если смотрит организатор.
 */
export function getCompanionProfileUrl(
    companion: ProfileById | Profile | undefined,
    locale: Locale,
    viewerIsHost: boolean,
): string | undefined {
    if (!companion?.id) return undefined;
    const companionHostId = companion.hostId;
    if (companionHostId && (!companion.volunteer || !viewerIsHost)) {
        return getHostPersonalPageUrl(locale, companionHostId);
    }
    return getVolunteerPersonalPageUrl(locale, companion.id);
}
