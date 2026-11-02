/**
 * Язык волонтёра в форме «Навыки и умения»: id — запись из профиля; у нового
 * языка и после смены языка или уровня id нет (null), как в
 * LanguageLevelComponent старого фронта.
 */
export interface SkillsLanguage {
    id: number | null;
    language: string;
    languageLevel: string;
}

export interface SkillsDraft {
    languages: SkillsLanguage[];
    skills: number[];
    additional: string[];
    extraInfo: string;
}

/** Больше 10 языков, навыков из справочника и своих навыков не добавляется */
export const MAX_SKILL_ITEMS = 10;

/** Ключ черновика: у каждого пользователя свой, чтобы на общем компьютере черновик не достался другому */
export const skillsDraftKey = (profileId: string) => `volunteerSkillsDraft:${profileId}`;

const isLanguage = (value: unknown): value is SkillsLanguage => {
    if (!value || typeof value !== "object") return false;
    const { id, language, languageLevel } = value as Record<string, unknown>;
    return (id === null || (typeof id === "number" && Number.isInteger(id)))
        && typeof language === "string" && language !== ""
        && typeof languageLevel === "string" && languageLevel !== "";
};

/** Черновик из sessionStorage; любой неверный формат — null (берётся профиль) */
export function parseSkillsDraft(raw: string | null): SkillsDraft | null {
    if (!raw) return null;
    let value: unknown;
    try {
        value = JSON.parse(raw);
    } catch {
        return null;
    }
    if (!value || typeof value !== "object") return null;
    const { languages, skills, additional, extraInfo } = value as Record<string, unknown>;
    if (!Array.isArray(languages) || !languages.every(isLanguage)) return null;
    if (!Array.isArray(skills) || !skills.every((id) => typeof id === "number" && Number.isInteger(id))) return null;
    if (!Array.isArray(additional) || !additional.every((item) => typeof item === "string")) return null;
    if (typeof extraInfo !== "string") return null;
    return {
        languages: languages.slice(0, MAX_SKILL_ITEMS),
        skills: skills.slice(0, MAX_SKILL_ITEMS),
        additional: normalizeOwnSkills(additional).slice(0, MAX_SKILL_ITEMS),
        extraInfo,
    };
}

/** Свои навыки: без пробелов по краям, без пустых и без повторов (без учёта регистра) */
export function normalizeOwnSkills(list: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of list) {
        const text = item.trim();
        const key = text.toLocaleLowerCase();
        if (!text || seen.has(key)) continue;
        seen.add(key);
        result.push(text);
    }
    return result;
}
