const VK_STATS = /^https:\/\/id\.vk\.(ru|com)\/stat_events/;

/**
 * SDK VK ID шлёт свою статистику (id.vk.ru/stat_events_vkid_sdk) и не
 * обрабатывает сбой запроса: блокировщик рекламы или CORS (стейдж не в
 * списке адресов приложения VK) дают необработанный «Failed to fetch» —
 * шум в Bugsink, на вход не влияет. Неудачный запрос статистики отвечаем
 * пустым ответом; остальные запросы не трогаем.
 */
export function muteVkStatsErrors(target: { fetch: typeof fetch } = window): void {
    const original = target.fetch;
    if ((original as { vkStatsGuard?: true }).vkStatsGuard) return;
    const guarded = ((input: RequestInfo | URL, init?: RequestInit) => {
        const request = original.call(target, input, init);
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        return VK_STATS.test(url) ? request.catch(() => new Response(null, { status: 204 })) : request;
    }) as typeof fetch & { vkStatsGuard?: true };
    guarded.vkStatsGuard = true;
    target.fetch = guarded;
}
