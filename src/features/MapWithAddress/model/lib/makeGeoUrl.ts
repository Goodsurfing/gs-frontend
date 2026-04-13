export const makeGeoUrl = (geocode: string) => {
    const url = new URL("https://geocode-maps.yandex.ru/1.x");
    const format = "json";
    const geocodeParam = geocode;
    url.searchParams.set("apikey", import.meta.env.VITE_API_YANDEX_KEY || "");
    url.searchParams.set("format", format);
    url.searchParams.set("geocode", geocodeParam);
    return url.toString();
};
