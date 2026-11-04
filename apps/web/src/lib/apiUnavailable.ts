/** Ответ 4xx — данных нет (не найдено, скрыто, неверный адрес): странице показывать сообщение, это не сбой */
export function isClientError(status: number): boolean {
    return status >= 400 && status < 500;
}

/**
 * Сбой API (5xx, таймаут, сеть) на странице с кэшем (ISR). Страница бросает эту ошибку, а не рисует
 * «произошла ошибка»: упавшую перерисовку Next не кэширует и продолжает отдавать прошлую удачную копию,
 * а сообщение об ошибке осталось бы в кэше до следующего обновления (revalidate). Если удачной копии
 * ещё нет — экран ошибки раздела ([locale]/error.tsx) с шапкой и подвалом.
 */
export class ApiUnavailableError extends Error {
    /** Что не загрузилось (вакансия 4257, blog slug…) — для логов; в тексте ошибки его нет */
    readonly what: string;

    constructor(what: string) {
        // Текст одинаковый для всех страниц: Bugsink группирует события по тексту, и с id
        // в тексте минутный перезапуск бэкенда давал десятки отдельных карточек (04.11: 95
        // событий на проде). Какая страница — видно по адресу запроса в событии.
        super("API недоступен — страница отдана из кэша или показан экран ошибки");
        this.name = "ApiUnavailableError";
        this.what = what;
    }
}

export function failOnApiError<T extends { kind: string }>(result: T, what: string): asserts result is Exclude<T, { kind: "error" }> {
    if (result.kind === "error") throw new ApiUnavailableError(what);
}
