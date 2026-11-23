/** Шаги «С чего начать» (06.11.2026): что сделано у новичка — по профилю из сессии */
export type StartStep = "apply" | "intro" | "directions";

export interface StartState {
    /** Куда сразу уйти, если страница не нужна; null — показываем шаги */
    redirect: "host" | "volunteer" | null;
    done: Record<StartStep, boolean>;
}

export function startState(profile: Record<string, unknown>): StartState {
    const name = typeof profile.firstName === "string" ? profile.firstName.trim() : "";
    const favorite = Array.isArray(profile.favoriteCategories) ? profile.favoriteCategories : [];
    const done = {
        // Роль волонтёра появляется при первом «Участвовать» (#857) — значит, отклик уже был
        apply: !!profile.volunteer,
        intro: !!name && !!profile.image,
        directions: favorite.length > 0,
    };
    // Организатору — на его рабочий стол. Кто уже откликался — на рабочий стол волонтёра: там
    // «Следующий шаг» подскажет остальное, а «С чего начать» при каждом входе раздражало бы
    if (profile.hostId) return { redirect: "host", done };
    if (done.apply) return { redirect: "volunteer", done };
    return { redirect: null, done };
}
