/**
 * Цели Яндекс.Метрики — шаги воронки: регистрация → вакансия → отклик →
 * ответ хоста; оплата членства и пожертвования; публикация вакансии хостом.
 * Цели с такими же идентификаторами нужно завести в кабинете Метрики
 * (тип «JavaScript-событие»), иначе события приходят, но не считаются.
 *
 * Счётчик подключается в index.html только на боевом домене — на стейдже и
 * локально window.ym нет, и вызовы ничего не делают.
 */
export const METRIKA_COUNTER_ID = 47422282;

export type MetrikaGoal =
    | "signup"
    | "email_confirmed"
    | "vacancy_view"
    | "application_sent"
    | "application_accepted"
    | "application_rejected"
    | "checkout_start"
    | "membership_paid"
    | "donation_start"
    | "donation_paid"
    | "vacancy_published";

type GoalParams = Record<string, string | number | boolean>;

declare global {
    interface Window {
        ym?: (counterId: number, method: "reachGoal", goal: string, params?: GoalParams) => void;
    }
}

export const trackGoal = (goal: MetrikaGoal, params?: GoalParams): void => {
    try {
        window.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal, params);
    } catch {
        // Аналитика не должна ломать интерфейс
    }
};

/**
 * Цель один раз на ключ за сессию браузера — для страниц успеха, которые
 * можно обновить или открыть повторно по ссылке.
 */
export const trackGoalOnce = (goal: MetrikaGoal, key: string, params?: GoalParams): void => {
    const storageKey = `gs_goal_${goal}_${key}`;
    try {
        if (sessionStorage.getItem(storageKey)) return;
        sessionStorage.setItem(storageKey, "1");
    } catch {
        // Без sessionStorage — просто отправляем
    }
    trackGoal(goal, params);
};
