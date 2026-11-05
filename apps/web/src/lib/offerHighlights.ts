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
