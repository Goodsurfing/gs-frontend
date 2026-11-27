import { type Day, dayFromApi, dayFromParts, dayParts } from "@/lib/offerWizard";

/**
 * Даты в отклике на вакансию (GS-290, решение команды 18.11.2026).
 *
 * - У организатора конкретные периоды (смены) — волонтёр выбирает один из
 *   них, свои даты не вводит. Прошедшие периоды не показываются; у идущего
 *   сейчас начало — сегодня.
 * - Период длиннее, чем можно пробыть (сезон «с мая по октябрь, до 45 дней»), —
 *   окно: выбрав его, волонтёр уточняет даты внутри, мы их подсказываем.
 * - «Можно в любое время», периодов нет или все прошли — даты подсказаны
 *   (через неделю, на минимальный срок или две недели), их можно поменять, а
 *   точные — обсудить с организатором в переписке.
 */

/** Период для выбора: start ≥ сегодня; window — даты внутри выбирает волонтёр */
export interface ApplyPeriod { start: Day; end: Day; window: boolean }

export type ApplyDates =
    | { kind: "periods"; periods: ApplyPeriod[]; minDays: number }
    | { kind: "free"; suggestion: { start: Day; end: Day } };

/** Поле «Когда» вакансии из GET /api/v1/vacancies/{id} (у периода конец — ending) */
export interface WhenFields {
    isFullYearAcceptable?: boolean | null;
    durationMinDays?: number | null;
    durationMaxDays?: number | null;
    periods?: { start?: string | null; ending?: string | null }[] | null;
}

/** Сколько дней без указанного организатором срока подсказываем по умолчанию */
export const DEFAULT_STAY_DAYS = 14;
/** Через сколько дней начинать подсказанные даты: время собраться в дорогу */
export const DEFAULT_LEAD_DAYS = 7;
/** Период длиннее месяца без «максимального срока» — это сезон, а не смена */
const WINDOW_DAYS = 31;

export function addDays(day: Day, count: number): Day {
    const [year, month, date] = dayParts(day);
    const result = new Date(year, month - 1, date + count);
    return dayFromParts(result.getFullYear(), result.getMonth() + 1, result.getDate());
}

/** Дней от start до end включительно */
export function daysBetween(start: Day, end: Day): number {
    const [y1, m1, d1] = dayParts(start);
    const [y2, m2, d2] = dayParts(end);
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000) + 1;
}

const stayDays = (minDays: number) => (minDays > 0 ? minDays : DEFAULT_STAY_DAYS);

export function applyDates(when: WhenFields | null | undefined, now: Day): ApplyDates {
    const minDays = Math.max(0, when?.durationMinDays ?? 0);
    const maxDays = Math.max(0, when?.durationMaxDays ?? 0);
    const limit = maxDays > 0 ? maxDays : WINDOW_DAYS;
    const seen = new Set<string>();
    const periods: ApplyPeriod[] = [];
    if (!when?.isFullYearAcceptable) {
        for (const period of when?.periods ?? []) {
            const from = dayFromApi(period.start);
            const end = dayFromApi(period.ending);
            if (!from || !end || end < now || end < from) continue;
            const start = from < now ? now : from;
            const key = `${start}|${end}`;
            if (seen.has(key)) continue;
            seen.add(key);
            periods.push({ start, end, window: daysBetween(start, end) > limit });
        }
    }
    if (periods.length > 0) {
        periods.sort((a, b) => (a.start === b.start ? a.end.localeCompare(b.end) : a.start.localeCompare(b.start)));
        return { kind: "periods", periods, minDays };
    }
    const start = addDays(now, DEFAULT_LEAD_DAYS);
    return { kind: "free", suggestion: { start, end: addDays(start, stayDays(minDays) - 1) } };
}

/** Даты при выборе периода: смена — целиком, окно — подсказка с его начала на минимальный срок */
export function termsForPeriod(period: ApplyPeriod, minDays: number): { start: Day; end: Day } {
    if (!period.window) return { start: period.start, end: period.end };
    const end = addDays(period.start, stayDays(minDays) - 1);
    return { start: period.start, end: end > period.end ? period.end : end };
}

/** Номер периода, в который попадают даты (для отмеченной кнопки), или -1 */
export function periodIndex(periods: ApplyPeriod[], terms: { start: Day | null; end: Day | null }): number {
    if (!terms.start || !terms.end) return -1;
    return periods.findIndex((period) => (period.window
        ? terms.start! >= period.start && terms.end! <= period.end
        : terms.start === period.start && terms.end === period.end));
}

/** Начальные даты формы: единственный период — сразу выбран, несколько — ждём выбора, без периодов — подсказка */
export function initialTerms(dates: ApplyDates): { start: Day | null; end: Day | null } {
    if (dates.kind === "free") return dates.suggestion;
    const [only] = dates.periods;
    return dates.periods.length === 1 && only ? termsForPeriod(only, dates.minDays) : { start: null, end: null };
}

/** Предел текста «Пару слов о себе» — как у сообщения в переписке (бэкенд, GS-290) */
export const APPLY_MESSAGE_MAX = 1000;

/**
 * Общие условия вакансии над выбором дат (сдача тестировщицы 27.11.2026): сроки
 * проекта — «круглый год» или от самого раннего начала до самого позднего конца
 * периодов, и минимальный/максимальный срок участия. Чего нет — null, строка
 * не показывается.
 */
export interface OfferTerms {
    project: { kind: "fullYear" } | { kind: "range"; start: Day; end: Day } | null;
    minDays: number | null;
    maxDays: number | null;
}

export function offerTerms(when: WhenFields | null | undefined): OfferTerms {
    const positive = (value: number | null | undefined) => (value && value > 0 ? value : null);
    let start: Day | null = null;
    let end: Day | null = null;
    for (const period of when?.periods ?? []) {
        const from = dayFromApi(period.start);
        const to = dayFromApi(period.ending);
        if (!from || !to || to < from) continue;
        if (!start || from < start) start = from;
        if (!end || to > end) end = to;
    }
    const project: OfferTerms["project"] = when?.isFullYearAcceptable
        ? { kind: "fullYear" }
        : start && end ? { kind: "range", start, end } : null;
    return { project, minDays: positive(when?.durationMinDays), maxDays: positive(when?.durationMaxDays) };
}
