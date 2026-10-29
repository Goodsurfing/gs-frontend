"use client";

/**
 * Загрузка Яндекс.Карт JS API 2.1 (один раз на страницу). Версия 3 с текущим
 * ключом не работает (403 «Invalid api key») — для неё нужен отдельный ключ
 * в кабинете разработчика.
 *
 * Типов у API 2.1 нет — объекты карты типизированы минимально, ровно в
 * объёме, который использует OffersMap.
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- нетипизированное API Яндекс.Карт */
export type Ymaps = any;

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY ?? "";
// Подписи на карте: испанского у Яндекс.Карт нет — для es английские
const MAP_LANG: Record<string, string> = { ru: "ru_RU", en: "en_US", es: "en_US" };
const LOAD_TIMEOUT_MS = 15_000;

let loading: Promise<Ymaps> | null = null;

export function loadYmaps(locale: string): Promise<Ymaps> {
    const win = window as unknown as { ymaps?: Ymaps };
    if (win.ymaps?.Map) return Promise.resolve(win.ymaps);
    if (loading) return loading;

    loading = new Promise<Ymaps>((resolve, reject) => {
        const script = document.createElement("script");
        const params = new URLSearchParams({ lang: MAP_LANG[locale] ?? "ru_RU" });
        if (API_KEY) params.set("apikey", API_KEY);
        script.src = `https://api-maps.yandex.ru/2.1/?${params}`;
        script.async = true;
        // Скрипт мог зависнуть (сеть, блокировщик) — без тайм-аута карта молча осталась бы пустой
        const timer = setTimeout(() => reject(new Error("Yandex Maps: тайм-аут загрузки")), LOAD_TIMEOUT_MS);
        script.onload = () => {
            if (!win.ymaps) {
                clearTimeout(timer);
                reject(new Error("Yandex Maps: нет window.ymaps"));
                return;
            }
            win.ymaps.ready(() => {
                clearTimeout(timer);
                resolve(win.ymaps);
            });
        };
        script.onerror = () => {
            clearTimeout(timer);
            reject(new Error("Yandex Maps: скрипт не загрузился"));
        };
        document.head.appendChild(script);
    }).catch((error: unknown) => {
        // Следующая попытка (кнопка «Обновить») должна грузить заново
        loading = null;
        throw error;
    });
    return loading;
}
