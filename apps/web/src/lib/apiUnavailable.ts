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
    constructor(what: string) {
        super(`API недоступен: ${what}`);
        this.name = "ApiUnavailableError";
    }
}

export function failOnApiError<T extends { kind: string }>(result: T, what: string): asserts result is Exclude<T, { kind: "error" }> {
    if (result.kind === "error") throw new ApiUnavailableError(what);
}
