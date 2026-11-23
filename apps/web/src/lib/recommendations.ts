/** «Почему подходит» под рекомендацией в дашборде волонтёра (GS-256); {value} — что совпало */
export interface WhyLabels { title: string; category: string; skill: string; language: string; rating: string; top: string }

/** «ваше направление «Экология»», «язык: английский» — подпись причины */
export function whyText(reason: { type: string; value: string }, labels: WhyLabels, locale: string): string {
    switch (reason.type) {
        case "category": return labels.category.replace("{value}", reason.value);
        case "skill": return labels.skill.replace("{value}", reason.value);
        case "language": {
            let name = reason.value;
            try {
                name = new Intl.DisplayNames([locale], { type: "language" }).of(reason.value) ?? reason.value;
            } catch {
                // Неизвестный код языка — как есть
            }
            return labels.language.replace("{value}", name);
        }
        case "rating": return labels.rating.replace("{value}", reason.value.replace(".", locale === "en" ? "." : ","));
        case "top": return labels.top;
        default: return "";
    }
}
