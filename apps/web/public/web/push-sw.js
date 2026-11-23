/*
 * Веб-пуши Goodsurfing: показывает уведомление о новом сообщении или заявке и
 * открывает переписку по нажатию. Только пуши — страницы и запросы не
 * перехватывает (fetch не слушает), поэтому кэш и офлайн сайта не меняются.
 * Данные пуша (gs-backend WebPushSender): { title, body, url, tag, data }.
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
    let payload = {};
    try {
        payload = event.data ? event.data.json() : {};
    } catch {
        payload = { body: event.data ? event.data.text() : "" };
    }
    const url = new URL(payload.url || "/messenger", self.location.origin).href;
    event.waitUntil((async () => {
        // Человек сейчас в этой переписке на виду — сообщение он и так видит
        const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        if (windows.some((client) => client.visibilityState === "visible" && client.url.split(/[?#]/)[0] === url)) return;
        await self.registration.showNotification(payload.title || "GoodSurfing", {
            body: payload.body || "",
            icon: "/web/icons/app/icon-192.png",
            badge: "/favicon.png",
            tag: payload.tag || undefined,
            renotify: !!payload.tag,
            data: { url },
        });
    })());
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || new URL("/messenger", self.location.origin).href;
    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        // Уже открытая вкладка сайта — в неё, иначе новая
        const tab = windows.find((client) => new URL(client.url).origin === self.location.origin);
        if (tab) {
            await tab.focus();
            if ("navigate" in tab) return tab.navigate(url).catch(() => self.clients.openWindow(url));
            return undefined;
        }
        return self.clients.openWindow(url);
    })());
});
