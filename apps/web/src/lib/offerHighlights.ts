import { conditionName, timeTypeText, workTimeType } from "@/lib/offerText";

type Translate = (key: string) => string;

/** Поля вакансии, из которых собирается «главное кратко» (как в ответе API) */
export interface HighlightSource {
    condition?: { houses?: { name: string }[] | null; foods?: { name: string }[] | null } | null;
    whatToDo?: { hour?: number | null; timeType?: string | null; dayOff?: number | null } | null;
    when?: { durationMinDays?: number | null } | null;
}

/**
 * «Главное кратко» в обложке вакансии: жильё, питание, сколько работать и
 * минимальный срок — то, по чему решают «ехать или нет», не листая страницу
 * (на телефоне страница вакансии — 6 экранов). Пустое поле — без плашки.
 */
export function offerHighlights(offer: HighlightSource, t: Translate): string[] {
    const result: string[] = [];
    const house = offer.condition?.houses?.map((item) => conditionName(item.name, t)).find(Boolean);
    if (house) result.push(house);
    const food = offer.condition?.foods?.map((item) => conditionName(item.name, t)).find(Boolean);
    if (food) result.push(food);
    const todo = offer.whatToDo;
    if (todo?.hour) {
        result.push(t("highlights.hours").replace("{hours}", String(todo.hour)).replace("{per}", timeTypeText(workTimeType(todo.hour, todo.timeType), t)));
    }
    if (todo?.dayOff) result.push(t("highlights.dayOff").replace("{n}", String(todo.dayOff)));
    if (offer.when?.durationMinDays) result.push(t("highlights.minDays").replace("{n}", String(offer.when.durationMinDays)));
    return result;
}

/** Дата из API «d.m.Y» → число YYYYMMDD для сравнения (без new Date: часовые пояса не нужны) */
function dayKey(value: string | null | undefined): number | null {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value ?? "");
    return match ? Number(`${match[3]}${match[2]}${match[1]}`) : null;
}

function shortPeriod(start: string, end: string): string {
    // 20.07.2026 — 24.07.2026 → 20.07–24.07.2026; разные годы — полностью
    return start.slice(6) === end.slice(6) ? `${start.slice(0, 5)}–${end}` : `${start}–${end}`;
}

export interface DatesChip {
    text: string;
    /** Даты прошли — пометка-предупреждение */
    passed: boolean;
}

/**
 * Пометка «когда» в обложке (решение 10.11.2026: «когда?» — второй вопрос после «что это?»).
 * Ближайший ещё не закончившийся период («+N», если впереди есть ещё); все прошли — «Даты прошли»;
 * периодов нет и «круглый год» — «Круглый год»; иначе пометки нет.
 */
export function offerDatesChip(
    when: { periods?: { start: string; end: string }[] | null; isFullYearAcceptable?: boolean | null } | null | undefined,
    datesPassed: boolean | undefined,
    t: Translate,
    today: string,
): DatesChip | null {
    const periods = (when?.periods ?? []).filter((period) => dayKey(period.start) !== null && dayKey(period.end) !== null);
    const todayKey = dayKey(today) ?? 0;
    const upcoming = periods
        .filter((period) => (dayKey(period.end) ?? 0) >= todayKey)
        .sort((a, b) => (dayKey(a.start) ?? 0) - (dayKey(b.start) ?? 0));
    if (upcoming[0]) {
        const more = upcoming.length > 1 ? ` +${upcoming.length - 1}` : "";
        return { text: shortPeriod(upcoming[0].start, upcoming[0].end) + more, passed: false };
    }
    if (datesPassed || periods.length > 0) return { text: t("highlights.datesPassed"), passed: true };
    if (when?.isFullYearAcceptable) return { text: t("highlights.fullYear"), passed: false };
    return null;
}

/** Части адреса, которые на первом экране ничего не добавляют: страна по умолчанию, муниципальные деления, кадастровые кварталы и номера */
const ADDRESS_NOISE = /^(Россия|Russia|Российская Федерация)$|муниципальн|городское поселение|сельское поселение|городской округ|сельсовет|район$|^квартал\s|^[\d:\s-]+$/i;

/**
 * Короткий адрес для обложки и карточек: без «Россия» и муниципальных делений, не больше двух
 * частей. «Пинежский муниципальный округ, Архангельская область, Россия, Пинежский заповедник» →
 * «Архангельская область, Пинежский заповедник». Полный адрес — в разделе «Местоположение».
 */
export function shortAddress(address: string | null | undefined): string {
    const parts = (address ?? "").split(",").map((part) => part.trim()).filter(Boolean);
    const meaningful = parts.filter((part) => !ADDRESS_NOISE.test(part));
    return (meaningful.length > 0 ? meaningful : parts).slice(0, 2).join(", ");
}
